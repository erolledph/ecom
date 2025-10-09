# Affiliate Store Builder - Project Summary

## Overview
This is a comprehensive affiliate store builder application built with Next.js, React, TypeScript, and Firebase. Users can create and customize their own affiliate stores to showcase products and earn commissions through affiliate links.

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Image Processing**: image-resize-compress library with WebP conversion
- **Analytics**: Custom analytics system with Firestore persistence
- **Deployment**: Netlify with optimized build configuration
- **UI Components**: Lucide React icons, custom component library

## Key Features Implemented

### 🔐 Authentication & User Management System
- **Strong Authentication**: Email/password with comprehensive validation (8+ chars, mixed case, numbers, special chars)
- **Automatic Store Creation**: Each user gets a unique store with custom URL on signup
- **User Roles**: Admin and user roles with different permission levels
- **Premium Features**: Tiered access system with premium user benefits
- **Protected Routes**: Dashboard routes protected with authentication checks

### 🏪 Advanced Store Management & Customization
- **Store Branding**: Custom avatars, background images, and social media integration
- **Typography System**: Custom font families for headings and body text with extensive options
- **Color Customization**: Comprehensive color system including:
  - Store name and bio colors
  - Background gradients (start/end colors)
  - Border colors (avatar, active categories)
  - Social icon colors
  - Button colors (CTA buttons)
  - Price display colors
- **Layout Options**: Multiple header layouts (left-right, right-left, center)
- **Responsive Design**: Mobile-first design optimized for all devices
- **SEO Optimization**: Meta tags, Open Graph, Twitter cards for better visibility
- **Custom HTML**: Sanitized HTML editor for custom content sections

### 📦 Product Management System
- **Full CRUD Operations**: Add, edit, delete affiliate products with comprehensive forms
- **Product Scraping**: Auto-fill product details by scraping product URLs using external API
- **Bulk Import**: CSV import functionality for adding hundreds of products at once (Premium feature)
- **Image Management**: Upload or URL-based images with automatic optimization
- **Category System**: Auto-generated categories from products with filtering capabilities
- **Click Tracking**: Monitor product performance with detailed analytics
- **Affiliate Integration**: Direct linking to affiliate URLs with tracking
- **Product Limits**: Standard users limited to 30 products, Premium users unlimited

### 🎨 Content & Promotional Features
- **Promotional Slides**: Create carousel slides with images, descriptions, and affiliate links
- **Floating Widget**: Customizable floating widgets with images and links (Premium feature)
- **Pop-up Banners**: Promotional banners with custom images, descriptions, and links (Premium feature)
- **Auto-advancing Slideshow**: Slides automatically advance with manual navigation options
- **Custom HTML Sections**: Add sanitized custom HTML content to stores

### 🖼️ Advanced Image Optimization System
- **Automatic Compression**: All uploaded images compressed to 75% quality for optimal performance
- **Format Conversion**: Automatic conversion to WebP format for better compression
- **Smart Resizing**: Intelligent resizing based on image type:
  - Avatar/Widget images: Max 200px width
  - Product/Slide/Background/Banner images: Max 1200px width
  - Maintains aspect ratio automatically
- **Filename Sanitization**: Original filenames preserved and sanitized
- **Storage Optimization**: Significant reduction in storage costs and faster loading times

### 📊 Analytics & Performance Tracking
- **Comprehensive Event Tracking**: Tracks various user interactions including:
  - Store views and visitor traffic
  - Product clicks with detailed product information
  - Slide clicks and promotional content engagement
  - Social link clicks and platform engagement
  - Widget and banner clicks (Premium users)
  - Search queries and category filters
  - Subscription form interactions
  - Sponsored product clicks
- **Persistent Storage**: All analytics events stored in Firestore for reliable tracking
- **Performance Insights**: 
  - Top performing products by click count
  - Most filtered categories
  - Most searched terms and user intent
  - Conversion tracking and user behavior analysis
- **Data Export**: CSV export capabilities for subscribers and analytics data (Premium feature)
- **Real-time Dashboard**: Live analytics dashboard with actionable insights

