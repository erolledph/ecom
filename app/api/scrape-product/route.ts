import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

interface ScrapedProduct {
  name: string;
  description: string;
  price: string;
  images: string[];
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
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
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

    // Extract product information using various selectors
    const scrapedData: ScrapedProduct = {
      name: '',
      description: '',
      price: '',
      images: []
    };

    // Extract product name - try multiple selectors
    const nameSelectors = [
      'h1[data-testid="product-title"]',
      'h1.product-title',
      'h1#product-title',
      '.product-name h1',
      '.product-title',
      'h1[class*="title"]',
      'h1[class*="name"]',
      'h1[class*="product"]',
      'h1',
      '[data-testid="product-name"]',
      '.pdp-product-name',
      '.product-name'
    ];

    for (const selector of nameSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        scrapedData.name = element.text().trim();
        break;
      }
    }

    // Extract price - try multiple selectors
    const priceSelectors = [
      '.price-current',
      '.current-price',
      '.price',
      '[data-testid="price"]',
      '.product-price',
      '.price-now',
      '.sale-price',
      '.regular-price',
      '[class*="price"]',
      '[id*="price"]',
      '.pdp-price'
    ];

    for (const selector of priceSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        let priceText = element.text().trim();
        // Clean up price text - extract numbers and currency symbols
        const priceMatch = priceText.match(/[\$£€¥₹]\s*[\d,]+\.?\d*/);
        if (priceMatch) {
          scrapedData.price = priceMatch[0];
          break;
        }
      }
    }

    // Extract description - try multiple selectors
    const descriptionSelectors = [
      '.product-description',
      '[data-testid="product-description"]',
      '.product-details',
      '.description',
      '.product-info',
      '.product-summary',
      '.pdp-description',
      '[class*="description"]'
    ];

    for (const selector of descriptionSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        let description = element.text().trim();
        // Limit description length
        if (description.length > 500) {
          description = description.substring(0, 500) + '...';
        }
        scrapedData.description = description;
        break;
      }
    }

    // Extract images - try multiple selectors
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
      'img[alt*="product"]'
    ];

    const imageUrls = new Set<string>();
    
    for (const selector of imageSelectors) {
      $(selector).each((_, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy');
        if (src && imageUrls.size < 5) {
          // Convert relative URLs to absolute
          try {
            const absoluteUrl = new URL(src, url).href;
            // Filter out small images (likely thumbnails or icons)
            if (!src.includes('icon') && !src.includes('logo') && !src.includes('thumb')) {
              imageUrls.add(absoluteUrl);
            }
          } catch {
            // Skip invalid URLs
          }
        }
      });
      
      if (imageUrls.size >= 5) break;
    }

    // Convert image URLs to base64
    const base64Images: string[] = [];
    for (const imageUrl of Array.from(imageUrls).slice(0, 5)) {
      try {
        console.log('Fetching image:', imageUrl);
        const imageResponse = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: AbortSignal.timeout(5000),
        });
        
        if (imageResponse.ok) {
          const buffer = await imageResponse.buffer();
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
          
          // Only process images under 5MB
          if (buffer.length < 5 * 1024 * 1024) {
            const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;
            base64Images.push(base64);
          }
        }
      } catch (error) {
        console.error('Error fetching image:', imageUrl, error);
        // Continue with other images
      }
    }

    scrapedData.images = base64Images;

    // Fallback values if scraping failed
    if (!scrapedData.name) {
      scrapedData.name = 'Product Name (Please edit)';
    }
    if (!scrapedData.description) {
      scrapedData.description = 'Product description (Please edit)';
    }
    if (!scrapedData.price) {
      scrapedData.price = '0.00';
    }

    console.log('Scraping completed:', {
      name: scrapedData.name,
      description: scrapedData.description.substring(0, 100) + '...',
      price: scrapedData.price,
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
