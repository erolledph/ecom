import { db, storage } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  collectionGroup,
  orderBy,
  limit,
  writeBatch,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { fromBlob } from 'image-resize-compress';

import { isPremium, getUserProfile, UserProfile, isOnTrial, hasTrialExpired } from './auth';

// Interfaces
export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  slug: string;
  avatar?: string;
  backgroundImage?: string;
  socialLinks?: Array<{ platform: string; url: string; }>;
  headerLayout?: 'left-right' | 'right-left' | 'center';
  widgetImage?: string;
  widgetLink?: string;
  widgetEnabled?: boolean;
  bannerEnabled?: boolean;
  bannerImage?: string;
  bannerLink?: string;
  subscriptionEnabled?: boolean;
  slidesEnabled?: boolean;
  displayPriceOnProducts?: boolean;
  showCategories?: boolean;
  customHtml?: string;
  seoSettings?: {
    useAutomatic?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  customization?: {
    storeNameFontColor?: string;
    storeBioFontColor?: string;
    avatarBorderColor?: string;
    activeCategoryBorderColor?: string;
    socialIconColor?: string;
    fontFamily?: string;
    headingFontFamily?: string;
    bodyFontFamily?: string;
    headingTextColor?: string;
    bodyTextColor?: string;
    mainBackgroundGradientStartColor?: string;
    mainBackgroundGradientEndColor?: string;
    currencySymbol?: string;
    priceFontColor?: string;
    loadMoreButtonBgColor?: string;
    loadMoreButtonTextColor?: string;
  };
  ownerIsPremiumAdminSet?: boolean;  // Store owner's premium status (admin-granted)
  ownerTrialEndDate?: Date;          // Store owner's trial end date
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Product {
  id?: string;
  storeId: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  productLink?: string;
  category: string;
  isActive?: boolean;
  clickCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isSponsored?: boolean;
  ownerId?: string;
}

export interface Slide {
  id: string;
  storeId: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  clickCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Subscriber {
  id?: string;
  storeId: string;
  name?: string;
  email: string;
  createdAt: any;
}

export interface GlobalBanner {
  id: string;
  ownerId: string;
  imageUrl: string;
  link: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SponsoredProduct {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  productLink?: string;
  category: string;
  isActive?: boolean;
  clickCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Notification {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserNotificationStatus {
  id?: string;
  userId: string;
  notificationId: string;
  readAt: Date;
}
// Store Management Functions
export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
  try {
    if (!db) return false;
    
    const storesQuery = query(
      collectionGroup(db, 'stores'),
      where('slug', '==', slug)
    );
    
    const querySnapshot = await getDocs(storesQuery);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
};

export const getUserStore = async (userId: string): Promise<Store | null> => {
  try {
    if (!db) return null;
    
    const storeRef = doc(db, 'users', userId, 'stores', userId);
    const storeSnap = await getDoc(storeRef);
    
    if (storeSnap.exists()) {
      const data = storeSnap.data();
      return {
        id: storeSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as Store;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user store:', error);
    return null;
  }
};

export const getStoreBySlug = async (slug: string): Promise<Store | null> => {
  try {
    if (!db) return null;
    
    const storesQuery = query(
      collectionGroup(db, 'stores'),
      where('slug', '==', slug),
      limit(1)
    );
    
    const querySnapshot = await getDocs(storesQuery);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        ownerTrialEndDate: data.ownerTrialEndDate?.toDate ? data.ownerTrialEndDate.toDate() : data.ownerTrialEndDate
      } as Store;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching store by slug:', error);
    return null;
  }
};

export const updateStore = async (userId: string, updates: Partial<Store>): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    // Get user profile to check premium status
    const userProfile = await getUserProfile(userId);
    const isUserPremium = isPremium(userProfile);
    
    // Enforce restrictions for standard users
    if (!isUserPremium) {
      // Override restricted features to false for standard users
      if (updates.showCategories === true) {
        updates.showCategories = false;
      }
      if (updates.bannerEnabled === true) {
        updates.bannerEnabled = false;
      }
      if (updates.widgetEnabled === true) {
        updates.widgetEnabled = false;
      }
    }
    
    // Sync owner premium status to store document if user profile is available
    if (userProfile) {
      updates.ownerIsPremiumAdminSet = userProfile.isPremiumAdminSet;
      updates.ownerTrialEndDate = userProfile.trialEndDate;
    }
    
    // Clean up undefined values that Firestore doesn't accept
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof typeof updates] === undefined) {
        delete updates[key as keyof typeof updates];
      }
    });
    
    const storeRef = doc(db, 'users', userId, 'stores', userId);
    await updateDoc(storeRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating store:', error);
    // Provide more specific error messages for store updates
    if (error instanceof Error) {
      throw new Error(`Failed to save store settings: ${error.message}`);
    }
    throw new Error('Failed to save store settings: An unexpected error occurred. Please check your connection and try again.');
  }
};

// Image Upload Functions
export const uploadStoreImage = async (userId: string, file: File, type: 'avatar' | 'banner'): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');

    // For banners, preserve PNG transparency
    const isPNG = file.type === 'image/png' && type === 'banner';
    const fileExtension = isPNG ? 'png' : 'webp';
    const targetFormat = isPNG ? 'png' : 'webp';

    // Compress image
    const compressedFile = await fromBlob(
      file,
      isPNG ? 100 : 75, // quality (100 for PNG banners to preserve transparency, 75 for others)
      type === 'avatar' ? 200 : 1200, // width
      type === 'avatar' ? 200 : 'auto', // height
      targetFormat // format
    );

    const fileName = `${type}_${Date.now()}.${fileExtension}`;
    const imageRef = ref(storage, `users/${userId}/images/store/${fileName}`);

    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading store image:', error);
    // Provide more specific error messages for image uploads
    if (error instanceof Error) {
      throw new Error(`Failed to upload ${type} image: ${error.message}`);
    }
    throw new Error(`Failed to upload ${type} image: Please check your internet connection and try again.`);
  }
};

