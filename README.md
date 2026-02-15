# Restiqo - Premium Travel & Accommodation Booking Platform

A modern, premium travel and accommodation booking web application built with Next.js, featuring a beautiful Claymorphism UI design.

![Restiqo](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200)

## 🌟 Features

### Core Features
- **🏠 Apartments** - Browse and book premium apartments
- **🏨 Hotels** - Discover luxury hotels and resorts
- **🎯 Tours & Experiences** - Explore curated tours and adventures

### User Features
- **Authentication System** - Sign up, login, logout with Supabase Auth
- **User Roles** - Guest, Host, and Admin roles
- **Dashboard** - Manage bookings, wishlist, and profile settings
- **Wishlist** - Save favorite properties
- **Reviews & Ratings** - Leave and view property reviews

### Host Features
- **Property Management** - Add, edit, and manage listings
- **Booking Management** - Handle guest bookings
- **Earnings Overview** - Track revenue and performance

### Admin Features
- **User Management** - Manage all users
- **Property Approval** - Approve or reject listings
- **Review Moderation** - Moderate flagged reviews
- **Analytics Dashboard** - View platform statistics

## 🎨 Design

### Claymorphism UI
Restiqo features a modern Claymorphism design with:
- Soft rounded surfaces
- Subtle shadows
- Floating clay-like cards
- Smooth gradients
- Premium minimalistic feel

### Brand Colors
- **Primary**: `#62BBB1` (Teal)
- **Accent**: `#88C51C` (Green)
- **Secondary**: `#218877`
- **Background**: `#F4E2AD` / Soft light neutral

## 🛠 Technology Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **UI Design**: Claymorphism Style
- **Backend**: Supabase
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
restiqo/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin panel
│   │   ├── apartments/         # Apartments listing
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── hotels/             # Hotels listing
│   │   ├── host/               # Host dashboard
│   │   ├── property/           # Property details
│   │   ├── search/             # Search page
│   │   └── tours/              # Tours listing
│   ├── components/
│   │   ├── layout/             # Layout components (Navbar, Footer)
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   └── supabase/           # Supabase client configuration
│   └── types/
│       └── database.ts         # TypeScript types for database
├── supabase/
│   └── schema.sql              # Database schema and RLS policies
├── .env.local                  # Environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/restiqo.git
cd restiqo
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the contents of `supabase/schema.sql`
   - Enable Google OAuth in Authentication > Providers (optional)

4. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Restiqo
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

### Tables
- **users** - User profiles and roles
- **properties** - All property listings
- **property_images** - Property image gallery
- **tours** - Tour-specific details
- **bookings** - Booking records
- **reviews** - Property reviews
- **wishlists** - User wishlists
- **amenities** - Available amenities

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies for:
- Public read access for approved content
- User-specific access for personal data
- Role-based access for admin functions

## 🔐 Authentication

Restiqo uses Supabase Auth with:
- Email/Password authentication
- Google OAuth (optional)
- Protected routes via middleware
- Role-based access control

### User Roles
- **Guest** - Can browse, book, and review
- **Host** - Can list and manage properties
- **Admin** - Full platform management

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tablet-optimized layouts
- Desktop premium experience
- Smooth animations and transitions

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Restiqo
```

## 🎯 Target Audience

- **Primary**: Bangladesh market
- **Secondary**: Global travelers interested in Bangladesh

## 🔮 Future Enhancements

- [ ] Real-time chat between hosts and guests
- [ ] Payment integration (Stripe, bKash)
- [ ] Map integration with property locations
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS verification

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email hello@restiqo.com or join our Discord channel.

---

Built with ❤️ in Bangladesh
