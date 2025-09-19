# Affiliate Store Builder

This is a [Next.js](https://nextjs.org/) project for building affiliate stores. Users can create and customize their own affiliate stores to showcase products and earn commissions through affiliate links.

## Features

- **Store Customization**: Personalize your store with custom branding, colors, and layouts
-   **Product Management**: Add affiliate products with images, descriptions, and affiliate links, including a product scraping feature.
- **Slider Management**: Create promotional slides to highlight featured products or offers
-   **Analytics Dashboard**: Track store views, product clicks, slide clicks, social link engagement, search queries, and category filters to understand user behavior.
- **Responsive Design**: Mobile-friendly stores that work on all devices
- **Social Integration**: Connect your social media accounts to drive traffic
- **SEO Friendly**: Optimized for search engines to increase visibility
-   **Image Optimization**: Automatic compression and WebP conversion for all uploaded images.
-   **Floating Widget & Pop-up Banner**: Engage visitors with customizable widgets and promotional banners.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. **Sign Up**: Create your account to get started
2. **Customize Store**: Set up your store name, description, and branding
3. **Add Products**: Add affiliate products with their affiliate links
4. **Create Slides**: Design promotional slides for your homepage
5.  **Add Products**: Add affiliate products with their affiliate links, optionally using the product scraping tool.
6.  **Share Your Store**: Share your unique store URL to start earning commissions
7.  **Monitor Analytics**: View detailed insights into user interactions and store performance.

## Store Structure

Each store gets a unique URL: `yourdomain.com/your-store-slug`

When visitors click on products, they're redirected to the affiliate links where you earn commissions.

## Tech Stack


- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
-   **Image Processing**: `image-resize-compress` library
- **Deployment**: Netlify

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Netlify

The easiest way to deploy your affiliate store builder is to use Netlify. The project is already configured for Netlify deployment.

Check out the [Netlify deployment documentation](https://docs.netlify.com/) for more details.