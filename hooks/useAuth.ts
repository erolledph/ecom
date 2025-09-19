import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, UserProfile } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const initAuth = async () => {
      try {
        if (!auth) {
          setLoading(false);
          return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user);
          
          if (user) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    let unsubscribe: (() => void) | undefined;
    
    initAuth().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [mounted]);

  return { user, userProfile, loading: loading || !mounted };
};