import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getStoreBySlug, getStoreProducts, getStoreSlides, generateCategoriesWithCountSync, getSponsoredProducts, SponsoredProduct, getStoreProductsWithTrialLimits } from '@/lib/store';
import { getUserProfile } from '@/lib/auth';
import StoreTemplate from '@/components/StoreTemplate';

interface StorePageProps {
  params: {
    storeSlug: string;
  };
  searchParams: {
    category?: string;
  };
}

function getBaseUrl(): string {
  const headersList = headers();
  const host = headersList.get('host') || 'tiangge.shop';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  return `${protocol}://${host}`;
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

    const baseUrl = getBaseUrl();

    // Determine SEO mode
    const useAutomatic = store.seoSettings?.useAutomatic !== false;

    // Get title and description
    let title: string;
    let description: string;

    if (useAutomatic) {
      title = store.name;
      description = store.description;
    } else {
      title = store.seoSettings?.metaTitle || store.name;
      description = store.seoSettings?.metaDescription || store.description;
    }

    // Determine image URL
    let imageUrl: string;

    if (!useAutomatic && store.seoSettings?.ogImage) {
      // Use custom OG image if provided (should be full URL)
      if (store.seoSettings.ogImage.startsWith('http')) {
        imageUrl = store.seoSettings.ogImage;
      } else {
        imageUrl = `${baseUrl}${store.seoSettings.ogImage}`;
      }
    } else {
      // Use avatar or default
      if (store.avatar && store.avatar.startsWith('http')) {
        imageUrl = store.avatar;
      } else if (store.avatar) {
        imageUrl = `${baseUrl}${store.avatar}`;
      } else {
        // Fallback to default avatar WebP
        imageUrl = `${baseUrl}/default-avatar.webp`;
      }
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${baseUrl}/${storeSlug}`,
        siteName: store.name,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${store.name} - Store Image`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
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
      getStoreProductsWithTrialLimits(store.id, store),
      getStoreSlides(store.id)
    ]);

    // Fetch sponsored products and inject them based on product count
    let finalProducts = [...products];
    
    if (products.length > 15) {
      try {
        const sponsoredProducts = await getSponsoredProducts();
        
        if (sponsoredProducts.length > 0) {
          // Randomly select sponsored products
          const shuffledSponsored = [...sponsoredProducts].sort(() => Math.random() - 0.5);
          
          let sponsoredToInject: SponsoredProduct[] = [];
          
          if (products.length >= 25 && shuffledSponsored.length >= 2) {
            // Select 2 different sponsored products for stores with 25+ products
            sponsoredToInject = shuffledSponsored.slice(0, 2);
          } else {
            // Select 1 sponsored product for stores with 15-24 products
            sponsoredToInject = shuffledSponsored.slice(0, 1);
          }
          
          // Convert sponsored products to regular product format with isSponsored flag
          const convertedSponsored = sponsoredToInject.map(sp => ({
            ...sp,
            storeId: store.id,
            isSponsored: true
          }));
          
          // Inject sponsored products at specific positions
          if (convertedSponsored.length >= 1) {
            // Insert first sponsored product at position 0 (1st card)
            finalProducts.unshift(convertedSponsored[0]);
          }
          
          if (convertedSponsored.length >= 2) {
            // Insert second sponsored product at position 6 (7th card after the first injection)
            finalProducts.splice(6, 0, convertedSponsored[1]);
          }
        }
      } catch (error) {
        console.error('Error fetching sponsored products:', error);
        // Continue without sponsored products if there's an error
      }
    }

    // Generate categories from products
    const categories = generateCategoriesWithCountSync(products); // Use original products for categories, not sponsored ones

    return (
      <StoreTemplate 
        store={store}
        products={finalProducts}
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