export const uploadWidgetImage = async (userId: string, file: File): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');
    
    const compressedFile = await fromBlob(
      file,
      75, // quality (0-100)
      200, // width
      200, // height
      'webp' // format
    );
    
    const fileName = `widget_${Date.now()}.webp`;
    const imageRef = ref(storage, `users/${userId}/images/store/${fileName}`);
    
    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading widget image:', error);
    // Provide more specific error messages for widget image uploads
    if (error instanceof Error) {
      throw new Error(`Failed to upload widget image: ${error.message}`);
    }
    throw new Error('Failed to upload widget image: Please check your internet connection and try again.');
  }
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    if (!storage || !imageUrl) return;
    
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn('Error deleting image from storage:', error);
  }
};

// Product Management Functions
export const getStoreProducts = async (storeId: string): Promise<Product[]> => {
  try {
    if (!db) return [];
    
    const productsRef = collection(db, 'users', storeId, 'stores', storeId, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as Product[];
  } catch (error) {
    console.error('Error fetching store products:', error);
    return [];
  }
};

// Get store products with trial limitations applied
export const getStoreProductsWithTrialLimits = async (storeId: string, store: Store | null): Promise<Product[]> => {
  try {
    if (!db) return [];
    
    console.log('🔍 getStoreProductsWithTrialLimits called for store:', {
      storeId,
      storeName: store?.name,
      ownerIsPremiumAdminSet: store?.ownerIsPremiumAdminSet,
      ownerTrialEndDate: store?.ownerTrialEndDate,
      isOwnerTrialExpired: store?.ownerTrialEndDate ? store.ownerTrialEndDate.getTime() < Date.now() : false
    });
    
    let querySnapshot;
    try {
      const productsRef = collection(db, 'users', storeId, 'stores', storeId, 'products');
      querySnapshot = await getDocs(productsRef);
    } catch (error) {
      console.error('❌ Error fetching products from Firestore:', error);
      
      // If it's a permission error or the store doesn't exist, return empty array
      if (error && typeof error === 'object' && 'code' in error && 
          (error.code === 'permission-denied' || error.code === 'not-found')) {
        console.log('🔒 Store not found or permission denied - returning empty products array');
        return [];
      }
      
      throw error; // Re-throw other errors
    }
    
    const allProducts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as Product[];
    
    console.log(`🔍 Total products found: ${allProducts.length}`);
    
    // Determine if we should apply product limits
    const shouldApplyLimit = store && (
      // Case 1: Trial has expired AND user doesn't have permanent premium
      (store.ownerTrialEndDate && store.ownerTrialEndDate.getTime() < Date.now() && !store.ownerIsPremiumAdminSet) ||
      // Case 2: No trial date set AND not permanent premium (legacy users)
      (!store.ownerTrialEndDate && !store.ownerIsPremiumAdminSet)
    );
    
    if (shouldApplyLimit) {
      console.log('⚠️ Applying 30-product limit - trial expired or no premium access');
      
      // Sort by creation date (newest first) and take only the first 30
      const sortedProducts = allProducts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      });
      
      const limitedProducts = sortedProducts.slice(0, 30);
      console.log(`🔍 Returning limited products: ${limitedProducts.length}/30 (${allProducts.length} total products)`);
      return limitedProducts;
    } else {
      if (store) {
        if (store.ownerIsPremiumAdminSet) {
          console.log('✅ Store owner has permanent premium - returning all products');
        } else if (store.ownerTrialEndDate && store.ownerTrialEndDate.getTime() > Date.now()) {
          console.log('✅ Store owner trial is active - returning all products');
        } else {
          console.log('⚠️ Store owner status unclear - returning all products (fallback)');
        }
      } else {
        console.log('👁️ No store data available - returning all products (fallback)');
      }
    }
    
    console.log(`🔍 Returning all products: ${allProducts.length}`);
    return allProducts;
  } catch (error) {
    console.error('Error fetching store products with trial limits:', error);
    return [];
  }
};

