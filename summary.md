# Affiliate Store Builder - Project Summary

## Overview
This is a comprehensive affiliate store builder application built with Next.js, React, TypeScript, and Firebase. Users can create and customize their own affiliate stores to showcase products and earn commissions through affiliate links.

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Image Processing**: image-resize-compress library
- **Deployment**: Netlify
- **UI Components**: Lucide React icons

## Key Features Implemented

### 🔐 Authentication System
- Email/password authentication with Firebase Auth
- Strong password validation (8+ chars, uppercase, lowercase, numbers, special chars)
- User profile management
- Automatic store creation on signup
- Protected dashboard routes

### 🏪 Store Management
- **Store Customization**: 
  - Custom branding, colors, and layouts
  - Avatar and background image uploads
  - Social media integration
  - Header layout options (left-right, right-left, center)
  - Custom font families and color schemes (heading and body fonts)
  - Custom font families and color schemes
- **Store Settings**: Name, description, slug management
- **Responsive Design**: Mobile-friendly stores
- **SEO Optimization**: Meta tags, Open Graph, Twitter cards

### 📦 Product Management
- Add/edit/delete affiliate products
- Product images with automatic compression
- Categories with auto-generation from products
- Price display with custom currency symbols
- Product linking to affiliate URLs
  - Product linking to affiliate URLs
- Bulk product management interface

### 🎨 Promotional Slides
- Create promotional slides for homepage
- Image upload with automatic optimization
- Slide ordering and management
- Click-through to affiliate links
  - Click-through to affiliate links
- Auto-advancing slideshow

### 🖼️ Advanced Image Optimization (Latest Implementation)
- **Automatic Compression**: All uploaded images compressed to 75% quality
- **Format Conversion**: All images automatically converted to WebP format
- **Smart Resizing**: 
  - Avatar/Widget images: Max 200px width
  - Product/Slide/Background/Banner images: Max 1200px width
  - Maintains aspect ratio automatically
- **Filename Preservation**: Original filenames sanitized and preserved
- **Storage Optimization**: Significant reduction in storage costs and faster loading
- **Invisible to Users**: Completely behind-the-scenes optimization

### 🎯 Widget & Banner System
- Floating widget with custom image and link
- Pop-up banner system with custom images and descriptions
- Configurable display settings

### 📊 Dashboard
- Comprehensive overview with statistics
- Quick actions for common tasks
- Product and slide management interfaces
- Store analytics and insights

### 📊 Analytics Dashboard (New)
- **Comprehensive Tracking**: Tracks various user interactions including store views, product clicks, slide clicks, social link clicks, widget clicks, banner clicks, product searches, and category filters.
- **Persistent Storage**: All analytics events are stored in Firestore for reliable tracking.
- **Key Metrics**: Displays total product clicks, store views, slide clicks, social link clicks, and searches.
- **Detailed Insights**:
  - **Top Performing Products**: Lists the top 10 products by click count.
  - **Most Filtered Categories**: Shows the top 10 categories that users filter by.
  - **Most Searched Terms**: Displays the top 10 most frequent search queries.
- **Actionable Data**: Provides insights to improve product strategy, inventory, SEO, and conversion rates.
- **Data Management**: Allows refreshing and clearing of analytics data.

### 💬 Toast Notification System (New)
- Provides user feedback for actions (success, error, info, warning).
- Integrated with `ToastProvider` and `useToast` hook for easy usage across the application.

## File Structure

### Core Application Files
- `app/page.tsx` - Main landing page with auth redirect
- `app/layout.tsx` - Root layout with toast provider
- `app/globals.css` - Global styles and Tailwind configuration

### Authentication
- `app/auth/page.tsx` - Login/signup page
- `lib/auth.ts` - Authentication functions and user management
- `hooks/useAuth.ts` - Authentication hook

### Dashboard
- `app/dashboard/layout.tsx` - Dashboard layout with navigation
- `app/dashboard/page.tsx` - Dashboard overview
- `app/dashboard/store/page.tsx` - Store settings (referenced but not shown)
- `app/dashboard/products/` - Product management pages
- `app/dashboard/slides/` - Slide management pages
- `app/dashboard/analytics/page.tsx` - Analytics dashboard page (New)

