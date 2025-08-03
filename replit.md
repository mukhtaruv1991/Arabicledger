# Overview

This is an Arabic-language accounting system built with React, Express.js, and PostgreSQL. The system provides comprehensive financial management capabilities including chart of accounts, journal entries, financial reporting, and company management. It features a modern UI built with Radix UI components and Tailwind CSS, supporting right-to-left (RTL) Arabic text direction. The application includes Telegram bot integration for mobile accounting operations and uses Replit's authentication system for user management.

## Recent Changes (January 2025)

✓ **Database Setup**: Created PostgreSQL database and pushed complete schema with all accounting tables
✓ **Application Deployment**: Fixed all compilation errors and successfully deployed the application  
✓ **Telegram Bot Integration**: Implemented comprehensive Arabic Telegram bot with commands for:
  - Financial summaries (/الملخص)
  - Account listings (/الحسابات) 
  - Journal entries (/القيود)
  - Financial reports (/التقارير)
  - Help system (/المساعدة)
✓ **Bot Configuration UI**: Added complete Telegram settings page with webhook management
✓ **Navigation Enhancement**: Added Telegram settings to main navigation sidebar

## Deployment Status
- **Application**: Ready for deployment on Replit Deployments
- **Database**: PostgreSQL provisioned and operational
- **Bot Integration**: Configured with Arabic language support
- **Environment**: TELEGRAM_BOT_TOKEN configured

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom Arabic accounting theme and RTL support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: Arabic-first design with RTL layout support

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with middleware for authentication and logging
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple
- **Authentication**: Replit OAuth integration with OpenID Connect
- **File Structure**: Modular design with separate route handlers and storage abstraction

## Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema**: Comprehensive accounting schema including:
  - Users table for authentication
  - Companies table for multi-tenant support
  - Chart of accounts with hierarchical structure
  - Journal entries with double-entry bookkeeping
  - Account balances for performance optimization
  - Telegram settings for bot integration
- **Migrations**: Automated database migrations using Drizzle Kit

## Authentication & Authorization
- **Provider**: Replit's OAuth system with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Middleware**: Express middleware for route protection
- **User Management**: Role-based access control (admin, user, accountant)

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with schema validation
- **Drizzle Kit**: Database migration and schema management tool

### Authentication
- **Replit Auth**: OAuth integration using openid-client library
- **Session Management**: PostgreSQL session store with connect-pg-simple

### UI Framework
- **Radix UI**: Unstyled, accessible component primitives
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom Arabic theme
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server

### Telegram Integration
- **Telegram Bot API**: Webhook-based bot for mobile accounting operations
- **Custom Commands**: Arabic language support for accounting commands
- **Webhook Management**: Automated webhook setup and management

### State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definitions

The architecture follows a clean separation of concerns with shared TypeScript types between frontend and backend, ensuring type safety across the entire application. The system is designed for scalability with proper abstraction layers and modular components.