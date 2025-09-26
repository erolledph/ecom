# User Roles and Permissions

This document outlines the different user roles within the Affiliate Store Builder application and the features accessible to each role.

## 1. Standard User (User Role)

Standard users are the primary users of the platform, responsible for creating and managing their own affiliate stores.

### Core Features:

#### 🔐 Authentication & Account Management
- Sign up, sign in, and log out of their account
- Automatic creation of a personalized store with a unique URL upon registration
- Strong password validation and security

#### 🏪 Store Management & Customization
- **Store Branding**: Personalize store name, description, avatar, and background images
- **Social Integration**: Configure social media links across multiple platforms
- **Layout Options**: Choose header layouts (left-right, right-left, centered)
- **Feature Controls**: Enable/disable floating widgets, pop-up banners, and email subscription forms
- **Content Management**: Enable/disable promotional slides and control product price display
- **Custom HTML**: Add custom HTML content sections (sanitized for security)

#### 🎨 Advanced Theming & Design
- **Typography**: Custom font families for headings and body text
- **Color Schemes**: Customize store name, bio, borders, social icons, background gradients, price, and button colors
- **Currency Settings**: Set custom currency symbols
- **Responsive Design**: Mobile-first design optimized for all devices

#### 📦 Product Management
- Add, edit, and delete affiliate products with comprehensive forms
- **Product Limit**: A standard user can have a maximum of 30 products in their store
- Auto-fill product details by scraping product URLs using external API
- Upload or link product images with automatic optimization (WebP conversion, compression)
- Manage product categories (auto-generated with filtering capabilities)
- Track product performance with click analytics

#### 🎨 Promotional Content
- Create, edit, and delete promotional slides with images, descriptions, and affiliate links
- Configure floating widgets with custom images and links
- Set up pop-up banners with images, descriptions, and links
- Auto-advancing slideshow with manual navigation

#### 💬 Customer Engagement
- Collect email subscribers via customizable pop-up forms
- Manage their own store's subscribers (view, delete)
- Receive toast notifications for all interactions
- Search and filter products on their store

#### 📊 Analytics & Insights
- View comprehensive analytics for their store including:
  - Store views and visitor traffic
  - Product clicks with detailed performance metrics
  - Slide clicks and promotional content engagement
  - Social link clicks and platform engagement
  - Search queries and user intent analysis
  - Category filters and browsing behavior
  - Widget and banner click tracking
  - Top performing products by click count
  - Most filtered categories
  - Most searched terms

#### 🖼️ Image Optimization
- Automatic compression of all uploaded images to 75% quality
- Automatic conversion to WebP format for better performance
- Smart resizing based on image type (avatars: 200px, products/slides: 1200px)
- Significant reduction in storage costs and faster loading times

## 2. Premium User (Premium Status)

Premium users have access to all Standard User features, plus advanced capabilities for deeper insights and operational efficiency.

### Additional Features (beyond Standard User):

#### 📦 Product Management
- **Product Limit**: A premium user can have an unlimited number of products in their store
- **Bulk Operations**: Import hundreds of products at once using CSV files with validation
- **Batch Processing**: Efficient handling of large product catalogs

#### 🌐 Custom Domain Support
- **Professional Branding**: Connect custom domains (e.g., yourstore.com) to their affiliate store
- **Domain Verification**: Secure domain ownership verification through DNS TXT records
- **SSL Certificates**: Automatic SSL certificate provisioning for custom domains
- **DNS Management**: Easy-to-follow DNS setup instructions with copy-paste functionality
- **Domain Toggle**: Enable/disable custom domain functionality as needed

#### 📊 Advanced Analytics & Data Export
- **Data Export**: Export subscriber lists and analytics data to CSV files
- **Enhanced Insights**: Access to detailed performance metrics and conversion tracking

#### 🎯 Priority Support
- Enhanced support services and priority assistance
- Access to advanced features and beta testing opportunities

## 3. Administrator (Admin Role)

Administrators have full control over the platform, including managing users, system-wide announcements, and sponsored products. They inherently have access to all Premium features.

### Additional Features (beyond Premium User):