export const getProductById = async (storeId: string, productId: string): Promise<Product | null> => {
  try {
    if (!db) return null;
    
    const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      return {
        id: productSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as Product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, isPremiumUser: boolean): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    // Check product limit for non-premium users
    if (!isPremiumUser) {
      const currentProducts = await getStoreProducts(product.storeId);
      if (currentProducts.length >= 30) {
        throw new Error(`Product limit exceeded: You have reached the maximum of 30 products allowed for standard users. You currently have ${currentProducts.length} products. To add more products and unlock unlimited storage, please upgrade to premium access. Contact an administrator for assistance with upgrading your account.`);
      }
    }
    
    const productData = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      clickCount: 0
    };
    
    const docRef = await addDoc(collection(db, 'users', product.storeId, 'stores', product.storeId, 'products'), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to add product: An unexpected error occurred. Please try again.');
  }
};

export const updateProduct = async (storeId: string, productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    // Provide more specific error messages for product updates
    if (error instanceof Error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
    throw new Error('Failed to update product: An unexpected error occurred. Please try again.');
  }
};

export const deleteProduct = async (storeId: string, productId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    // Provide more specific error messages for product deletion
    if (error instanceof Error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
    throw new Error('Failed to delete product: An unexpected error occurred. Please try again.');
  }
};

export const uploadProductImage = async (userId: string, file: File, productId: string): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');
    
    const compressedFile = await fromBlob(
      file,
      75, // quality (0-100)
      1200, // width
      'auto', // height
      'webp' // format
    );
    
    const fileName = `product_${productId}_${Date.now()}.webp`;
    const imageRef = ref(storage, `users/${userId}/images/products/${fileName}`);
    
    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading product image:', error);
    // Provide more specific error messages for product image uploads
    if (error instanceof Error) {
      throw new Error(`Failed to upload product image: ${error.message}`);
    }
    throw new Error('Failed to upload product image: Please check your internet connection and try again.');
  }
};

export const addProductsBatch = async (products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[], storeId: string, isPremiumUser: boolean): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    // Check product limit for non-premium users
    if (!isPremiumUser) {
      const currentProducts = await getStoreProducts(storeId);
      const totalAfterImport = currentProducts.length + products.length;
      
      if (totalAfterImport > 30) {
        const remainingSlots = Math.max(0, 30 - currentProducts.length);
        throw new Error(`Bulk import failed: Product limit exceeded. Standard users can have up to 30 products total. You currently have ${currentProducts.length} products and can only add ${remainingSlots} more. You're trying to import ${products.length} products, which would exceed the limit by ${totalAfterImport - 30} products. Please upgrade to premium for unlimited products or reduce the number of products in your import file.`);
      }
    }
    
    const batch = writeBatch(db);
    
    products.forEach(product => {
      const productRef = doc(collection(db, 'users', storeId, 'stores', storeId, 'products'));
      const productData = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        clickCount: 0
      };
      batch.set(productRef, productData);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error adding products batch:', error);
    // Provide more specific error messages for batch operations
    if (error instanceof Error) {
      throw new Error(`Failed to import products: ${error.message}`);
    }
    throw new Error('Failed to import products: An unexpected error occurred during batch processing. Please try again.');
  }
};

