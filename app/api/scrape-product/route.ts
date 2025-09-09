import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface ScrapedProduct {
  name: string;
  description: string;
  price: string;
  images: string[];
}

interface SchemaProduct {
  '@type'?: string;
  name?: string;
  description?: string;
  image?: string | string[] | { url: string }[];
  offers?: {
    price?: string | number;
    priceCurrency?: string;
    lowPrice?: string | number;
    highPrice?: string | number;
  } | Array<{
    price?: string | number;
    priceCurrency?: string;
    lowPrice?: string | number;
    highPrice?: string | number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log('Scraping product from URL:', url);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      signal: controller.signal,
    });

    // Clear the timeout since the request completed
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Initialize scraped data
    const scrapedData: ScrapedProduct = {
      name: '',
      description: '',
      price: '', // Will be empty for manual entry
      images: []
    };

    // 1. Try to extract data from Schema.org JSON-LD (highest priority)
    console.log('Attempting to extract Schema.org JSON-LD data...');
    const schemaData = extractSchemaOrgData($);
    if (schemaData) {
      console.log('Found Schema.org data:', schemaData);
      
      if (schemaData.name) {
        scrapedData.name = cleanText(schemaData.name);
        console.log('✓ Name from Schema.org:', scrapedData.name);
      }
      
      if (schemaData.description) {
        scrapedData.description = cleanText(schemaData.description);
        console.log('✓ Description from Schema.org');
      }
      
      if (schemaData.image) {
        const images = extractImagesFromSchema(schemaData.image, url);
        scrapedData.images.push(...images);
        console.log('✓ Images from Schema.org:', images.length);
      }
    }

    // 2. Try to extract data from Open Graph meta tags (second priority)
    console.log('Attempting to extract Open Graph meta tags...');
    const ogData = extractOpenGraphData($);
    if (ogData) {
      console.log('Found Open Graph data:', ogData);
      
      if (!scrapedData.name && ogData.title) {
        scrapedData.name = cleanText(ogData.title);
        console.log('✓ Name from Open Graph:', scrapedData.name);
      }
      
      if (!scrapedData.description && ogData.description) {
        scrapedData.description = cleanText(ogData.description);
        console.log('✓ Description from Open Graph');
      }
      
      if (ogData.image && scrapedData.images.length === 0) {
        try {
          const absoluteUrl = new URL(ogData.image, url).href;
          scrapedData.images.push(absoluteUrl);
          console.log('✓ Image from Open Graph:', absoluteUrl);
        } catch {
          console.log('✗ Invalid Open Graph image URL');
        }
      }
    }

    // 3. Try to extract data from Twitter Card meta tags (third priority)
    console.log('Attempting to extract Twitter Card meta tags...');
    const twitterData = extractTwitterCardData($);
    if (twitterData) {
      console.log('Found Twitter Card data:', twitterData);
      
      if (!scrapedData.name && twitterData.title) {
        scrapedData.name = cleanText(twitterData.title);
        console.log('✓ Name from Twitter Card:', scrapedData.name);
      }
      
      if (!scrapedData.description && twitterData.description) {
        scrapedData.description = cleanText(twitterData.description);
        console.log('✓ Description from Twitter Card');
      }
      
      if (twitterData.image && scrapedData.images.length === 0) {
        try {
          const absoluteUrl = new URL(twitterData.image, url).href;
          scrapedData.images.push(absoluteUrl);
          console.log('✓ Image from Twitter Card:', absoluteUrl);
        } catch {
          console.log('✗ Invalid Twitter Card image URL');
        }
      }
    }

    // 4. Fallback to CSS selectors for missing data
    console.log('Using CSS selectors for missing data...');
    
    // Extract product name if not found
    if (!scrapedData.name) {
      scrapedData.name = extractProductName($);
      if (scrapedData.name) {
        console.log('✓ Name from CSS selectors:', scrapedData.name);
      }
    }

    // Extract description if not found
    if (!scrapedData.description) {
      scrapedData.description = extractProductDescription($);
      if (scrapedData.description) {
        console.log('✓ Description from CSS selectors');
      }
    }

    // Extract additional images if needed (limit to 5 total)
    if (scrapedData.images.length < 5) {
      const additionalImages = extractProductImages($, url, 5 - scrapedData.images.length);
      scrapedData.images.push(...additionalImages);
      if (additionalImages.length > 0) {
        console.log('✓ Additional images from CSS selectors:', additionalImages.length);
      }
    }

    // Remove duplicates from images using Array.from() instead of spread operator
    scrapedData.images = Array.from(new Set(scrapedData.images));

    // Apply fallback values if scraping failed
    if (!scrapedData.name) {
      scrapedData.name = 'Product Name (Please edit)';
      console.log('⚠ Using fallback product name');
    }
    if (!scrapedData.description) {
      scrapedData.description = 'Product description (Please edit)';
      console.log('⚠ Using fallback description');
    }
    // Price is intentionally left empty for manual entry
    scrapedData.price = '';

    // Clean up the data
    scrapedData.name = cleanText(scrapedData.name);
    scrapedData.description = cleanText(scrapedData.description);
    if (scrapedData.description.length > 500) {
      scrapedData.description = scrapedData.description.substring(0, 500) + '...';
    }

    console.log('Scraping completed:', {
      name: scrapedData.name,
      description: scrapedData.description.substring(0, 100) + '...',
      price: 'Manual entry required',
      imageCount: scrapedData.images.length
    });

    return NextResponse.json(scrapedData);
    
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to scrape product details. Please check the URL and try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Extract Schema.org JSON-LD data
function extractSchemaOrgData($: cheerio.CheerioAPI): SchemaProduct | null {
  try {
    const scripts = $('script[type="application/ld+json"]');
    
    for (let i = 0; i < scripts.length; i++) {
      const scriptContent = $(scripts[i]).html();
      if (!scriptContent) continue;
      
      try {
        const jsonData = JSON.parse(scriptContent);
        
        // Handle both single objects and arrays
        const items = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        for (const item of items) {
          // Look for Product schema
          if (item['@type'] === 'Product' || 
              (Array.isArray(item['@type']) && item['@type'].includes('Product'))) {
            return item as SchemaProduct;
          }
          
          // Sometimes products are nested in other schemas
          if (item['@graph']) {
            const product = item['@graph'].find((graphItem: any) => 
              graphItem['@type'] === 'Product' || 
              (Array.isArray(graphItem['@type']) && graphItem['@type'].includes('Product'))
            );
            if (product) return product as SchemaProduct;
          }
        }
      } catch (parseError) {
        console.log('Failed to parse JSON-LD script:', parseError);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.log('Error extracting Schema.org data:', error);
    return null;
  }
}

// Extract Open Graph meta tags
function extractOpenGraphData($: cheerio.CheerioAPI) {
  try {
    const ogData = {
      title: $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[property="og:description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      url: $('meta[property="og:url"]').attr('content') || '',
      type: $('meta[property="og:type"]').attr('content') || '',
    };
    
    return ogData.title || ogData.description || ogData.image ? ogData : null;
  } catch (error) {
    console.log('Error extracting Open Graph data:', error);
    return null;
  }
}

// Extract Twitter Card meta tags
function extractTwitterCardData($: cheerio.CheerioAPI) {
  try {
    const twitterData = {
      title: $('meta[name="twitter:title"]').attr('content') || '',
      description: $('meta[name="twitter:description"]').attr('content') || '',
      image: $('meta[name="twitter:image"]').attr('content') || '',
    };
    
    return twitterData.title || twitterData.description || twitterData.image ? twitterData : null;
  } catch (error) {
    console.log('Error extracting Twitter Card data:', error);
    return null;
  }
}

// Extract images from Schema.org image field
function extractImagesFromSchema(image: SchemaProduct['image'], baseUrl: string): string[] {
  if (!image) return [];
  
  try {
    const images: string[] = [];
    
    if (typeof image === 'string') {
      images.push(image);
    } else if (Array.isArray(image)) {
      for (const img of image) {
        if (typeof img === 'string') {
          images.push(img);
        } else if (img && typeof img === 'object' && img.url) {
          images.push(img.url);
        }
      }
    }
    
    // Convert relative URLs to absolute and filter valid URLs
    return images.map(img => {
      try {
        return new URL(img, baseUrl).href;
      } catch {
        return img;
      }
    }).filter(img => img.startsWith('http'));
    
  } catch (error) {
    console.log('Error extracting images from schema:', error);
    return [];
  }
}

// Fallback: Extract product name using CSS selectors
function extractProductName($: cheerio.CheerioAPI): string {
  const nameSelectors = [
    'h1[data-testid="product-title"]',
    'h1.product-title',
    'h1#product-title',
    '.product-name h1',
    '.product-title',
    'h1[class*="title"]',
    'h1[class*="name"]',
    'h1[class*="product"]',
    '[data-testid="product-name"]',
    '.pdp-product-name',
    '.product-name',
    '.product-title-text',
    '.item-title',
    'h1'
  ];

  for (const selector of nameSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  return '';
}

// Fallback: Extract product description using CSS selectors
function extractProductDescription($: cheerio.CheerioAPI): string {
  const descriptionSelectors = [
    '.product-description',
    '[data-testid="product-description"]',
    '.product-details',
    '.description',
    '.product-info',
    '.product-summary',
    '.pdp-description',
    '[class*="description"]',
    '.product-overview',
    '.item-description',
    'meta[name="description"]'
  ];

  for (const selector of descriptionSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  // Try meta description as final fallback
  const metaDescription = $('meta[name="description"]').attr('content');
  if (metaDescription) {
    return metaDescription.trim();
  }
  
  return '';
}

// Fallback: Extract product images using CSS selectors
function extractProductImages($: cheerio.CheerioAPI, baseUrl: string, maxImages: number): string[] {
  const imageSelectors = [
    '.product-image img',
    '.product-images img',
    '[data-testid="product-image"] img',
    '.gallery img',
    '.product-gallery img',
    '.main-image img',
    '.hero-image img',
    '.pdp-image img',
    'img[class*="product"]',
    'img[alt*="product"]',
    '.item-image img'
  ];

  const imageUrls: string[] = [];
  
  for (const selector of imageSelectors) {
    $(selector).each((_, element) => {
      if (imageUrls.length >= maxImages) return false;
      
      const src = $(element).attr('src') || 
                   $(element).attr('data-src') || 
                   $(element).attr('data-lazy') ||
                   $(element).attr('data-original');
                   
      if (src) {
        try {
          const absoluteUrl = new URL(src, baseUrl).href;
          // Filter out small images, icons, and common non-product images
          if (!src.includes('icon') && 
              !src.includes('logo') && 
              !src.includes('thumb') &&
              !src.includes('sprite') &&
              !absoluteUrl.includes('data:image') &&
              !imageUrls.includes(absoluteUrl)) {
            imageUrls.push(absoluteUrl);
          }
        } catch {
          // Skip invalid URLs
        }
      }
    });
    
    if (imageUrls.length >= maxImages) break;
  }

  return imageUrls;
}

// Clean and normalize text
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
    .replace(/\n+/g, ' ')  // Replace newlines with space
    .trim();
}
