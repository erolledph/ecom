import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db, getStorageInstance } from './firebase';

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  slug: string;
  avatar: string;
  backgroundImage: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  productLink: string;
  category: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Store Management Functions
export const getStoreBySlug = async (slug: string): Promise<Store | null> => {
  try {
    const storesRef = collection(db, 'stores');
    const q = query(storesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Store;
    }
    return null;
  } catch (error) {
    console.error('Error fetching store by slug:', error);
    return null;
  }
};

export const checkSlugAvailability = async (slug: string, excludeStoreId?: string): Promise<boolean> => {
  try {
    const storesRef = collection(db, 'stores');
    const q = query(storesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return true; // Slug is available
    }
    
    // If excludeStoreId is provided, check if the found store is the same one being updated
    if (excludeStoreId) {
      const foundStore = querySnapshot.docs[0];
      return foundStore.id === excludeStoreId;
    }
    
    return false; // Slug is taken
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
};

export const getUserStore = async (userId: string): Promise<Store | null> => {
  try {
    const storeDoc = await getDoc(doc(db, 'stores', userId));
    if (storeDoc.exists()) {
      const data = storeDoc.data();
      return {
        id: storeDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Store;
    }
    return null;
  } catch (error) {
    console.error('Error fetching store:', error);
    return null;
  }
};

export const updateStore = async (userId: string, storeData: Partial<Store>) => {
  try {
    const storeRef = doc(db, 'stores', userId);
    await updateDoc(storeRef, {
      ...storeData,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
};

// Product Management Functions
export const getStoreProducts = async (storeId: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'stores', storeId, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (storeId: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const productsRef = collection(db, 'stores', storeId, 'products');
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (storeId: string, productId: string, productData: Partial<Product>) => {
  try {
    const productRef = doc(db, 'stores', storeId, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (storeId: string, productId: string) => {
  try {
    const productRef = doc(db, 'stores', storeId, 'products', productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Slide Management Functions
export const getStoreSlides = async (storeId: string): Promise<Slide[]> => {
  try {
    const slidesRef = collection(db, 'stores', storeId, 'slides');
    const q = query(slidesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Slide[];
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
};

export const addSlide = async (storeId: string, slideData: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const slidesRef = collection(db, 'stores', storeId, 'slides');
    const docRef = await addDoc(slidesRef, {
      ...slideData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding slide:', error);
    throw error;
  }
};

export const updateSlide = async (storeId: string, slideId: string, slideData: Partial<Slide>) => {
  try {
    const slideRef = doc(db, 'stores', storeId, 'slides', slideId);
    await updateDoc(slideRef, {
      ...slideData,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating slide:', error);
    throw error;
  }
};

export const deleteSlide = async (storeId: string, slideId: string) => {
  try {
    const slideRef = doc(db, 'stores', storeId, 'slides', slideId);
    await deleteDoc(slideRef);
    return true;
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
};

// File Upload Functions
export const uploadProductImages = async (storeId: string, productId: string, files: File[]): Promise<string[]> => {
  try {
    const storage = await getStorageInstance();
    if (!storage) {
      throw new Error('Storage not available on server side');
    }
    
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const storageRef = ref(storage, `product_images/${storeId}/${productId}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw error;
  }
};

export const uploadSlideImage = async (storeId: string, slideId: string, file: File): Promise<string> => {
  try {
    const storage = await getStorageInstance();
    if (!storage) {
      throw new Error('Storage not available on server side');
    }
    
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `slider_images/${storeId}/${slideId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading slide image:', error);
    throw error;
  }
};

export const uploadStoreImage = async (storeId: string, file: File, type: 'avatar' | 'background'): Promise<string> => {
  try {
    const storage = await getStorageInstance();
    if (!storage) {
      throw new Error('Storage not available on server side');
    }
    
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    
    const fileName = `${type}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `store_images/${storeId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading store image:', error);
    throw error;
  }
};