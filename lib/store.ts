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
  bannerDescription?: string;
  bannerLink?: string;
  subscriptionEnabled?: boolean;
  slidesEnabled?: boolean;
  displayPriceOnProducts?: boolean;
  showCategories?: boolean;
  customHtml?: string;
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
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  // Custom domain fields
  customDomain?: string;
  domainVerificationCode?: string;
  domainVerified?: boolean;
  domainVerificationAttempts?: number;
  domainVerificationLastAttempt?: Date;
  sslStatus?: 'pending' | 'active' | 'failed' | 'not_applicable';
  customDomainEnabled?: boolean;
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
  description?: string;
  link?: string;
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
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        domainVerificationLastAttempt: data.domainVerificationLastAttempt?.toDate ? data.domainVerificationLastAttempt.toDate() : data.domainVerificationLastAttempt
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
        domainVerificationLastAttempt: data.domainVerificationLastAttempt?.toDate ? data.domainVerificationLastAttempt.toDate() : data.domainVerificationLastAttempt
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
    
    const storeRef = doc(db, 'users', userId, 'stores', userId);
    await updateDoc(storeRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
};

// Image Upload Functions
export const uploadStoreImage = async (userId: string, file: File, type: 'avatar' | 'banner'): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');
    
    // Compress image
    const compressedFile = await fromBlob(
      file,
      75, // quality (0-100)
      type === 'avatar' ? 200 : 1200, // width
      type === 'avatar' ? 200 : 'auto', // height
      'webp' // format
    );
    
    const fileName = `${type}_${Date.now()}.webp`;
    const imageRef = ref(storage, `users/${userId}/images/store/${fileName}`);
    
    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading store image:', error);
    throw error;
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
    throw error;
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
        throw new Error('Product limit reached. Normal users can add up to 30 products. Upgrade to premium for unlimited products.');
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
    throw error;
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
    throw error;
  }
};

export const deleteProduct = async (storeId: string, productId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
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
    throw error;
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
        throw new Error(`Product limit exceeded. Normal users can have up to 30 products. You currently have ${currentProducts.length} products and can add ${remainingSlots} more. Upgrade to premium for unlimited products.`);
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
    throw error;
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
    throw error;
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
    throw error;
  }
};

export const deleteSlide = async (storeId: string, slideId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', slideId);
    await deleteDoc(slideRef);
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
};

export const deleteGlobalBanner = async (bannerId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const bannerRef = doc(db, 'global_banners', bannerId);
    await deleteDoc(bannerRef);
  } catch (error) {
    console.error('Error deleting global banner:', error);
    throw error;
  }
};

export const uploadGlobalBannerImage = async (file: File): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase Storage not initialized');
    
    const compressedFile = await fromBlob(
      file,
      75, // quality (0-100)
      1200, // width
      'auto', // height
      'webp' // format
    );
    
    const fileName = `global_banner_${Date.now()}.webp`;
    const imageRef = ref(storage, `global_banners/${fileName}`);
    
    await uploadBytes(imageRef, compressedFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading global banner image:', error);
    throw error;
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
    throw error;
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
    throw error;
  }
};

