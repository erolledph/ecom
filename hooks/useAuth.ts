import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserProfile, UserProfile, updateUserRoleAndPremiumStatus, hasTrialExpired } from '@/lib/auth';
import { updateStore } from '@/lib/store';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('👤 useAuth: Component mounting...');
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('👤 useAuth: Main effect triggered', { mounted, windowDefined: typeof window !== 'undefined' });
    if (!mounted || typeof window === 'undefined') return;
    
    const initAuth = async () => {
      console.log('👤 useAuth: Starting auth initialization...');
      try {
        if (!auth) {
          console.log('❌ useAuth: Auth not available, setting loading to false');
          setLoading(false);
          return;
        }

        console.log('👤 useAuth: Setting up onAuthStateChanged listener...');
        const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log('👤 useAuth: Auth state changed', {
            userExists: !!user,
            userEmail: user?.email,
            userId: user?.uid
          });
          setUser(user);

          if (user) {
            console.log('👤 useAuth: User found, setting up profile listener...');
            // Set up real-time listener for user profile changes
            const userDocRef = doc(db, 'users', user.uid);
            const profileUnsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
              console.log('👤 useAuth: Profile snapshot received', {
                exists: docSnapshot.exists(),
                docId: docSnapshot.id
              });
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log('👤 useAuth: Profile data found', {
                  email: data.email,
                  role: data.role,
                  isPremium: data.isPremium,
                  trialEndDate: data.trialEndDate
                });
                const profile: UserProfile = {
                  uid: user.uid,
                  email: user.email || data.email || '',
                  ...data,
                  createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                  updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
                  trialEndDate: data.trialEndDate?.toDate ? data.trialEndDate.toDate() : data.trialEndDate
                };

                // Check if trial has expired and needs to be enforced
                if (hasTrialExpired(profile) && profile.isPremium === true && !profile.isPremiumAdminSet) {
                  console.log('👤 useAuth: Trial expired, enforcing limitations...');
                  try {
                    // Update user profile to remove premium status
                    await updateUserRoleAndPremiumStatus(user.uid, {
                      isPremium: false
                    });

                    // Update store settings to disable premium features
                    await updateStore(user.uid, {
                      widgetEnabled: false,
                      bannerEnabled: false,
                      showCategories: false
                    });

                    console.log('👤 useAuth: Trial expiration enforced successfully');
                    // The onSnapshot will automatically update with the new data
                  } catch (error) {
                    console.error('Error enforcing trial expiration:', error);
                    // Still set the profile even if update fails
                    setUserProfile(profile);
                  }
                } else {
                  console.log('👤 useAuth: Setting user profile');
                  setUserProfile(profile);
                }
              } else {
                console.log('👤 useAuth: No profile document found');
                setUserProfile(null);
              }
              console.log('👤 useAuth: Setting loading to false (with profile)');
              setLoading(false);
            }, (error) => {
              console.error('❌ useAuth: Error listening to user profile changes:', error);
              
              // Handle permission denied errors gracefully
              if (error && typeof error === 'object' && 'code' in error && error.code === 'permission-denied') {
                console.log('🔒 useAuth: Permission denied for profile listener - user may not have profile yet');
                // For permission denied, still set loading to false but keep profile as null
                setUserProfile(null);
                setLoading(false);
                return;
              }
              
              console.log('❌ useAuth: Profile listener error, setting profile to null');
              setUserProfile(null);
              setLoading(false);
            });

            // Store the profile unsubscribe function for cleanup
            return profileUnsubscribe;
          } else {
            console.log('👤 useAuth: No user found, setting profile to null and loading to false');
            setUserProfile(null);
            setLoading(false);
            return undefined;
          }
        });

        return authUnsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        console.log('❌ useAuth: Auth initialization failed, setting loading to false');
        setLoading(false);
      }
    };

    let authUnsubscribe: (() => void) | undefined;
    let profileUnsubscribe: (() => void) | undefined;
    
    console.log('👤 useAuth: Calling initAuth...');
    initAuth().then((unsub) => {
      console.log('👤 useAuth: initAuth completed', { unsubscribeFunction: !!unsub });
      authUnsubscribe = unsub;
    });

    return () => {
      console.log('👤 useAuth: Cleaning up subscriptions...');
      if (authUnsubscribe) {
        authUnsubscribe();
      }
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [mounted]);

  console.log('👤 useAuth: Current state', { 
    userExists: !!user, 
    profileExists: !!userProfile, 
    loading, 
    mounted 
  });

  return { user, userProfile, loading: loading || !mounted };
};