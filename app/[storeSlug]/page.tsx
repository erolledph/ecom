import { notFound } from 'next/navigation';
import { getStoreBySlug, getStoreProducts, getStoreSlides, generateCategoriesFromProductsSync } from '@/lib/store';
import StoreTemplate from '@/components/StoreTemplate';

interface StorePageProps {
  params: {
    storeSlug: string;
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = params;

  try {
    // Fetch store data
    const store = await getStoreBySlug(storeSlug);
    
    if (!store || !store.isActive) {
      notFound();
    }

    // Fetch products and slides
    const [products, slides] = await Promise.all([
      getStoreProducts(store.id),
      getStoreSlides(store.id)
    ]);

    // Generate categories from products
    const categories = generateCategoriesFromProductsSync(products);

    return (
      <StoreTemplate 
        store={store}
        products={products}
        slides={slides.filter(slide => slide.isActive)}
        categories={categories}
      />
    );
  } catch (error) {
    console.error('Error loading store:', error);
    notFound();
  }
}