### 💬 Customer Engagement Features
- **Email Subscriptions**: Popup subscription forms with customizable timing and appearance
- **Subscriber Management**: Full CRUD operations for email subscribers
- **Toast Notification System**: User-friendly feedback for all interactions
- **Search Functionality**: Product search with real-time filtering and tracking
- **Category Filtering**: Dynamic category filtering with user behavior tracking
- **System Notifications**: Real-time broadcast notifications from administrators
- **Notification Center**: Dashboard notification bell with unread count and persistent modal viewing

### 🎯 Admin & System Management
- **User Management Panel**: 
  - Search users by email address
  - View all registered users with store information
  - Toggle user roles between User and Admin
  - Grant or revoke Premium access
  - Direct links to user stores
- **Global Broadcast System**: 
  - Create system-wide announcement banners
  - Upload custom images with descriptions and links
  - Control banner visibility and timing
  - Track banner click performance
- **Broadcast Notifications**: Dashboard notification system with Markdown support and read tracking
- **Sponsored Products Management**:
  - Admin-managed products that appear in user stores
  - Automatic placement in stores with 15+ products
  - Revenue sharing through sponsored product clicks
  - Performance tracking and analytics

### 🔒 Security & Data Protection
- **Row Level Security**: Comprehensive Firestore security rules
- **Data Validation**: Client and server-side validation for all inputs
- **HTML Sanitization**: Safe HTML content with DOMPurify
- **Authentication Checks**: Protected routes and API endpoints
- **Privacy Controls**: User data ownership and access controls

## File Structure & Architecture

### Core Application Files
- `app/page.tsx` - Main landing page with authentication redirect
- `app/layout.tsx` - Root layout with toast provider and analytics
- `app/globals.css` - Global styles and Tailwind configuration

### Authentication System
- `app/auth/page.tsx` - Comprehensive login/signup page with validation
- `lib/auth.ts` - Authentication functions, user management, and role controls
- `hooks/useAuth.ts` - Authentication hook with user profile management

### Dashboard System
- `app/dashboard/layout.tsx` - Dashboard layout with responsive navigation
- `app/dashboard/page.tsx` - Dashboard overview with statistics and quick actions
- `app/dashboard/store/page.tsx` - Advanced store customization settings
- `app/dashboard/products/` - Product management pages with CRUD operations
- `app/dashboard/slides/` - Slide management pages with form handling
- `app/dashboard/analytics/page.tsx` - Analytics dashboard with insights
- `app/dashboard/subscribers/page.tsx` - Subscriber management interface

### Store Frontend
- `app/[storeSlug]/page.tsx` - Public store page with SEO optimization
- `components/StoreTemplate.tsx` - Main store display component with all features

### Core Components
- `components/DashboardNav.tsx` - Responsive dashboard navigation with auto-collapse
- `components/DashboardHeader.tsx` - Header with notification bell and user menu
- `components/ProductForm.tsx` - Product add/edit form with scraping functionality
- `components/SlideForm.tsx` - Slide add/edit form with image handling
- `components/Toast.tsx` - Toast notification system with animations
- `components/SubscriptionModal.tsx` - Email subscription popup with tracking
- `components/NotificationModal.tsx` - Persistent notification display modal
- `components/NotificationForm.tsx` - Admin notification creation/editing form
- `components/CustomToggle.tsx` - Reusable toggle component
- `components/ImageUploadWithDelete.tsx` - Image upload component with optimization
- `components/CustomHtmlEditor.tsx` - Sanitized HTML editor component

### Admin Components
- `components/AdminRoute.tsx` - Admin access control wrapper
- `components/PremiumFeatureGate.tsx` - Premium feature access control
- `components/ProductCSVImporter.tsx` - Bulk product import functionality
- `components/SponsoredProductForm.tsx` - Sponsored product management
- `components/GlobalBannerDisplay.tsx` - Global banner display component