export const deleteSponsoredProduct = async (sponsoredProductId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');
    
    const sponsoredProductRef = doc(db, 'sponsored_products', sponsoredProductId);
    await deleteDoc(sponsoredProductRef);
  } catch (error) {
    console.error('Error deleting sponsored product:', error);
    throw error;
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
    throw error;
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
    throw error;
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

// Custom Domain Management Functions
export const checkCustomDomainAvailability = async (domain: string): Promise<boolean> => {
  try {
    if (!db) return false;
    
    console.log('Checking domain availability in Firestore for:', domain);
    
    const storesQuery = query(
      collectionGroup(db, 'stores'),
      where('customDomain', '==', domain)
    );
    
    const querySnapshot = await getDocs(storesQuery);
    console.log('Query snapshot size:', querySnapshot.size);
    console.log('Domain is available:', querySnapshot.empty);
    
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking custom domain availability:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

export const addCustomDomain = async (userId: string, domain: string): Promise<{ verificationCode: string }> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    console.log('Checking domain availability for:', domain);
    // Check if domain is already in use by another store
    const isAvailable = await checkCustomDomainAvailability(domain);
    console.log('Domain availability:', isAvailable);
    
    if (!isAvailable) {
      throw new Error('This custom domain is already in use by another store.');
    }

    const verificationCode = `bolt-verify-${Math.random().toString(36).substring(2, 15)}`;
    console.log('Generated verification code:', verificationCode);
    
    const storeRef = doc(db, 'users', userId, 'stores', userId);
    console.log('Store reference path:', `users/${userId}/stores/${userId}`);

    console.log('Updating store with custom domain data...');
    await updateDoc(storeRef, {
      customDomain: domain,
      domainVerificationCode: verificationCode,
      domainVerified: false,
      domainVerificationAttempts: 0,
      domainVerificationLastAttempt: new Date(),
      sslStatus: 'not_applicable',
      customDomainEnabled: false,
      updatedAt: new Date()
    });
    console.log('Store updated successfully');

    return { verificationCode };
  } catch (error) {
    console.error('Error adding custom domain:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const verifyCustomDomain = async (userId: string, domain: string, expectedVerificationCode: string): Promise<boolean> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const storeRef = doc(db, 'users', userId, 'stores', userId);
    const storeSnap = await getDoc(storeRef);

    if (!storeSnap.exists()) {
      throw new Error('Store not found.');
    }

    const storeData = storeSnap.data() as Store;

    if (storeData.customDomain !== domain) {
      throw new Error('Provided domain does not match the one configured for this store.');
    }

    // Simulate DNS TXT record lookup
    // In production, you would use a DNS lookup library to query _bolt-verify.${domain}
    const isTxtRecordValid = storeData.domainVerificationCode === expectedVerificationCode;

    if (isTxtRecordValid) {
      await updateDoc(storeRef, {
        domainVerified: true,
        sslStatus: 'pending',
        customDomainEnabled: true,
        domainVerificationAttempts: increment(1),
        domainVerificationLastAttempt: new Date(),
        updatedAt: new Date()
      });
      
      // Simulate SSL becoming active after a delay
      setTimeout(async () => {
        try {
          await updateDoc(storeRef, {
            sslStatus: 'active',
            updatedAt: new Date()
          });
        } catch (error) {
          console.error('Error updating SSL status:', error);
        }
      }, 5000);
      
      return true;
    } else {
      await updateDoc(storeRef, {
        domainVerified: false,
        domainVerificationAttempts: increment(1),
        domainVerificationLastAttempt: new Date(),
        updatedAt: new Date()
      });
      return false;
    }
  } catch (error) {
    console.error('Error verifying custom domain:', error);
    throw error;
  }
};

export const removeCustomDomain = async (userId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const storeRef = doc(db, 'users', userId, 'stores', userId);
    await updateDoc(storeRef, {
      customDomain: null,
      domainVerificationCode: null,
      domainVerified: null,
      domainVerificationAttempts: null,
      domainVerificationLastAttempt: null,
      sslStatus: null,
      customDomainEnabled: null,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error removing custom domain:', error);
    throw error;
  }
};

export const getStoreByCustomDomain = async (domain: string): Promise<Store | null> => {
  try {
    if (!db) return null;

    const storesQuery = query(
      collectionGroup(db, 'stores'),
      where('customDomain', '==', domain),
      where('domainVerified', '==', true),
      where('customDomainEnabled', '==', true),
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
        domainVerificationLastAttempt: data.domainVerificationLastAttempt?.toDate ? data.domainVerificationLastAttempt.toDate() : data.domainVerificationLastAttempt
      } as Store;
    }

    return null;
  } catch (error) {
    console.error('Error fetching store by custom domain:', error);
    return null;
  }
};
