# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MUJI SCENT is a fictional luxury perfume brand e-commerce site designed as a reusable template for future clients. The project features a Louis Vuitton-inspired design with emphasis on simplicity and minimalism.

This is a three-tier application consisting of:
- **cms/** - Strapi headless CMS for content management
- **dashboard/** - Next.js admin dashboard for order and product management
- **storefront/** - Next.js customer-facing e-commerce website

## Architecture

### CMS (Strapi)
- **Purpose**: Headless CMS for products and orders
- **Technology**: Strapi v5.18.0, SQLite database
- **Content Types**: Products with variants, Orders with payment/shipping info
- **Key Schema**: Products have variants (label, price, stock, images), Orders have customer info and items JSON

### Dashboard (Next.js Admin)
- **Purpose**: Admin interface for managing products and orders
- **Technology**: Next.js 15.3.5, TailwindCSS, React 19
- **Key Features**: Product CRUD, order management, image cropping, rich text editing
- **Auth**: Uses Strapi API token authentication

### Storefront (Next.js Customer)
- **Purpose**: Customer-facing e-commerce site
- **Technology**: Next.js 15.3.5, TailwindCSS, Zustand for state management
- **Key Features**: Product catalog, shopping cart, checkout flow, email notifications
- **Cart**: Persisted in localStorage using Zustand

## Development Commands

### CMS
```bash
cd cms
npm run develop    # Development server with auto-reload
npm run build      # Build admin panel
npm run start      # Production server
```

### Dashboard
```bash
cd dashboard
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint check
```

### Storefront
```bash
cd storefront
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint check
npm run email      # Email preview server
```

## Design Guidelines

### Visual Style
- **Inspiration**: Louis Vuitton aesthetic for product pages and cart
- **Approach**: Minimalist and clean design
- **Priority**: Mobile-first responsive design
- **Animations**: Use Framer Motion or anime.js for smooth interactions

### Code Standards
- **Language**: JavaScript only (no TypeScript)
- **Comments**: Write readable code with comments when useful
- **Reusability**: Create reusable components for template flexibility
- **Simplicity**: Avoid unnecessary features or dead code
- **Dependencies**: Only use existing libraries unless absolutely necessary

### UX Principles for Non-Technical Users
- **User-Friendly Interface**: Dashboard must be intuitive for non-technical business owners
- **Clear Explanations**: Always provide context and help text for technical concepts
- **Explicit Actions**: Use radio buttons and clear labels instead of confusing dropdowns
- **Visual Consistency**: All modals and interfaces should follow the same design pattern
- **Real-World Language**: Use terms business owners understand (avoid developer jargon)
- **Error Prevention**: Guide users through processes with clear steps and validation
- **Examples**: Provide concrete examples in placeholder text and help sections

### Development Safety Principles
- **NEVER BREAK EXISTING FUNCTIONALITY**: When implementing new features, ensure existing code continues to work
- **Test Before Committing**: Always verify that current features still function after changes
- **Incremental Changes**: Make small, focused changes rather than large refactors
- **Consistent Patterns**: Follow existing UI/UX patterns instead of creating new ones
- **Backward Compatibility**: Ensure new features don't break existing data or workflows

## Key Patterns and Conventions

### API Integration
- All three apps communicate via Strapi REST API
- Products are fetched with nested variant and image population
- Dashboard uses API token authentication, storefront uses public API
- API utilities in `src/lib/api.js` handle data formatting and error handling

### Product Data Structure
- Products have `variants` array with label, price, stock, and images
- Custom product IDs for business logic
- Images are stored in Strapi media library with multiple sizes generated
- Product descriptions use Strapi blocks format, converted to TipTap for editing
- Images must be easily modifiable through admin dashboard

### State Management
- Storefront uses Zustand for cart state with localStorage persistence (no Redux)
- Cart items include product ID, title, image, size, price, and quantity
- Separate UI state for cart panel and add-to-cart panel visibility

### Image Handling
- Dashboard includes image cropping functionality using react-easy-crop
- Supports HEIC to JPEG conversion
- Multiple image formats and sizes generated automatically by Strapi
- Admin can easily modify product images through dashboard interface

### Order Management
- Orders stored as Strapi entries with customer info and items JSON
- Order status workflow: new → processing → shipped → delivered
- Payment status tracking: pending → paid → failed
- Email notifications sent via Resend integration

## Environment Variables

### CMS
- Standard Strapi configuration

### Dashboard
- `NEXT_PUBLIC_STRAPI_URL` - Strapi API URL
- `STRAPI_API_TOKEN` - Authentication token for Strapi API

### Storefront
- `NEXT_PUBLIC_STRAPI_URL` - Strapi API URL
- `RESEND_API_KEY` - For order confirmation emails

## File Structure Notes

- Product variants schema: `cms/src/components/produit/variant.json`
- Cart store: `storefront/src/store/useCartStore.js`
- API utilities: `{app}/src/lib/api.js` in each app
- Email templates: `storefront/src/emails/`
- Static assets: `public/visuels/` for product images

## Template Goals

This project serves as a **reusable template** for future luxury e-commerce clients:
- Clean, minimal codebase that can be easily customized
- Admin dashboard for non-technical users to manage products and images
- Mobile-first responsive design suitable for various product categories
- Modular component structure for easy branding and styling changes

## Testing and Quality

Run `npm run lint` in dashboard and storefront directories to check code quality. No test suite is currently configured.

## Development Philosophy

- **Simplicity over complexity**: Choose straightforward solutions
- **Reusability**: Build components that can be easily adapted for different brands
- **Mobile-first**: Prioritize mobile and tablet user experience
- **Clean code**: Write maintainable, well-commented JavaScript
- **Visual excellence**: Follow Louis Vuitton-inspired design principles

## Current Development Status

- **Dashboard Progress**:
  - CRUD for products is now functional
  - Can add, edit, and delete products from the dashboard

- **Next Steps**:
  - Evaluate and prioritize upcoming features:
    - Authentication and client account management
    - Stripe payment implementation
    - Storefront improvements and feature additions