### Core Application Files
- `app/page.tsx` - Main landing page with auth redirect
- `app/layout.tsx` - Root layout with toast provider
- `app/globals.css` - Global styles and Tailwind configuration

### Authentication
- `app/auth/page.tsx` - Login/signup page
- `lib/auth.ts` - Authentication functions and user management
- `hooks/useAuth.ts` - Authentication hook

### Dashboard
- `app/dashboard/layout.tsx` - Dashboard layout with navigation
- `app/dashboard/page.tsx` - Dashboard overview
- `app/dashboard/store/page.tsx` - Store settings (referenced but not shown)
- `app/dashboard/products/` - Product management pages
- `app/dashboard/slides/` - Slide management pages

### Store Frontend
- `app/[storeSlug]/page.tsx` - Public store page
- `components/StoreTemplate.tsx` - Store display component

### Core Components
- `components/DashboardNav.tsx` - Dashboard navigation
- `components/ProductForm.tsx` - Product add/edit form
- `components/SlideForm.tsx` - Slide add/edit form
- `components/Toast.tsx` - Toast notification system
- `context/ToastContext.tsx` - Toast notification context

### Backend & Data
- `lib/firebase.ts` - Firebase configuration
- `lib/store.ts` - Store, product, and slide management functions
- `context/ToastContext.tsx` - Toast notification context

- `components/AnalyticsProvider.tsx` - Context for tracking page views (New)
### Configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `package.json` - Dependencies and scripts
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules

## Recent Major Updates

### Analytics Dashboard Implementation (New)
- Added `lib/analytics.ts` for tracking events (`trackEvent`, `trackPageView`).
- Implemented `app/dashboard/analytics/page.tsx` to display key metrics and detailed insights (Top Products, Categories, Searches).
- Integrated `AnalyticsProvider` (`components/AnalyticsProvider.tsx`) for client-side page view tracking.
- Updated `firestore.rules` to allow public creation of analytics events and owner-only read/write.

### Store Customization Enhancements
- Expanded customization options in `app/dashboard/store/page.tsx` to include font families, various color settings, and background gradients.
- Added widget and banner system controls.

### Product Scraping Feature
- Implemented product URL scraping functionality in `components/ProductForm.tsx` to auto-fill product details.

### Toast Notification System
- Introduced `context/ToastContext.tsx` and `components/Toast.tsx` for a global, user-friendly notification system.

### Image Optimization Implementation
- Added `image-resize-compress` dependency
- Implemented automatic image compression for all uploads
- Created filename sanitization utility
- Updated all image upload functions:
  - `uploadProductImage()`
  - `uploadSlideImage()`
  - `uploadStoreImage()`
  - `uploadWidgetImage()`
- Centralized image processing logic in `lib/store.ts`

## Database Schema

### Collections
- **users**: User profiles and settings
- **stores**: Store configurations and customizations
- **products**: Affiliate products with images and links
- **slides**: Promotional slides for store homepage
- **analytics_events**: Stores all tracked user interaction events (New)

### Security
- Row Level Security (RLS) implemented
- Public read access for store data
- Owner-only write access for user data
- Proper authentication checks
- **Firestore Rules**: Specifically configured for `analytics_events` to allow unauthenticated users to create events (for public store visitors) and authenticated owners to read/update/delete their own data.

## Deployment
- Configured for Netlify deployment
- Environment variables for Firebase configuration
- Optimized build process with standalone output

## Performance Optimizations
- Image compression and WebP conversion
- Lazy loading for images
- Responsive image sizing
- Efficient Firebase queries
- Client-side caching strategies

## Future Considerations
- Analytics integration
- Payment processing (Stripe integration referenced)
- Advanced SEO features
- Performance monitoring
- A/B testing capabilities

## Development Status
✅ **Completed**: Core functionality, authentication, store management, product management, slide management, image optimization, analytics dashboard, toast notifications, product scraping, advanced store customization.
🔄 **In Progress**: Further store customization features.
📋 **Planned**: Advanced analytics, payment integration, enhanced SEO.

---

*Last Updated: December 2024*
*Total Files: 30+ TypeScript/JavaScript files*
*Lines of Code: 5000+ lines*