// Slide Management Functions
export const getStoreSlides = async (storeId: string): Promise<Slide[]> => {
  try {
    if (!db) return [];
    
    const slidesRef = collection(db, 'users', storeId, 'stores', storeId, 'slides');
    const q = query(slidesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as Slide[];
  } catch (error) {
    console.error('Error fetching store slides:', error);
    return [];
  }
};

export const getSlideById = async (storeId: string, slideId: string): Promise<Slide | null> => {
  try {
    if (!db) return null;
    
    const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', slideId);
    const slideSnap = await getDoc(slideRef);
    
    if (slideSnap.exists()) {
      const data = slideSnap.data();
      return {
        id: slideSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as Slide;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching slide by ID:', error);
    return null;
  }
};

export const addSlide = async (slide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const slideData = {
      ...slide,
      createdAt: new Date(),
      updatedAt: new Date(),
      clickCount: 0
    };
    
    const docRef = await addDoc(collection(db, 'users', slide.storeId, 'stores', slide.storeId, 'slides'), slideData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding slide:', error);
    // Provide more specific error messages for slide creation
    if (error instanceof Error) {
      throw new Error(`Failed to create slide: ${error.message}`);
    }
    throw new Error('Failed to create slide: An unexpected error occurred. Please try again.');
  }
};

export const updateSlide = async (storeId: string, slideId: string, updates: Partial<Slide>): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', slideId);
    await updateDoc(slideRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    // Provide more specific error messages for slide updates
    if (error instanceof Error) {
      throw new Error(`Failed to update slide: ${error.message}`);
    }
    throw new Error('Failed to update slide: An unexpected error occurred. Please try again.');
  }
};

export const deleteSlide = async (storeId: string, slideId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', slideId);
    await deleteDoc(slideRef);
  } catch (error) {
    console.error('Error deleting slide:', error);
    // Provide more specific error messages for slide deletion
    if (error instanceof Error) {
      throw new Error(`Failed to delete slide: ${error.message}`);
    }
    throw new Error('Failed to delete slide: An unexpected error occurred. Please try again.');
  }
};

export const uploadSlideImage = async (userId: string, file: File, slideId: string): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');
    
    const compressedFile = await fromBlob(
      file,
      75, // quality (0-100)
      1200, // width
      'auto', // height
      'webp' // format
    );
    
    const fileName = `slide_${slideId}_${Date.now()}.webp`;
    const imageRef = ref(storage, `users/${userId}/images/slides/${fileName}`);
    
    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading slide image:', error);
    // Provide more specific error messages for slide image uploads
    if (error instanceof Error) {
      throw new Error(`Failed to upload slide image: ${error.message}`);
    }
    throw new Error('Failed to upload slide image: Please check your internet connection and try again.');
  }
};

// Subscriber Management Functions
export const addSubscriber = async (subscriber: Omit<Subscriber, 'id' | 'createdAt'>): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const subscriberData = {
      ...subscriber,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'users', subscriber.storeId, 'stores', subscriber.storeId, 'subscribers'), subscriberData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    // Provide more specific error messages for subscriber creation
    if (error instanceof Error) {
      throw new Error(`Failed to add subscriber: ${error.message}`);
    }
    throw new Error('Failed to add subscriber: An unexpected error occurred. Please try again.');
  }
};

export const getStoreSubscribers = async (storeId: string): Promise<Subscriber[]> => {
  try {
    if (!db) return [];
    
    const subscribersRef = collection(db, 'users', storeId, 'stores', storeId, 'subscribers');
    const querySnapshot = await getDocs(subscribersRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subscriber[];
  } catch (error) {
    console.error('Error fetching store subscribers:', error);
    return [];
  }
};

export const deleteSubscriber = async (storeId: string, subscriberId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const subscriberRef = doc(db, 'users', storeId, 'stores', storeId, 'subscribers', subscriberId);
    await deleteDoc(subscriberRef);
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    // Provide more specific error messages for subscriber deletion
    if (error instanceof Error) {
      throw new Error(`Failed to delete subscriber: ${error.message}`);
    }
    throw new Error('Failed to delete subscriber: An unexpected error occurred. Please try again.');
  }
};

