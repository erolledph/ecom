import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { fromBlob } from 'image-resize-compress';

// Import collectionGroup for collection group queries
import { collectionGroup } from 'firebase/firestore';
import { writeBatch } from 'firebase/firestore';

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar: string;
  widgetImage?: string;
  widgetLink?: string;
  widgetEnabled?: boolean;
  bannerEnabled?: boolean;
  bannerImage?: string;
  bannerDescription?: string;
  bannerLink?: string;
  subscriptionEnabled?: boolean;
  requireNameForSubscription?: boolean;
  slidesEnabled?: boolean;
  displayPriceOnProducts?: boolean;
  displayHeaderBackgroundImage?: boolean;
  customHtml?: string;
  ownerId: string;
  isActive: boolean;
  socialLinks: Array<{ platform: string; url: string; }>;
  headerLayout?: 'left-right' | 'right-left' | 'center';
  customization?: {
    storeNameFontColor?: string;
    storeBioFontColor?: string;
    fontFamily?: string;
    headingFontFamily?: string;
    bodyFontFamily?: string;
    headingTextColor?: string;
    bodyTextColor?: string;
    mainBackgroundGradientStartColor?: string;
    mainBackgroundGradientEndColor?: string;
    currencySymbol?: string;
    priceFontColor?: string;
    avatarBorderColor?: string;
    activeCategoryBorderColor?: string;
    socialIconColor?: string;
    loadMoreButtonBgColor?: string;
    loadMoreButtonTextColor?: string;
  };
  createdAt: any;
  updatedAt: any;
}

export interface Subscriber {
  id?: string;
  name?: string;
  email: string;
  storeId: string;
  createdAt: any;
}

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  storeId?: string;
  isActive?: boolean;
  // add optional productLink field
  productLink?: string;
  clickCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  storeId: string;
  order: number;
  isActive: boolean;
  clickCount?: number;
  createdAt: any;
  updatedAt: any;
}

