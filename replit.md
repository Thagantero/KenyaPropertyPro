# Real Estate Management System

## Overview

This is a full-stack real estate property management system built with modern web technologies. The application serves as a platform for listing, browsing, and managing properties across Kenya's 47 counties, featuring both public-facing property listings and administrative management capabilities.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React-based SPA with TypeScript using Vite as the build tool
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Deployment**: Replit-hosted with auto-scaling capabilities

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas shared between client and server
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store

### Database Schema
The system manages four main entities:
- **Users**: Authentication and user management
- **Properties**: Core property listings with comprehensive metadata
- **Inquiries**: Customer inquiries linked to specific properties
- **Blog Posts**: Content management for real estate articles
- **Analytics**: Page view tracking and usage metrics

### Core Features
- Property listing and search with advanced filtering
- Property detail pages with image galleries
- Inquiry system for property interest
- Blog system for real estate content
- Admin dashboard for property and content management
- Analytics tracking for user engagement
- Responsive design for mobile and desktop

## Data Flow

1. **Property Discovery**: Users browse properties through filtered search interface
2. **Property Details**: Detailed property pages with inquiry forms
3. **Inquiry Management**: Property inquiries are captured and stored
4. **Admin Management**: Administrative interface for content and property management
5. **Analytics Collection**: User interactions are tracked for insights

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation shared across client/server
- **tailwindcss**: Utility-first CSS framework

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for component variants
- **wouter**: Lightweight React router

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` - Concurrent client and server development
- **Build Process**: Vite builds client assets, esbuild bundles server
- **Production**: `npm run start` - Serves built application
- **Database**: Drizzle migrations with `npm run db:push`
- **Environment**: Node.js 20 with PostgreSQL 16 module

The deployment uses auto-scaling capabilities with port 5000 mapped to external port 80.

## Changelog

- June 26, 2025: Initial setup with complete property management system
- June 26, 2025: Added floating WhatsApp and call buttons for better user engagement
- June 26, 2025: Enhanced with 12 diverse sample properties across Kenya counties
- June 26, 2025: Improved visual design with animations, gradients, and enhanced hover effects

## Recent Updates

✓ Floating contact buttons with WhatsApp (+254727390238) and call functionality moved to left side
✓ Search component made transparent with reduced height and backdrop blur
✓ Silai Properties logo integrated into header replacing text logo
✓ Complete color scheme update matching logo (teal #00CFC1 and gold #FFD700)
✓ Smart price ranges for Buy/Rent/Lease with realistic Kenya market prices
✓ Enhanced sample property data with 20+ diverse listings across multiple counties
✓ Hero section improved with better text visibility and gradient overlay
✓ CSS completely redesigned with Silai Properties brand colors and enhanced styling
✓ Property cards, buttons, and UI components now match logo branding

## User Preferences

Preferred communication style: Simple, everyday language.

## Admin Access Information

- Admin URL: `/admin`
- Username: `admin`
- Password: `admin123`