### Backend & Data Management
- `lib/firebase.ts` - Firebase configuration and initialization
- `lib/store.ts` - Store, product, slide, and subscriber management functions
- `lib/analytics.ts` - Analytics tracking and event management system
- `context/ToastContext.tsx` - Toast notification context provider

### System Management
- `app/dashboard/system-management/` - Admin panel pages
- `app/dashboard/system-management/users/page.tsx` - User management interface
- `app/dashboard/system-management/global-broadcast/page.tsx` - Global banner management
- `app/dashboard/system-management/broadcast-notifications/page.tsx` - Notification management
- `app/dashboard/system-management/sponsor-products/` - Sponsored product management

## Database Schema & Security

### Firestore Collections
- **users**: User profiles, roles, premium status, and account information
- **stores**: Store configurations nested under users (users/{userId}/stores/{storeId})
- **products**: Affiliate products nested under stores with click tracking
- **slides**: Promotional slides nested under stores with engagement metrics
- **subscribers**: Email subscribers nested under stores with subscription data
- **analytics_events**: User interaction tracking nested under stores
- **sponsored_products**: Global sponsored products managed by admins
- **global_banners**: System-wide announcement banners
- **notifications**: Broadcast notifications for all users
- **read_notifications**: Per-user notification read status tracking (nested under users)

### Security Implementation
- **Firestore Rules**: Comprehensive row-level security with proper access controls
- **Public Access**: Store data readable by anyone for public store viewing
- **Owner Access**: Users can only modify their own data and stores
- **Admin Access**: Special permissions for user management and system features
- **Analytics Security**: Public can create events, owners can read their own data

## Recent Major Updates & Enhancements

### Advanced Trial Management System (Latest Update)
- Implemented granular trial management controls for administrators
- Added ability to immediately end user trials without waiting for natural expiration
- Created trial reset functionality with business logic enforcement
- Added visual indicators and status displays for trial management
- Enhanced user management interface with trial action buttons
- Implemented safeguards to prevent trial resets after original 7-day window expires
- **Business Logic**: Admins can only reset trials within the original 7-day window from user creation
- **Security**: All trial management actions properly validated and logged

### Enhanced Notification System (Latest Update)
- Implemented comprehensive broadcast notification system for admin-to-user communication
- Added real-time notification bell with unread count badges in dashboard header
- Created persistent notification modal that remains open until manually closed
- Integrated Markdown formatting support for rich notification content
- Built per-user read status tracking with Firestore persistence
- Added notification management interface for administrators
- **Fixed auto-closing modal issue**: Notifications now stay open for proper reading
- Enhanced user experience with non-intrusive notification system

### Complete Admin System Implementation
- Built comprehensive user management system with search and role controls
- Created global broadcast system for platform-wide announcements
- Implemented sponsored products system for passive income generation
- Added system analytics and performance monitoring capabilities

### Advanced Analytics Dashboard
- Added comprehensive event tracking system with Firestore persistence
- Implemented detailed analytics dashboard with key metrics and insights
- Created top products, categories, and search terms analysis
- Added data export capabilities for premium users
- Integrated client-side page view tracking with AnalyticsProvider

### Enhanced Store Customization
- Expanded customization options with typography and color controls
- Added widget and banner system with engagement tracking (Premium features)
- Implemented custom HTML editor with DOMPurify sanitization
- Enhanced header layout options and responsive design

### Product Management Enhancements
- Added product URL scraping functionality for auto-filling details
- Implemented bulk CSV import for premium users with validation
- Enhanced product forms with better image handling
- Added comprehensive product analytics and performance tracking
- Implemented strict product limits (30 for standard users, unlimited for premium)

### Image Optimization System
- Implemented automatic image compression and WebP conversion
- Added smart resizing based on image type and usage
- Created filename sanitization for better organization
- Optimized storage costs and loading performance

### User Experience Improvements
- Enhanced toast notification system with better feedback
- Improved responsive design across all components
- Added loading states and error handling throughout the application
- Implemented auto-collapse navigation for better space utilization

