# Invoice Manager

A modern, full-featured invoice management system built with Next.js 15, featuring authentication, PDF generation, email notifications, and comprehensive business management tools.

## 🚀 Features

### Core Functionality

- **Invoice Management**: Create, edit, and manage invoices with customizable templates
- **Client Management**: Organize and track client information and relationships
- **Payment Tracking**: Monitor invoice payments and payment terms
- **PDF Generation**: Generate professional PDF invoices with company branding
- **Email Integration**: Send invoices and payment reminders via email
- **Dashboard Analytics**: Overview of business metrics and invoice status

### Business Features

- **Company Settings**: Manage company details, branding, and preferences
- **Multi-Currency Support**: Handle invoices in different currencies (USD, EUR, GBP, CAD, AUD, NZD, CHF)
- **Tax Management**: Configure tax rates and calculations
- **Payment Terms**: Set flexible payment terms (NET1, NET7, NET14, NET30)
- **Invoice Numbering**: Automatic invoice numbering with customizable prefixes

### User Experience

- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive validation using Zod schemas
- **Toast Notifications**: Real-time feedback for user actions
- **File Upload**: Company logo and document management

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant form management
- **Zod** - Schema validation
- **Jotai** - Atomic state management

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **NextAuth.js** - Authentication framework
- **Server Actions** - Form handling and mutations

### Additional Libraries

- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion
- **Nodemailer** - Email sending
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Date-fns** - Date manipulation

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Email service (for email functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd invoice-manager
```

### 2. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/invoice_manager"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (Optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

### 4. Database Setup

```bash
# Generate Prisma client
bun prisma generate

# Run database migrations
bun prisma migrate dev

# (Optional) Seed the database
bun prisma db seed
```

### 5. Start Development Server

```bash
# Using Bun
bun dev

# Or using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   ├── (dashboard)/             # Protected dashboard routes
│   ├── api/                     # API routes
│   ├── components/              # Reusable components
│   └── providers/               # Context providers
├── components/                  # Shared components
│   └── ui/                      # Radix UI components
├── lib/                         # Utility functions and configurations
├── hooks/                       # Custom React hooks
└── prisma/                      # Database schema and migrations
```

## 🔧 Available Scripts

```bash
# Development
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint

# Database
bun prisma generate    # Generate Prisma client
bun prisma migrate dev # Run migrations
bun prisma studio      # Open Prisma Studio
bun prisma db seed     # Seed database
```

## 🎨 Customization

### Themes

The application supports light and dark themes. Theme preferences are stored in localStorage and sync with system preferences.

### Company Branding

- Upload company logo via the settings page
- Customize invoice templates
- Set company colors and styling

### Invoice Templates

- Professional invoice layouts
- Customizable fields and sections
- PDF generation with company branding

## 📧 Email Features

The application includes email functionality for:

- Sending invoices to clients
- Payment reminders
- Custom email templates
- Professional email layouts

Configure email settings in your environment variables to enable email features.

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and user management
- **Clients**: Customer information and relationships
- **Invoices**: Invoice data and status tracking
- **Payments**: Payment records and tracking
- **Settings**: Company preferences and configuration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent database toolkit
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for hosting and deployment platform

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

Built with ❤️ using Next.js, Prisma, and modern web technologies.