// Global Banner Management Functions
export const getActiveGlobalBanner = async (): Promise<GlobalBanner | null> => {
  try {
    if (!db) return null;
    
    const bannersRef = collection(db, 'global_banners');
    const q = query(bannersRef, where('isActive', '==', true), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as GlobalBanner;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching active global banner:', error);
    return null;
  }
};

export const getAllGlobalBanners = async (): Promise<GlobalBanner[]> => {
  try {
    if (!db) return [];
    
    const bannersRef = collection(db, 'global_banners');
    const q = query(bannersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as GlobalBanner[];
  } catch (error) {
    console.error('Error fetching all global banners:', error);
    return [];
  }
};

export const addGlobalBanner = async (banner: Omit<GlobalBanner, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    // Delete all existing global banners before creating new one (limit to 1 banner)
    const bannersRef = collection(db, 'global_banners');
    const existingBanners = await getDocs(bannersRef);

    const batch = writeBatch(db);
    existingBanners.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    const bannerData = {
      ...banner,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'global_banners'), bannerData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding global banner:', error);
    // Provide more specific error messages for global banner creation
    if (error instanceof Error) {
      throw new Error(`Failed to create global banner: ${error.message}`);
    }
    throw new Error('Failed to create global banner: An unexpected error occurred. Please try again.');
  }
};

export const updateGlobalBanner = async (bannerId: string, updates: Partial<GlobalBanner>): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const bannerRef = doc(db, 'global_banners', bannerId);
    await updateDoc(bannerRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating global banner:', error);
    // Provide more specific error messages for global banner updates
    if (error instanceof Error) {
      throw new Error(`Failed to update global banner: ${error.message}`);
    }
    throw new Error('Failed to update global banner: An unexpected error occurred. Please try again.');
  }
};

export const deleteGlobalBanner = async (bannerId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const bannerRef = doc(db, 'global_banners', bannerId);
    await deleteDoc(bannerRef);
  } catch (error) {
    console.error('Error deleting global banner:', error);
    // Provide more specific error messages for global banner deletion
    if (error instanceof Error) {
      throw new Error(`Failed to delete global banner: ${error.message}`);
    }
    throw new Error('Failed to delete global banner: An unexpected error occurred. Please try again.');
  }
};

export const uploadGlobalBannerImage = async (file: File): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');

    const isPNG = file.type === 'image/png';
    const fileExtension = isPNG ? 'png' : 'webp';
    const targetFormat = isPNG ? 'png' : 'webp';

    const compressedFile = await fromBlob(
      file,
      isPNG ? 100 : 75, // quality (100 for PNG to preserve transparency, 75 for others)
      1200, // width
      'auto', // height
      targetFormat // format
    );

    const fileName = `global_banner_${Date.now()}.${fileExtension}`;
    const imageRef = ref(storage, `global_banners/${fileName}`);

    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading global banner image:', error);
    // Provide more specific error messages for global banner image uploads
    if (error instanceof Error) {
      throw new Error(`Failed to upload global banner image: ${error.message}`);
    }
    throw new Error('Failed to upload global banner image: Please check your internet connection and try again.');
  }
};

// Sponsored Product Management Functions
export const getSponsoredProducts = async (): Promise<SponsoredProduct[]> => {
  try {
    if (!db) return [];
    
    const sponsoredProductsRef = collection(db, 'sponsored_products');
    const q = query(sponsoredProductsRef, where('isActive', '!=', false));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as SponsoredProduct[];
  } catch (error) {
    console.error('Error fetching sponsored products:', error);
    return [];
  }
};

