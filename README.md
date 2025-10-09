# Affiliate Store Builder

This is a [Next.js](https://nextjs.org/) project for building affiliate stores. Users can create and customize their own affiliate stores to showcase products and earn commissions through affiliate links.

## Features

### 👥 User Roles & Permissions
The platform supports three distinct user roles with different access levels:
- **Standard Users**: Core store functionality with product management (up to 30 products), basic customization, and analytics
- **Premium Users**: Advanced features including unlimited products, bulk import, enhanced promotional tools, and data export
- **Administrators**: Complete platform control including user management, sponsored products, and global broadcast system

For detailed information about user roles and their specific permissions, see [User Roles Documentation](role-users.md).

### 🏪 Store Management
- **Store Customization**: Personalize your store with custom branding, colors, layouts, and typography
- **Advanced Theming**: Custom font families, color schemes, background gradients, and responsive design
- **Social Integration**: Connect your social media accounts to drive traffic
- **SEO Friendly**: Optimized for search engines with meta tags, Open Graph, and Twitter cards
- **Header Layout Options**: Choose between left-right, right-left, or centered layouts
- **Custom HTML**: Add sanitized custom HTML content sections to your store

### 📦 Product Management
- **Product Management**: Add affiliate products with images, descriptions, and affiliate links
- **Product Scraping**: Auto-fill product details by scraping product URLs using external API
- **Bulk Import**: Import hundreds of products at once using CSV files (Premium feature)
- **Category Management**: Automatic category generation from products with filtering
- **Click Tracking**: Monitor product performance with detailed click analytics
- **Product Limits**: Standard users limited to 30 products, Premium users have unlimited products

### 🎨 Promotional Features
- **Slider Management**: Create promotional slides to highlight featured products or offers
- **Floating Widget**: Engage visitors with customizable floating widgets (Premium feature)
- **Pop-up Banner**: Promotional banners with custom images and descriptions (Premium feature)
- **Auto-advancing Slideshow**: Slides automatically advance with manual navigation options

### 📊 Analytics & Insights
- **Analytics Dashboard**: Track store views, product clicks, slide clicks, social link engagement, search queries, and category filters
- **Performance Metrics**: Detailed insights into user behavior and conversion tracking
- **Export Capabilities**: Export subscriber and analytics data to CSV files (Premium feature)
- **Real-time Tracking**: Persistent analytics storage in Firestore for reliable data

### 💬 Customer Engagement
- **Email Subscriptions**: Allow visitors to subscribe to your mailing list with popup forms
- **Subscriber Management**: Manage your email subscribers with export capabilities
- **Toast Notifications**: User-friendly feedback system for all interactions
- **Search Functionality**: Product search with real-time filtering and tracking
- **System Notifications**: Real-time broadcast notifications from administrators with read status tracking
- **Notification Center**: Dashboard notification bell with unread count badges and persistent modal viewing

### 🖼️ Advanced Image Optimization
- **Automatic Compression**: All uploaded images compressed to 75% quality
- **Format Conversion**: Automatic conversion to WebP format for better performance
- **Smart Resizing**: Intelligent resizing based on image type (avatars: 200px, products/slides: 1200px)
- **Storage Optimization**: Significant reduction in storage costs and faster loading times

### 🔐 User Management & Security
- **Authentication System**: Email/password authentication with strong password validation
- **User Roles**: Admin and user roles with different permission levels
- **Premium Features**: Tiered access to advanced features
- **Row Level Security**: Comprehensive security with Firestore rules
- **Notification System**: Secure broadcast messaging with per-user read status tracking

### 🎯 Admin Features
- **User Management**: Search users, manage roles, and grant premium access
- **Global Broadcast**: System-wide announcement banners for all users
- **Broadcast Notifications**: Dashboard notification system with Markdown support and read tracking
- **Sponsored Products**: Passive income through sponsored product placement in user stores
- **System Analytics**: Track global platform usage and performance

## How It Works

1. **Sign Up**: Create your account with a custom store URL
2. **Customize Store**: Set up your store branding, colors, and layout preferences
3. **Add Products**: Add affiliate products manually or use the bulk import feature (Premium)
4. **Create Content**: Design promotional slides and add custom HTML sections
5. **Configure Features**: Enable widgets, banners, and subscription forms (Premium features)
6. **Share Your Store**: Share your unique store URL to start earning commissions
7. **Monitor Performance**: Use analytics to track visitor behavior and optimize conversions

## Store Structure

Each store gets a unique URL: `yourdomain.com/your-store-slug`

When visitors interact with your store:
- Product clicks redirect to affiliate links where you earn commissions
- Analytics track all user interactions for performance insights
- Subscription forms collect email addresses for marketing
- Sponsored products provide additional passive income opportunities

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Image Processing**: `image-resize-compress` library with WebP conversion
- **Analytics**: Custom analytics system with Firestore persistence
- **UI Components**: Lucide React icons, custom component library
- **Deployment**: Netlify with optimized build configuration

## Key Features Implemented

### 🔐 Authentication & User Management System
- **Strong Authentication**: Email/password with comprehensive validation (8+ chars, mixed case, numbers, special chars)
- **Automatic Store Creation**: Each user gets a unique store with custom URL on signup
- **User Roles**: Admin and user roles with different permission levels
- **Premium Features**: Tiered access system with premium user benefits
- **Protected Routes**: Dashboard routes protected with authentication checks
- **Notification System**: Real-time broadcast notifications with read status tracking and persistent modal viewing

### 🏪 Advanced Store Customization
- **Typography**: Custom font families for headings and body text
- **Colors**: Comprehensive color system with gradients and themes
- **Layout**: Multiple header layouts and responsive design
- **Branding**: Avatar, background images, and social media integration
- **Custom Content**: Sanitized HTML editor for custom content sections

### 📦 Product & Content Management
- **Products**: Full CRUD operations with image optimization
- **Categories**: Auto-generated from products with filtering capabilities
- **Slides**: Promotional carousel with click tracking
- **Product Scraping**: Auto-fill product details from URLs
- **Bulk Import**: CSV import for premium users with validation

### 📊 Analytics & Performance
- **Event Tracking**: Store views, clicks, searches, and interactions
- **Performance Metrics**: Top products, categories, and search terms
- **Data Export**: CSV export for subscribers and analytics (Premium)
- **Real-time Insights**: Live dashboard with actionable data
- **Persistent Storage**: All analytics events stored in Firestore

### 🎯 Monetization Features
- **Affiliate Links**: Direct product linking with click tracking
- **Sponsored Products**: Admin-managed products for passive income
- **Premium Subscriptions**: Tiered feature access
- **Email Marketing**: Subscriber collection and management

### 🎯 Admin & System Management
- **User Management Panel**: 
  - Search users by email address
  - View all registered users with store information
  - Toggle user roles between User and Admin
  - Grant or revoke Premium access
  - Direct links to user stores
  - **Advanced Trial Management**: Immediately end or reset user trials with business logic enforcement
- **Global Broadcast System**: 
  - Create system-wide announcement banners
  - Upload custom images with descriptions and links
  - Control banner visibility and timing
  - Track banner click performance
- **Broadcast Notification System**:
  - Create dashboard notifications for all users
  - Markdown formatting support for rich content
  - Real-time unread count badges in dashboard header
  - Per-user read status tracking with persistent storage
  - Non-intrusive notification modal that stays open until manually closed
- **Sponsored Products Management**:
  - Admin-managed products that appear in user stores
  - Automatic placement in stores with 15+ products
  - Revenue sharing through sponsored product clicks
  - Performance tracking and analytics
- **Trial Management System**:
  - Immediately end user trials without waiting for natural expiration
  - Reset user trials for additional 7 days (only within original trial window)
  - Business logic prevents abuse and ensures fair trial periods
  - Visual status indicators and action feedback

## Getting Started

### Prerequisites
- Node.js 20 or higher
- Firebase project with Firestore and Storage enabled
- Netlify account for deployment

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd affiliate-store-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure Firebase:
   - Create a Firebase project
   - Enable Firestore and Storage
   - Add your Firebase configuration to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to see the application

### Deployment

The application is configured for Netlify deployment:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

## Database Schema

### Collections
- **users**: User profiles, roles, and premium status
- **stores**: Store configurations and customizations (nested under users)
- **products**: Affiliate products with images and links (nested under stores)
- **slides**: Promotional slides for store homepage (nested under stores)
- **subscribers**: Email subscribers (nested under stores)
- **analytics_events**: User interaction tracking (nested under stores)
- **sponsored_products**: Admin-managed sponsored products
- **global_banners**: System-wide announcement banners
- **notifications**: Broadcast notifications for all users
- **read_notifications**: Per-user notification read status tracking (nested under users)

### Security
- Firestore security rules with row-level access control
- Public read access for store data
- Owner-only write access for user data
- Admin-only access for system management features

## Performance Optimizations

- **Image Optimization**: Automatic compression and WebP conversion
- **Lazy Loading**: Images and components loaded on demand
- **Responsive Design**: Optimized for all device sizes
- **Efficient Queries**: Optimized Firestore queries with proper indexing
- **Client-side Caching**: Strategic caching for better performance

## Premium Features

- **Unlimited Products**: No product limits for premium users
- **Advanced Promotional Tools**: Floating widgets and pop-up banners
- **Bulk Operations**: CSV import for hundreds of products at once
- **Data Export**: Export subscribers and analytics to CSV
- **Enhanced Customization**: Additional display options and controls
- **Priority Support**: Enhanced support for premium users

## Admin Features

- **User Management**: Search, manage roles, and premium access
- **Global Broadcast**: System-wide announcements and banners
- **Broadcast Notifications**: Dashboard notification system with Markdown support and read tracking
- **Sponsored Products**: Manage products that appear in user stores
- **System Analytics**: Platform-wide usage and performance metrics
- **Trial Management**: Advanced controls for user trial periods with immediate end and conditional reset

## Development Guidelines

### Code Organization
- **Modular Architecture**: Each component focuses on a single responsibility
- **File Structure**: Organized by feature with clear separation of concerns
- **TypeScript**: Strict typing throughout the application
- **Component Reusability**: Shared components for common functionality

### Error Handling Best Practices
- **Specific Error Messages**: All error messages provide clear, actionable feedback to users
- **Consistent Error Propagation**: Errors are properly caught and re-thrown with context
- **User-Friendly Feedback**: Technical errors are translated to user-friendly language
- **Mobile Optimization**: Error handling optimized for mobile device constraints

### Production Readiness Checklist
- **Client-Side Validation**: Comprehensive input validation with user feedback
- **Server-Side Security**: Firestore rules enforce data access and business logic
- **Image Processing**: Optimized for mobile devices with size and type validation
- **Error Recovery**: Graceful error handling with retry mechanisms
- **Performance Monitoring**: Analytics tracking for error rates and user experience

### Key Directories
```
app/                    # Next.js app router pages
├── auth/              # Authentication pages
├── dashboard/         # Protected dashboard pages
├── [storeSlug]/       # Public store pages
└── system-management/ # Admin-only pages

components/            # Reusable React components
├── AdminRoute.tsx     # Admin access control
├── PremiumFeatureGate.tsx # Premium feature gating
├── StoreTemplate.tsx  # Main store display
├── NotificationModal.tsx # Notification display modal
├── NotificationForm.tsx # Admin notification creation/editing
├── DashboardHeader.tsx # Header with notification bell
└── ...

lib/                   # Core business logic
├── auth.ts           # Authentication functions
├── store.ts          # Store and product management
├── analytics.ts      # Analytics tracking
└── firebase.ts       # Firebase configuration

hooks/                 # Custom React hooks
├── useAuth.ts        # Authentication hook
└── useToast.ts       # Toast notification hook

app/dashboard/system-management/ # Admin panel pages
├── users/page.tsx    # User management interface
├── global-broadcast/page.tsx # Global banner management
├── broadcast-notifications/page.tsx # Notification management
├── sponsor-products/ # Sponsored product management
```

### Security Implementation
- **Firestore Rules**: Comprehensive row-level security
- **Authentication**: Firebase Auth with strong password requirements
- **Input Validation**: Client and server-side validation
- **HTML Sanitization**: DOMPurify for custom HTML content
- **Role-based Access**: Component-level access control

### Performance Considerations
- **Image Optimization**: Automatic WebP conversion and compression
- **Lazy Loading**: Components and images loaded on demand
- **Efficient Queries**: Optimized Firestore operations
- **Bundle Optimization**: Code splitting and tree shaking

### Recent Major Updates & Enhancements

### Advanced Trial Management System (Latest Update)
- Implemented granular trial management controls for administrators
- Added ability to immediately end user trials without waiting for natural expiration
- Created trial reset functionality with business logic enforcement
- Added visual indicators and status displays for trial management
- Enhanced user management interface with trial action buttons
- Implemented safeguards to prevent trial resets after original 7-day window expires
- **Business Logic**: Admins can only reset trials within the original 7-day window from user creation
- **Security**: All trial management actions properly validated and logged

### Enhanced Notification System
- Implemented comprehensive broadcast notification system for admin-to-user communication
- Added real-time notification bell with unread count badges in dashboard header
- Created persistent notification modal that remains open until manually closed
- Integrated Markdown formatting support for rich notification content
- Built per-user read status tracking with Firestore persistence
- Added notification management interface for administrators
- Fixed auto-closing modal issue to improve user experience

### Complete Admin System Implementation
- Built comprehensive user management system with search and role controls
- Created global broadcast system for platform-wide announcements
- Implemented sponsored products system for passive income generation
- Added system analytics and performance monitoring capabilities

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code patterns and TypeScript conventions
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow the existing component structure
- Implement proper error handling
- Add appropriate loading states
- Include user feedback via toast notifications
- Maintain responsive design principles

### Testing Guidelines
- Test all user flows thoroughly
- Verify premium feature gating works correctly
- Ensure admin features are properly protected
- Test image upload and optimization
- Validate form submissions and error handling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQ

---

**Built with ❤️ using Next.js, Firebase, and modern web technologies**