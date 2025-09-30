# User Roles and Permissions

This document outlines the different user roles within the Affiliate Store Builder application and the features accessible to each role.

## 1. Standard User (User Role)

Standard users are the primary users of the platform, responsible for creating and managing their own affiliate stores. They have access to core functionality needed to build and operate a successful affiliate store.

### Core Features Available:

#### 🔐 Authentication & Account Management
- Sign up, sign in, and log out of their account
- Automatic creation of a personalized store with a unique URL upon registration
- Strong password validation and security

#### 🏪 Store Management & Customization
- **Store Branding**: Personalize store name, description, avatar, and background images
- **Social Integration**: Configure social media links across multiple platforms
- **Layout Options**: Choose header layouts (left-right, right-left, centered)
- **Basic Feature Controls**: Enable/disable promotional slides and control product price display
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
- Manage product categories (auto-generated, but category display toggle is premium-only)
- Track product performance with click analytics

#### 🎨 Promotional Content
- Create, edit, and delete promotional slides with images, descriptions, and affiliate links
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
  - Top performing products by click count
  - Most filtered categories
  - Most searched terms
- **System Notifications**: Receive broadcast notifications from administrators in dashboard
- **Notification Center**: Access notification bell with unread count and persistent modal viewing

#### 🖼️ Image Optimization
- Automatic compression of all uploaded images to 75% quality
- Automatic conversion to WebP format for better performance
- Smart resizing based on image type (avatars: 200px, products/slides: 1200px)
- Significant reduction in storage costs and faster loading times

### ⚠️ Standard User Restrictions:

#### 📦 Product Limitations
- **30 Product Limit**: Cannot add more than 30 products to their store
- **No Bulk Import**: Cannot use CSV import functionality for adding multiple products

#### 🎨 Promotional Tool Restrictions
- **No Floating Widget**: Cannot enable or configure floating widgets on their store
- **No Pop-up Banner**: Cannot create promotional pop-up banners for visitors
- **Category Display Control**: Cannot toggle the visibility of the category section (categories are generated but always shown)

#### 📊 Data & Analytics Restrictions
- **No Data Export**: Cannot export subscriber lists or analytics data to CSV files
- **Basic Analytics Only**: Access to analytics dashboard but no export capabilities

## 2. Premium User (Premium Status)

Premium users have access to all Standard User features, plus advanced capabilities for deeper insights and operational efficiency.

### Additional Features (beyond Standard User):

#### 🏪 Enhanced Store Management
- **Floating Widget**: Enable and customize floating widgets with images and links
- **Pop-up Banner**: Create promotional banners with custom images, descriptions, and links
- **Category Display Control**: Toggle the visibility of the category filtering section

#### 📦 Advanced Product Management
- **Unlimited Products**: No restrictions on the number of products in their store
- **Bulk Operations**: Import hundreds of products at once using CSV files with validation
- **Batch Processing**: Efficient handling of large product catalogs

#### 📊 Advanced Analytics & Data Export
- **Data Export**: Export subscriber lists and analytics data to CSV files
- **Enhanced Insights**: Access to detailed performance metrics and conversion tracking
- **System Notifications**: Same notification access as standard users with enhanced support priority

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

#### 📢 Broadcast Notification System
- **Dashboard Notifications**: Create, edit, and delete system-wide dashboard notifications
- **Rich Content**: Markdown formatting support for notification descriptions
- **User Targeting**: Send notifications to all users with individual read status tracking
- **Notification Analytics**: Monitor notification engagement and read rates
- **Content Management**: Full CRUD operations for broadcast notifications
- **Real-time Updates**: Notifications appear instantly in user dashboard headers

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
| Promotional Content (Slides) | ✅ | ✅ | ✅ |
| **Floating Widget** | **❌** | **✅** | **✅** |
| **Pop-up Banner** | **❌** | **✅** | **✅** |
| **Category Display Toggle** | **❌** | **✅** | **✅** |
| Basic Analytics | ✅ | ✅ | ✅ |
| Email Subscribers | ✅ | ✅ | ✅ |
| Image Optimization | ✅ | ✅ | ✅ |
| Custom HTML Editor | ✅ | ✅ | ✅ |
| Product URL Scraping | ✅ | ✅ | ✅ |
| System Notifications | ✅ | ✅ | ✅ |
| Notification Center | ✅ | ✅ | ✅ |
| **CSV Product Import** | **❌** | **✅** | **✅** |
| **Data Export (CSV)** | **❌** | **✅** | **✅** |
| Priority Support | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Global Broadcasts | ❌ | ❌ | ✅ |
| Broadcast Notifications | ❌ | ❌ | ✅ |
| Sponsored Products | ❌ | ❌ | ✅ |
| System Analytics | ❌ | ❌ | ✅ |

## Standard User Experience Assessment

### What Standard Users CAN Do:
- **Complete Store Setup**: Full branding, social links, and customization
- **Product Management**: Add up to 30 products with scraping and optimization
- **Content Creation**: Promotional slides and custom HTML sections
- **Customer Engagement**: Email subscriptions and subscriber management
- **Performance Tracking**: Comprehensive analytics dashboard
- **Professional Appearance**: Advanced typography and color customization
- **System Communication**: Receive and view broadcast notifications from administrators
- **Notification Management**: Access notification center with unread badges and persistent viewing

### What Standard Users CANNOT Do:
- **Advanced Promotional Tools**: No floating widgets or pop-up banners
- **Bulk Operations**: No CSV import for multiple products
- **Data Export**: Cannot export data for external analysis
- **Category Control**: Cannot toggle category section visibility
- **Unlimited Growth**: 30-product limit may restrict larger catalogs

### Is This "Too Harsh"?
The current restrictions are **strategically balanced** for a freemium model:

**✅ Reasonable Aspects:**
- 30 products is sufficient for most new affiliate marketers
- Core functionality remains fully accessible
- Professional customization options available
- Complete analytics and subscriber management included

**⚠️ Potential Concerns:**
- Floating widgets and pop-up banners are powerful conversion tools
- Category display toggle affects user experience control
- 30-product limit may be reached quickly by active users

**💡 Recommendation:**
Consider making floating widgets available to standard users as they significantly improve engagement and conversion rates, which benefits both users and the platform.

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

### Notification System Architecture
- `NotificationModal` component provides persistent modal viewing (doesn't auto-close)
- `NotificationForm` component handles admin notification creation and editing
- `DashboardHeader` component displays notification bell with real-time unread counts
- Markdown formatting support for rich notification content
- Per-user read status tracking with Firestore subcollections

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
- Broadcast notification system for dashboard messaging
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