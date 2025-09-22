import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getStoreBySlug, getStoreProducts, getStoreSlides, generateCategoriesWithCountSync } from '@/lib/store';
import StoreTemplate from '@/components/StoreTemplate';

interface StorePageProps {
  params: {
    storeSlug: string;
  };
  searchParams: {
    category?: string;
  };
}

export async function generateMetadata({ params, searchParams }: StorePageProps): Promise<Metadata> {
  const { storeSlug } = params;

  try {
    const store = await getStoreBySlug(storeSlug);
    
    if (!store || !store.isActive) {
      return {
        title: 'Store Not Found',
        description: 'The requested store could not be found.',
      };
    }

    // Ensure avatar URL is absolute, with fallback to default avatar
    let avatarUrl: string;
    if (store.avatar && store.avatar.startsWith('http')) {
      avatarUrl = store.avatar;
    } else if (store.avatar) {
      avatarUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tiangge.shop'}${store.avatar}`;
    } else {
      // Fallback to default avatar SVG
      avatarUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tiangge.shop'}/avatar-default.svg`;
    }

    return {
      title: store.name,
      description: store.description,
      openGraph: {
        title: store.name,
        description: store.description,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tiangge.shop'}/${storeSlug}`,
        siteName: store.name,
        images: [
          {
            url: avatarUrl,
            width: 1200,
            height: 630,
            alt: `${store.name} - Store Avatar`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: store.name,
        description: store.description,
        images: [avatarUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Affiliate Store',
      description: 'Discover amazing products and deals.',
    };
  }
}

export default async function StorePage({ params, searchParams }: StorePageProps) {
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
    const categories = generateCategoriesWithCountSync(products);

    return (
      <StoreTemplate 
        store={store}
        products={products}
        slides={slides.filter(slide => slide.isActive)}
        categories={categories}
        initialCategory={searchParams.category}
      />
    );
  } catch (error) {
    console.error('Error loading store:', error);
    notFound();
  }
}