// Utility function to sanitize filename
function sanitizeFilename(filename: string): string {
  const baseName = filename.split('.').slice(0, -1).join('.');
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Store functions
export async function getUserStore(userId: string): Promise<Store | null> {
  try {
    // Get store from nested path
    const storeRef = doc(db, 'users', userId, 'stores', userId);
    const storeSnap = await getDoc(storeRef);
    
    if (!storeSnap.exists()) {
      return null;
    }
    
    return {
      id: storeSnap.id,
      ...storeSnap.data()
    } as Store;
  } catch (error) {
    console.error('Error getting user store:', error);
    throw error;
  }
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  try {
    // Use collection group query to search across all users' stores
    const storesRef = collectionGroup(db, 'stores');
    const q = query(storesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const storeDoc = querySnapshot.docs[0];
    return {
      id: storeDoc.id,
      ...storeDoc.data()
    } as Store;
  } catch (error) {
    console.error('Error getting store by slug:', error);
    throw error;
  }
}

export async function updateStore(storeId: string, updates: Partial<Store>): Promise<void> {
  try {
    // Remove slug from updates to prevent changing store URL after creation
    const { slug, ...allowedUpdates } = updates;
    
    // Update store in nested path
    const storeRef = doc(db, 'users', storeId, 'stores', storeId);
    await updateDoc(storeRef, {
      ...allowedUpdates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
}

export async function checkSlugAvailability(slug: string, excludeStoreId?: string): Promise<boolean> {
  try {
    // Use collection group query to check across all users' stores
    const storesRef = collectionGroup(db, 'stores');
    const q = query(storesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return true;
    }
    
    if (excludeStoreId) {
      const existingStore = querySnapshot.docs[0];
      return existingStore.id === excludeStoreId;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    // If the error is due to missing index, return true to allow the operation
    // The user will need to create the required Firestore index
    if (error instanceof Error && error.message.includes('index')) {
      console.warn('Firestore index required. Please create the index in Firebase console.');
      return true; // Allow slug to be used until index is created
    }
    throw error;
  }
}

// Product functions
export async function getStoreProducts(storeId: string): Promise<Product[]> {
  try {
    // Get products from nested path
    const productsRef = collection(db, 'users', storeId, 'stores', storeId, 'products');
    const q = query(productsRef);
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    // Sort by createdAt in JavaScript instead of Firestore
    return products.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    });
  } catch (error) {
    console.error('Error getting store products:', error);
    throw error;
  }
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    // Add product to nested path
    const productsRef = collection(db, 'users', product.storeId!, 'stores', product.storeId!, 'products');
    const docRef = await addDoc(productsRef, {
      ...product,
      clickCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function addProductsBatch(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[], ownerId: string): Promise<void> {
  try {
    if (products.length === 0) return;
    
    // Firestore batch writes are limited to 500 operations
    const BATCH_SIZE = 500;
    const batches = [];
    
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchProducts = products.slice(i, i + BATCH_SIZE);
      
      batchProducts.forEach((product) => {
        const productsRef = collection(db, 'users', ownerId, 'stores', ownerId, 'products');
        const docRef = doc(productsRef);
        
        batch.set(docRef, {
          ...product,
          storeId: ownerId,
          isActive: true,
          clickCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      batches.push(batch);
    }
    
    // Execute all batches
    await Promise.all(batches.map(batch => batch.commit()));
  } catch (error) {
    console.error('Error adding products batch:', error);
    throw error;
  }
}

export async function updateProduct(storeId: string, productId: string, updates: Partial<Product>): Promise<void> {
  try {
    // Update product in nested path
    const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(storeId: string, productId: string): Promise<void> {
  try {
    // Delete product from nested path
    const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Slide functions
export async function getStoreSlides(storeId: string): Promise<Slide[]> {
  try {
    // Get slides from nested path
    const slidesRef = collection(db, 'users', storeId, 'stores', storeId, 'slides');
    const q = query(slidesRef);
    const querySnapshot = await getDocs(q);
    
    const slides = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Slide[];
    
    // Sort by order in JavaScript instead of Firestore
    return slides.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error getting store slides:', error);
    throw error;
  }
}

export async function addSlide(slide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    // Add slide to nested path
    const slidesRef = collection(db, 'users', slide.storeId, 'stores', slide.storeId, 'slides');
    const docRef = await addDoc(slidesRef, {
      ...slide,
      clickCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding slide:', error);
    throw error;
  }
}

export async function updateSlide(storeId: string, slideId: string, updates: Partial<Slide>): Promise<void> {
  try {
    // Update slide in nested path
    const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', slideId);
    await updateDoc(slideRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    throw error;
  }
}

export async function deleteSlide(storeId: string, slideId: string): Promise<void> {
  try {
    // Delete slide from nested path
    const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', slideId);
    await deleteDoc(slideRef);
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
}

export async function getSlideById(storeId: string, slideId: string): Promise<Slide | null> {
  try {
    // Get slide from nested path
    const slideRef = doc(db, 'users', storeId, 'stores', storeId, 'slides', slideId);
    const slideSnap = await getDoc(slideRef);
    
    if (slideSnap.exists()) {
      return {
        id: slideSnap.id,
        ...slideSnap.data()
      } as Slide;
    }
    return null;
  } catch (error) {
    console.error('Error getting slide by ID:', error);
    throw error;
  }
}

export async function getProductById(storeId: string, productId: string): Promise<Product | null> {
  try {
    // Get product from nested path
    const productRef = doc(db, 'users', storeId, 'stores', storeId, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
}

// Image upload functions
export async function uploadProductImage(storeId: string, file: File, productId: string): Promise<string> {
  try {
    // Compress and resize the image
    const compressedBlob = await fromBlob(file, 75, 1200, 'auto', 'webp'); // 75% quality, max width 1200px, auto height, webp format
    
    const baseFileName = sanitizeFilename(file.name);
    const fileName = `${baseFileName}_${Date.now()}.webp`; // Use sanitized original name + timestamp + webp extension
    const imageRef = ref(storage, `users/${storeId}/images/products/${productId}/${fileName}`);
    await uploadBytes(imageRef, compressedBlob); // Upload the compressed blob
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
}

export async function uploadSlideImage(storeId: string, file: File, slideId: string): Promise<string> {
  try {
    // Compress and resize the image
    const compressedBlob = await fromBlob(file, 75, 1200, 'auto', 'webp'); // 75% quality, max width 1200px, auto height, webp format
    
    const baseFileName = sanitizeFilename(file.name);
    const fileName = `${baseFileName}_${Date.now()}.webp`; // Use sanitized original name + timestamp + webp extension
    const imageRef = ref(storage, `users/${storeId}/images/slides/${slideId}/${fileName}`);
    await uploadBytes(imageRef, compressedBlob); // Upload the compressed blob
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading slide image:', error);
    throw error;
  }
}

export async function uploadStoreImage(storeId: string, file: File, type: 'avatar' | 'background' | 'banner'): Promise<string> {
  try {
    let maxWidth: number | 'auto' = 'auto';
    
    if (type === 'avatar') {
      maxWidth = 200; // Smaller size for avatar
    } else if (type === 'banner') {
      maxWidth = 1200; // Larger size for background/banner
    }
    
    // Compress and resize the image
    const compressedBlob = await fromBlob(file, 75, maxWidth, 'auto', 'webp'); // 75% quality, auto height, webp format
    
    const baseFileName = sanitizeFilename(file.name);
    const fileName = `${baseFileName}_${type}_${Date.now()}.webp`; // Use sanitized original name + type + timestamp + webp extension
    const imageRef = ref(storage, `users/${storeId}/images/store/${type}/${fileName}`);
    await uploadBytes(imageRef, compressedBlob); // Upload the compressed blob
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading store image:', error);
    throw error;
  }
}

export async function uploadWidgetImage(storeId: string, file: File): Promise<string> {
  try {
    // Compress and resize the image
    const compressedBlob = await fromBlob(file, 75, 200, 'auto', 'webp'); // 75% quality, max width 200px, auto height, webp format
    
    const baseFileName = sanitizeFilename(file.name);
    const fileName = `${baseFileName}_widget_${Date.now()}.webp`; // Use sanitized original name + timestamp + webp extension
    const imageRef = ref(storage, `users/${storeId}/images/store/widget/${fileName}`);
    await uploadBytes(imageRef, compressedBlob); // Upload the compressed blob
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading widget image:', error);
    throw error;
  }
}

// Subscriber functions
export async function addSubscriber(subscriber: Omit<Subscriber, 'id' | 'createdAt'>): Promise<string> {
  try {
    const subscribersRef = collection(db, 'users', subscriber.storeId, 'stores', subscriber.storeId, 'subscribers');
    const docRef = await addDoc(subscribersRef, {
      ...subscriber,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
}

export async function getStoreSubscribers(storeId: string): Promise<Subscriber[]> {
  try {
    const subscribersRef = collection(db, 'users', storeId, 'stores', storeId, 'subscribers');
    const q = query(subscribersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subscriber[];
  } catch (error) {
    console.error('Error getting store subscribers:', error);
    throw error;
  }
}

export async function clearStoreSubscribers(storeId: string): Promise<void> {
  try {
    const subscribersRef = collection(db, 'users', storeId, 'stores', storeId, 'subscribers');
    const q = query(subscribersRef);
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error clearing store subscribers:', error);
    throw error;
  }
}

export async function deleteSubscriber(storeId: string, subscriberId: string): Promise<void> {
  try {
    const subscriberRef = doc(db, 'users', storeId, 'stores', storeId, 'subscribers', subscriberId);
    await deleteDoc(subscriberRef);
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    throw error;
  }
}

// Utility functions
export async function generateCategoriesFromProducts(storeId: string): Promise<Array<{ id: string; name: string; image: string }>> {
  try {
    const products = await getStoreProducts(storeId);
    const categoryMap = new Map<string, string>();
    
    products.forEach(product => {
      if (product.category && !categoryMap.has(product.category)) {
        categoryMap.set(product.category, product.images?.[0] || '');
      }
    });
    
    const categories = Array.from(categoryMap.entries()).map(([name, image]) => ({
      id: name,
      name,
      image
    }));
    
    // Add "all" category at the beginning
    return [
      { id: 'all', name: 'All', image: '' },
      ...categories
    ];
  } catch (error) {
    console.error('Error generating categories from products:', error);
    return [{ id: 'all', name: 'All', image: '' }];
  }
}

export function generateCategoriesFromProductsSync(products: Product[]): Array<{ id: string; name: string; image: string }> {
  const categoryMap = new Map<string, string>();
  
  products.forEach(product => {
    if (product.category && !categoryMap.has(product.category)) {
     categoryMap.set(product.category, product.images?.[0] || '');
    }
  });
  
  const categories = Array.from(categoryMap.entries()).map(([name, image]) => ({
    id: name,
    name,
    image
  }));
  
  return [
    { id: 'all', name: `All (${products.length})`, image: '' },
    ...categories
  ];
}

export function generateCategoriesWithCountSync(products: Product[]): Array<{ id: string; name: string; image: string; count: number }> {
  const categoryMap = new Map<string, { image: string; count: number }>();
  
  products.forEach(product => {
    if (product.category) {
      if (categoryMap.has(product.category)) {
        const existing = categoryMap.get(product.category)!;
        categoryMap.set(product.category, {
          image: existing.image || product.images?.[0] || '',
          count: existing.count + 1
        });
      } else {
        categoryMap.set(product.category, {
          image: product.images?.[0] || '',
          count: 1
        });
      }
    }
  });
  
  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    id: name,
    name: `${name} (${data.count})`,
    image: data.image,
    count: data.count
  }));
  
  return [
    { id: 'all', name: `All Products (${products.length})`, image: '', count: products.length },
    ...categories
  ];
}

// NEW FUNCTION: Delete image from Firebase Storage
export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  if (!imageUrl || !imageUrl.includes('firebasestorage.googleapis.com')) {
    console.warn('Not a Firebase Storage URL or URL is empty, skipping deletion:', imageUrl);
    return;
  }
  try {
    // Create a storage reference from the image URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log('Image deleted from storage:', imageUrl);
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    throw error;
  }
}