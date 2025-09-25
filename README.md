# Affiliate Store Builder

This is a [Next.js](https://nextjs.org/) project for building affiliate stores. Users can create and customize their own affiliate stores to showcase products and earn commissions through affiliate links.

## Features

### 👥 User Roles & Permissions
The platform supports three distinct user roles with different access levels:
- **Standard Users**: Full access to store creation, product management, and analytics
- **Premium Users**: Additional access to bulk import and data export features  
- **Administrators**: Complete platform control including user management and system features

For detailed information about user roles and their specific permissions, see [User Roles Documentation](user-roles.md).

### 🏪 Store Management
- **Store Customization**: Personalize your store with custom branding, colors, layouts, and typography
- **Advanced Theming**: Custom font families, color schemes, background gradients, and responsive design
- **Social Integration**: Connect your social media accounts to drive traffic
- **SEO Friendly**: Optimized for search engines with meta tags, Open Graph, and Twitter cards
- **Header Layout Options**: Choose between left-right, right-left, or centered layouts

### 📦 Product Management
- **Product Management**: Add affiliate products with images, descriptions, and affiliate links
- **Product Scraping**: Auto-fill product details by scraping product URLs
- **Bulk Import**: Import hundreds of products at once using CSV files (Premium feature)
- **Category Management**: Automatic category generation from products with filtering
- **Click Tracking**: Monitor product performance with detailed click analytics

### 🎨 Promotional Features
- **Slider Management**: Create promotional slides to highlight featured products or offers
- **Floating Widget**: Engage visitors with customizable floating widgets
- **Pop-up Banner**: Promotional banners with custom images and descriptions
- **Custom HTML**: Add custom HTML content sections to your store

### 📊 Analytics & Insights
- **Analytics Dashboard**: Track store views, product clicks, slide clicks, social link engagement, search queries, and category filters (Premium feature)
- **Performance Metrics**: Detailed insights into user behavior and conversion tracking
- **Export Capabilities**: Export subscriber and analytics data to CSV files (Premium feature)

### 💬 Customer Engagement
- **Email Subscriptions**: Allow visitors to subscribe to your mailing list with popup forms
- **Subscriber Management**: Manage your email subscribers with export capabilities
- **Toast Notifications**: User-friendly feedback system for all interactions

### 🖼️ Advanced Image Optimization
- **Automatic Compression**: All uploaded images compressed to 75% quality
- **Format Conversion**: Automatic conversion to WebP format for better performance
- **Smart Resizing**: Intelligent resizing based on image type (avatars, products, banners)
- **Storage Optimization**: Significant reduction in storage costs and faster loading times

### 🔐 User Management & Security
- **Authentication System**: Email/password authentication with strong password validation
- **User Roles**: Admin and user roles with different permission levels
- **Premium Features**: Tiered access to advanced features
- **Row Level Security**: Comprehensive security with Firestore rules

### 🎯 Admin Features
- **User Management**: Search users, manage roles, and grant premium access
- **Global Broadcast**: System-wide announcement banners for all users
- **Sponsored Products**: Passive income through sponsored product placement in user stores
- **System Analytics**: Track global platform usage and performance

## How It Works

1. **Sign Up**: Create your account with a custom store URL
2. **Customize Store**: Set up your store branding, colors, and layout preferences
3. **Add Products**: Add affiliate products manually or use the bulk import feature
4. **Create Content**: Design promotional slides and add custom HTML sections
5. **Configure Features**: Enable widgets, banners, and subscription forms
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

### 🔐 Authentication & User Management
- Strong password validation (8+ chars, mixed case, numbers, special chars)
- Automatic store creation on signup with custom URLs
- Admin panel for user management and role assignment
- Premium user features with access control

### 🏪 Advanced Store Customization
- **Typography**: Custom font families for headings and body text
- **Colors**: Comprehensive color system with gradients and themes
- **Layout**: Multiple header layouts and responsive design
- **Branding**: Avatar, background images, and social media integration

### 📦 Product & Content Management
- **Products**: Full CRUD operations with image optimization
- **Categories**: Auto-generated from products with filtering
- **Slides**: Promotional carousel with click tracking
- **Custom HTML**: Sanitized HTML content sections

### 📊 Analytics & Performance
- **Event Tracking**: Store views, clicks, searches, and interactions
- **Performance Metrics**: Top products, categories, and search terms
- **Data Export**: CSV export for subscribers and analytics (Premium)
- **Real-time Insights**: Live dashboard with actionable data

### 🎯 Monetization Features
- **Affiliate Links**: Direct product linking with click tracking
- **Sponsored Products**: Admin-managed products for passive income
- **Premium Subscriptions**: Tiered feature access
- **Email Marketing**: Subscriber collection and management

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

- **Advanced Analytics**: Detailed user behavior tracking and insights
- **Bulk Import**: CSV import for hundreds of products at once
- **Data Export**: Export subscribers and analytics to CSV
- **Priority Support**: Enhanced support for premium users

## Admin Features

- **User Management**: Search, manage roles, and premium access
- **Global Broadcast**: System-wide announcements and banners
- **Sponsored Products**: Manage products that appear in user stores
- **System Analytics**: Platform-wide usage and performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQ

---

**Built with ❤️ using Next.js, Firebase, and modern web technologies**