### Premium Feature Gating
- Implemented comprehensive premium feature restrictions
- Added `PremiumFeatureGate` component for access control
- Enhanced store settings with premium-only toggles
- Clear UI indicators for premium features

## Performance Optimizations

### Image & Asset Optimization
- Automatic WebP conversion for all uploaded images
- Smart compression based on image type and usage
- Lazy loading for images and components
- Responsive image sizing with proper aspect ratios

### Database & Query Optimization
- Efficient Firestore queries with proper indexing
- Client-side caching strategies for better performance
- Batch operations for bulk data handling
- Optimized collection structure for faster reads

### Build & Deployment Optimization
- Next.js standalone output for better deployment
- Optimized webpack configuration for smaller bundles
- Proper code splitting and lazy loading
- Netlify deployment with build optimizations

## Development Status & Roadmap

### ✅ Completed Features
- Core functionality with authentication and store management
- Advanced product and slide management systems
- Comprehensive analytics dashboard with insights
- Image optimization with automatic compression
- Toast notification system for user feedback
- Product scraping for auto-filling details
- Advanced store customization with typography and colors
- Admin panel with complete user and system management
- Sponsored products system for monetization
- Global broadcast system for announcements
- Email subscription system with management
- Bulk import functionality for premium users
- Custom HTML editor with sanitization
- **Strict product limits enforcement** (30 for standard, unlimited for premium)
- **Premium feature gating** for widgets, banners, and category controls
- **Enhanced notification system** with persistent modal viewing and read tracking
- **Real-time notification center** with unread count badges and Markdown support
- **Advanced trial management** with immediate end and conditional reset capabilities

### 🔄 Current Focus
- Performance optimizations and bug fixes
- Enhanced user experience improvements
- Additional customization options
- Mobile responsiveness improvements

### 📋 Future Enhancements
- **Custom Domain Support**: Allow premium users to connect their own domains (implementation plan exists)
- Advanced SEO features and optimization
- Payment processing integration (Stripe)
- A/B testing capabilities for store optimization
- Advanced analytics with conversion tracking
- Multi-language support for global reach
- API integrations with popular affiliate networks
- Mobile app development

## Deployment & Configuration

### Environment Setup
- Node.js 20+ required for optimal performance
- Firebase project with Firestore and Storage enabled
- Netlify deployment with automatic builds
- Environment variables for Firebase configuration

### Build Configuration
- Next.js standalone output for efficient deployment
- Optimized webpack configuration for performance
- Proper TypeScript configuration with strict mode
- Tailwind CSS with custom design system

### Security Configuration
- Firestore security rules for data protection
- Firebase Storage rules for file access control
- Authentication requirements for protected routes
- Input validation and sanitization throughout

## Standard User Experience Analysis

### Current Restrictions Impact:
1. **Product Limit (30)**: Reasonable for beginners but may limit growth
2. **No Floating Widget**: Reduces engagement optimization capabilities
3. **No Pop-up Banner**: Limits promotional announcement options
4. **No Category Toggle**: Reduces layout control flexibility
5. **No Bulk Import**: Requires manual product entry (time-consuming for larger catalogs)
6. **No Data Export**: Prevents external analysis and marketing automation

### Recommendations for Balance:
- **Consider enabling floating widgets** for standard users as they significantly improve conversion rates
- **Maintain product limits** as they encourage upgrades while still allowing meaningful stores
- **Keep bulk import premium** as it's clearly a power-user feature
- **Consider making category toggle available** to all users for better UX control

---

**Project Statistics:**
- **Total Files**: 60+ TypeScript/JavaScript files
- **Lines of Code**: 12,000+ lines
- **Components**: 35+ reusable React components
- **Database Collections**: 9 main collections with nested subcollections
- **Features**: 25+ major feature sets implemented
- **User Roles**: 2 role types (User, Admin) with premium tiers
- **Admin Features**: Complete system management capabilities
- **Premium Restrictions**: 6 major feature restrictions for standard users
- **Trial Management**: Advanced administrative controls for user trial periods
- **Notification System**: Real-time broadcast messaging with read tracking

*Last Updated: January 2025*