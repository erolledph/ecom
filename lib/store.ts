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

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar: string;
  backgroundImage: string;
  ownerId: string;
  isActive: boolean;
  socialLinks: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  createdAt: any;
  updatedAt: any;
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
  createdAt: any;
  updatedAt: any;
}

// Store functions
export async function getUserStore(userId: string): Promise<Store | null> {
  try {
    const storesRef = collection(db, 'stores');
    const q = query(storesRef, where('ownerId', '==', userId));
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
    console.error('Error getting user store:', error);
    throw error;
  }
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  try {
    const storesRef = collection(db, 'stores');
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
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
}

export async function checkSlugAvailability(slug: string, excludeStoreId?: string): Promise<boolean> {
  try {
    const storesRef = collection(db, 'stores');
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
    throw error;
  }
}

// Product functions
export async function getStoreProducts(storeId: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('storeId', '==', storeId));
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
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Slide functions
export async function getStoreSlides(storeId: string): Promise<Slide[]> {
  try {
    const slidesRef = collection(db, 'slides');
    const q = query(slidesRef, where('storeId', '==', storeId));
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
    const slidesRef = collection(db, 'slides');
    const docRef = await addDoc(slidesRef, {
      ...slide,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding slide:', error);
    throw error;
  }
}

export async function updateSlide(slideId: string, updates: Partial<Slide>): Promise<void> {
  try {
    const slideRef = doc(db, 'slides', slideId);
    await updateDoc(slideRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    throw error;
  }
}

export async function deleteSlide(slideId: string): Promise<void> {
  try {
    const slideRef = doc(db, 'slides', slideId);
    await deleteDoc(slideRef);
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
}

// Image upload functions
export async function uploadProductImages(storeId: string, files: File[], productId: string): Promise<string[]> {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${productId}_${index}_${Date.now()}`;
      const imageRef = ref(storage, `products/${fileName}`);
      await uploadBytes(imageRef, file);
      return getDownloadURL(imageRef);
    });
    
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw error;
  }
}

export async function uploadBase64Images(storeId: string, base64Images: string[], productId: string): Promise<string[]> {
  try {
    const uploadPromises = base64Images.map(async (base64Image, index) => {
      // Extract the data and content type from base64 string
      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 image format');
      }
      
      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Create a blob-like object for upload
      const uint8Array = new Uint8Array(buffer);
      
      const fileName = `${productId}_scraped_${index}_${Date.now()}`;
      const imageRef = ref(storage, `products/${fileName}`);
      
      await uploadBytes(imageRef, uint8Array, {
        contentType: contentType
      });
      
      return getDownloadURL(imageRef);
    });
    
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading base64 images:', error);
    throw error;
  }
}
export async function uploadSlideImage(storeId: string, file: File, slideId: string): Promise<string> {
  try {
    const fileName = `${slideId}_${Date.now()}`;
    const imageRef = ref(storage, `slider_images/${storeId}/${slideId}/${fileName}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading slide image:', error);
    throw error;
  }
}

export async function uploadStoreImage(storeId: string, file: File, type: 'avatar' | 'background'): Promise<string> {
  try {
    const fileName = `${storeId}_${type}_${Date.now()}`;
    const imageRef = ref(storage, `stores/${fileName}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading store image:', error);
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
        categoryMap.set(product.category, product.images[0] || '');
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
    { id: 'all', name: 'All', image: '' },
    ...categories
  ];
}