export const getAllSponsoredProducts = async (): Promise<SponsoredProduct[]> => {
  try {
    if (!db) return [];
    
    const sponsoredProductsRef = collection(db, 'sponsored_products');
    const q = query(sponsoredProductsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as SponsoredProduct[];
  } catch (error) {
    console.error('Error fetching all sponsored products:', error);
    return [];
  }
};

export const getSponsoredProductById = async (sponsoredProductId: string): Promise<SponsoredProduct | null> => {
  try {
    if (!db) return null;
    
    const sponsoredProductRef = doc(db, 'sponsored_products', sponsoredProductId);
    const sponsoredProductSnap = await getDoc(sponsoredProductRef);
    
    if (sponsoredProductSnap.exists()) {
      const data = sponsoredProductSnap.data();
      return {
        id: sponsoredProductSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as SponsoredProduct;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching sponsored product by ID:', error);
    return null;
  }
};

export const addSponsoredProduct = async (sponsoredProduct: Omit<SponsoredProduct, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const sponsoredProductData = {
      ...sponsoredProduct,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      clickCount: 0
    };
    
    const docRef = await addDoc(collection(db, 'sponsored_products'), sponsoredProductData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding sponsored product:', error);
    // Provide more specific error messages for sponsored product creation
    if (error instanceof Error) {
      throw new Error(`Failed to create sponsored product: ${error.message}`);
    }
    throw new Error('Failed to create sponsored product: An unexpected error occurred. Please try again.');
  }
};

export const updateSponsoredProduct = async (sponsoredProductId: string, updates: Partial<SponsoredProduct>): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const sponsoredProductRef = doc(db, 'sponsored_products', sponsoredProductId);
    await updateDoc(sponsoredProductRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating sponsored product:', error);
    // Provide more specific error messages for sponsored product updates
    if (error instanceof Error) {
      throw new Error(`Failed to update sponsored product: ${error.message}`);
    }
    throw new Error('Failed to update sponsored product: An unexpected error occurred. Please try again.');
  }
};

export const deleteSponsoredProduct = async (sponsoredProductId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const sponsoredProductRef = doc(db, 'sponsored_products', sponsoredProductId);
    await deleteDoc(sponsoredProductRef);
  } catch (error) {
    console.error('Error deleting sponsored product:', error);
    // Provide more specific error messages for sponsored product deletion
    if (error instanceof Error) {
      throw new Error(`Failed to delete sponsored product: ${error.message}`);
    }
    throw new Error('Failed to delete sponsored product: An unexpected error occurred. Please try again.');
  }
};

export const uploadSponsoredProductImage = async (file: File, sponsoredProductId: string): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');
    
    const compressedFile = await fromBlob(
      file,
      75, // quality (0-100)
      1200, // width
      'auto', // height
      'webp' // format
    );
    
    const fileName = `sponsored_product_${sponsoredProductId}_${Date.now()}.webp`;
    const imageRef = ref(storage, `sponsored_products/${sponsoredProductId}/${fileName}`);
    
    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading sponsored product image:', error);
    // Provide more specific error messages for sponsored product image uploads
    if (error instanceof Error) {
      throw new Error(`Failed to upload sponsored product image: ${error.message}`);
    }
    throw new Error('Failed to upload sponsored product image: Please check your internet connection and try again.');
  }
};

export const incrementSponsoredProductClickCount = async (sponsoredProductId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const sponsoredProductRef = doc(db, 'sponsored_products', sponsoredProductId);
    await updateDoc(sponsoredProductRef, {
      clickCount: increment(1),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error incrementing sponsored product click count:', error);
    // Provide more specific error messages for click count updates
    if (error instanceof Error) {
      throw new Error(`Failed to update click count: ${error.message}`);
    }
    throw new Error('Failed to update click count: An unexpected error occurred.');
  }
};

// Notification Management Functions
export const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const notificationData = {
      ...notification,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding notification:', error);
    // Provide more specific error messages for notification creation
    if (error instanceof Error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
    throw new Error('Failed to create notification: An unexpected error occurred. Please try again.');
  }
};

export const getAllNotifications = async (): Promise<Notification[]> => {
  try {
    if (!db) return [];
    
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
    })) as Notification[];
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    return [];
  }
};