#### 👥 User Management
- **User Search**: Search for any user by email address
- **User Overview**: View all registered users and their store information
- **Role Management**: Toggle user roles between Standard User and Admin
- **Premium Control**: Grant or revoke Premium access for any user
- **Store Access**: Directly visit any user's store for monitoring and support
- **Bulk User Operations**: Manage multiple users efficiently

#### 📢 Global Broadcast System
- **System Announcements**: Create, edit, and delete system-wide announcement banners
- **Rich Content**: Upload custom images, descriptions, and links for global banners
- **Visibility Control**: Control banner visibility with active/inactive status
- **Performance Tracking**: Track global banner click performance and engagement
- **Banner Management**: Full CRUD operations for global banners

#### 💰 Sponsored Products Management
- **Revenue Generation**: Add, edit, and delete sponsored products for passive income
- **Smart Placement**: Manage products that automatically appear in user stores:
  - Stores with 15-24 products: 1 sponsored product (1st position)
  - Stores with 25+ products: 2 sponsored products (1st and 6th positions)
- **Performance Analytics**: Track sponsored product clicks and revenue metrics
- **Content Control**: Only displayed in "All Products" section, not in filters or search
- **Full CRUD Operations**: Complete management of sponsored product lifecycle

#### 🔧 System Analytics & Management
- Track global platform usage and performance metrics
- Monitor system health and user engagement
- Access to comprehensive platform-wide analytics
- System configuration and maintenance capabilities
- Global banner click analytics
- Sponsored product performance tracking

## Feature Access Matrix

| Feature | Standard User | Premium User | Administrator |
|---------|---------------|--------------|---------------|
| Store Creation & Management | ✅ | ✅ | ✅ |
| Product Management | ✅ | ✅ | ✅ |
| **Product Limit** | **30 products** | **Unlimited** | **Unlimited** |
| Promotional Content | ✅ | ✅ | ✅ |
| Basic Analytics | ✅ | ✅ | ✅ |
| Email Subscribers | ✅ | ✅ | ✅ |
| Image Optimization | ✅ | ✅ | ✅ |
| Custom HTML Editor | ✅ | ✅ | ✅ |
| Product URL Scraping | ✅ | ✅ | ✅ |
| CSV Product Import | ❌ | ✅ | ✅ |
| Data Export (CSV) | ❌ | ✅ | ✅ |
| Custom Domain Support | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Global Broadcasts | ❌ | ❌ | ✅ |
| Sponsored Products | ❌ | ❌ | ✅ |
| System Analytics | ❌ | ❌ | ✅ |

## Security & Access Control

### Authentication Requirements
- All features require user authentication
- Protected routes redirect unauthenticated users to login
- Session management with Firebase Authentication

### Data Access Control
- **Row Level Security**: Users can only access their own data
- **Public Store Access**: Store pages are publicly viewable for affiliate marketing
- **Admin Privileges**: Admins have read access to user data for management purposes
- **Firestore Rules**: Comprehensive security rules enforce access controls
- **Product Limits**: Backend logic enforces product limits for each user role

### Premium Feature Enforcement
- Premium features are enforced at the component level
- `PremiumFeatureGate` component controls access to premium-only features
- Server-side validation ensures security of premium features

## Role Assignment

### Default Role Assignment
- New users are assigned the "Standard User" role by default
- Premium status is set to `false` by default
- Store creation is automatic upon successful registration

### Role Modification
- Only administrators can modify user roles and premium status
- Role changes are tracked and logged for audit purposes
- Changes take effect immediately upon update

## Implementation Notes

### Component-Level Access Control
- `AdminRoute` component protects admin-only pages
- `PremiumFeatureGate` component controls premium feature access
- `canAccessFeature` utility function checks user permissions

### Database Structure
- User roles stored in the `users` collection
- Premium status tracked as a boolean field
- Role-based queries ensure proper data access
- Product count validation enforced in backend functions

### Admin System Management
- Complete user management interface with search and filtering
- Global broadcast system for platform-wide communications
- Sponsored products system for revenue generation
- Comprehensive analytics tracking for admin insights

### Product Limit Enforcement
- Standard users: Maximum 30 products per store
- Premium users: Unlimited products
- Administrators: Unlimited products
- Backend validation prevents exceeding limits
- UI feedback shows current usage and limits

---

*This documentation is maintained by the development team and updated as new features and roles are introduced to the platform.*