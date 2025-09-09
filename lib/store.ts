import { getFirebaseInstances } from './firebase';

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
    const { db } = await getFirebaseInstances();
    if (!db) return null;

    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) return false;

    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) return null;

    const { doc, getDoc } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) throw new Error('Database not available');

    const { doc, updateDoc } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) return [];

    const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) throw new Error('Database not available');

    const { collection, addDoc } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) throw new Error('Database not available');

    const { doc, updateDoc } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) throw new Error('Database not available');

    const { doc, deleteDoc } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) return [];

    const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) throw new Error('Database not available');

    const { collection, addDoc } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) throw new Error('Database not available');

    const { doc, updateDoc } = await import('firebase/firestore');
    
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
    const { db } = await getFirebaseInstances();
    if (!db) throw new Error('Database not available');

    const { doc, deleteDoc } = await import('firebase/firestore');
    
    const slideRef = doc(db, 'stores', storeId, 'slides', slideId);
    await deleteDoc(slideRef);
    return true;
  } catch (error) {
    console.error('Error deleting slide:', error);
    throw error;
  }
};

// File Upload Functions - Using placeholder URLs since Firebase Storage causes build issues
export const uploadProductImages = async (storeId: string, productId: string, files: File[]): Promise<string[]> => {
  // Return placeholder URLs since Firebase Storage causes build issues
  return files.map((file, index) => 
    `https://placehold.co/600x600/8b5cf6/ffffff?text=Product+${index + 1}`
  );
};

export const uploadSlideImage = async (storeId: string, slideId: string, file: File): Promise<string> => {
  // Return a placeholder URL since Firebase Storage causes build issues
  return 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
};

export const uploadStoreImage = async (storeId: string, file: File, type: 'avatar' | 'background'): Promise<string> => {
  // Return placeholder URLs since Firebase Storage causes build issues
  if (type === 'avatar') {
    return 'https://placehold.co/300x300/6b7280/ffffff?text=Avatar';
  } else {
    return 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  }
};