export const getNotificationById = async (notificationId: string): Promise<Notification | null> => {
  try {
    if (!db) return null;
    
    const notificationRef = doc(db, 'notifications', notificationId);
    const notificationSnap = await getDoc(notificationRef);
    
    if (notificationSnap.exists()) {
      const data = notificationSnap.data();
      return {
        id: notificationSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as Notification;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching notification by ID:', error);
    return null;
  }
};

export const updateNotification = async (notificationId: string, updates: Partial<Notification>): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    // Provide more specific error messages for notification updates
    if (error instanceof Error) {
      throw new Error(`Failed to update notification: ${error.message}`);
    }
    throw new Error('Failed to update notification: An unexpected error occurred. Please try again.');
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
  } catch (error) {
    console.error('Error deleting notification:', error);
    // Provide more specific error messages for notification deletion
    if (error instanceof Error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
    throw new Error('Failed to delete notification: An unexpected error occurred. Please try again.');
  }
};

// User Notification Status Functions
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const readNotificationData = {
      userId,
      notificationId,
      readAt: new Date()
    };
    
    await addDoc(collection(db, 'users', userId, 'read_notifications'), readNotificationData);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    // Provide more specific error messages for marking notifications as read
    if (error instanceof Error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
    throw new Error('Failed to mark notification as read: An unexpected error occurred.');
  }
};

export const getReadNotificationIds = async (userId: string): Promise<string[]> => {
  try {
    if (!db) return [];
    
    const readNotificationsRef = collection(db, 'users', userId, 'read_notifications');
    const querySnapshot = await getDocs(readNotificationsRef);
    
    return querySnapshot.docs.map(doc => doc.data().notificationId);
  } catch (error) {
    console.error('Error fetching read notification IDs:', error);
    return [];
  }
};

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    if (!db) return 0;
    
    // Get all active notifications
    const notificationsRef = collection(db, 'notifications');
    const activeNotificationsQuery = query(notificationsRef, where('isActive', '==', true));
    const activeNotificationsSnapshot = await getDocs(activeNotificationsQuery);
    
    // Get read notification IDs for this user
    const readNotificationIds = await getReadNotificationIds(userId);
    
    // Count unread notifications
    const unreadCount = activeNotificationsSnapshot.docs.filter(doc => 
      !readNotificationIds.includes(doc.id)
    ).length;
    
    return unreadCount;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
};

export const getAllUserNotifications = async (userId: string): Promise<(Notification & { isRead: boolean })[]> => {
  try {
    if (!db) return [];
    
    // Get all active notifications
    const notificationsRef = collection(db, 'notifications');
    const activeNotificationsQuery = query(
      notificationsRef, 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const activeNotificationsSnapshot = await getDocs(activeNotificationsQuery);
    
    // Get read notification IDs for this user
    const readNotificationIds = await getReadNotificationIds(userId);
    
    // Map notifications with read status
    return activeNotificationsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        isRead: readNotificationIds.includes(doc.id)
      } as Notification & { isRead: boolean };
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return [];
  }
};
// Utility Functions
export const getAllStoreSlugs = async (): Promise<Map<string, string>> => {
  try {
    if (!db) return new Map();
    
    const storesQuery = query(collectionGroup(db, 'stores'));
    const querySnapshot = await getDocs(storesQuery);
    
    const slugMap = new Map<string, string>();
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.ownerId && data.slug) {
        slugMap.set(data.ownerId, data.slug);
      }
    });
    
    return slugMap;
  } catch (error) {
    console.error('Error fetching all store slugs:', error);
    return new Map();
  }
};

export const generateCategoriesWithCountSync = (products: Product[]): Array<{ id: string; name: string; image: string; count?: number }> => {
  const categoryMap = new Map<string, { count: number; image: string }>();
  
  products.forEach(product => {
    if (product.isSponsored) return; // Skip sponsored products for categories
    
    const category = product.category;
    const existingCategory = categoryMap.get(category);
    
    if (existingCategory) {
      existingCategory.count++;
    } else {
      categoryMap.set(category, {
        count: 1,
        image: product.images?.[0] || ''
      });
    }
  });
  
  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    id: name,
    name,
    image: data.image,
    count: data.count
  }));
  
  // Sort categories by count (descending)
  categories.sort((a, b) => (b.count || 0) - (a.count || 0));
  
  // Add "All Products" category at the beginning
  const allProductsCount = products.filter(p => !p.isSponsored).length;
  return [
    {
      id: 'all',
      name: `All Products (${allProductsCount})`,
      image: '',
      count: allProductsCount
    },
    ...categories
  ];
};
