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
  widgetImage?: string;
  widgetLink?: string;
  widgetEnabled?: boolean;
  bannerEnabled?: boolean;
  bannerImage?: string;
  bannerDescription?: string;
  bannerLink?: string;
  slidesEnabled?: boolean;
  displayPriceOnProducts?: boolean;
  displayHeaderBackgroundImage?: boolean;
  ownerId: string;
  isActive: boolean;
  socialLinks: Array<{ platform: string; url: string; }>;
  headerLayout?: 'left-right' | 'right-left' | 'center';
  customization?: {
    storeNameFontColor?: string;
    storeBioFontColor?: string;
    avatarBorderColor?: string;
    activeCategoryBorderColor?: string;
    fontFamily?: string;
    mainBackgroundGradientStartColor?: string;
    mainBackgroundGradientEndColor?: string;
    storeBackgroundColor?: string;
    currencySymbol?: string;
    priceFontColor?: string;
    slideOverlayColor?: string;
    slideOverlayOpacity?: number;
    slideTitleColor?: string;
    slideDescriptionColor?: string;
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

export async function getSlideById(slideId: string): Promise<Slide | null> {
  try {
    const slideRef = doc(db, 'slides', slideId);
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

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(db, 'products', productId);
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
    const fileName = `${productId}_${Date.now()}`;
    const imageRef = ref(storage, `product_images/${storeId}/${productId}/${fileName}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading product image:', error);
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

export async function uploadStoreImage(storeId: string, file: File, type: 'avatar' | 'background' | 'banner'): Promise<string> {
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

export async function uploadWidgetImage(storeId: string, file: File): Promise<string> {
  try {
    const fileName = `${storeId}_widget_${Date.now()}`;
    const imageRef = ref(storage, `stores/${fileName}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading widget image:', error);
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
