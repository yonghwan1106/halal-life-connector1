# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Halal Life Connector is a comprehensive web platform for Muslims living in Korea. It provides location-based halal facility searches, AI-powered halal product scanning, and community features. Built as a competition prototype using Next.js 14, SQLite, and Claude AI API.

## Development Commands

### Database Operations
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Seed database with sample data (Seoul halal facilities)
npm run db:seed

# Open Prisma Studio for database management
npx prisma studio
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture Overview

### File Structure
- Root directory - Main Next.js application
  - `src/app/` - App Router pages and API routes
  - `src/components/` - React components (HalalMap, HalalScanner, CommunityBoard)
  - `src/lib/` - Utilities (Prisma client)
  - `src/types/` - TypeScript type definitions
  - `prisma/` - Database schema and seed data

### Core Components
1. **HalalMap** (`src/components/HalalMap.tsx`) - Location-based facility search with Kakao Maps integration
2. **HalalScanner** (`src/components/HalalScanner.tsx`) - AI-powered product analysis using Claude API
3. **CommunityBoard** (`src/components/CommunityBoard.tsx`) - Multi-language community features

### API Routes
- `/api/halal-places` - CRUD operations for halal facilities
- `/api/posts` - Community post management
- `/api/posts/[id]/comments` - Comment system
- `/api/scan` - Claude AI product analysis endpoint

### Database Schema (SQLite with Prisma)
- **HalalPlace** - Facility information with GPS coordinates, categories (restaurant/market/prayer_room), and halal certification levels
- **Post** - Community posts with multi-language support (ko/en/ar)
- **Comment** - Threaded comment system
- **ScanHistory** - AI analysis results with confidence scores

## Key Dependencies
- **@anthropic-ai/sdk** - Claude AI integration for product scanning
- **@prisma/client** - Database ORM for SQLite
- **next-intl** - Internationalization (Korean/English/Arabic)
- **lucide-react** - Icon system with Islamic-friendly icons

## Environment Variables
Required in `.env`:
```
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY="your_claude_api_key"
NEXT_PUBLIC_KAKAO_MAP_API_KEY="your_kakao_map_key"
```

## Design System
- **Color Palette**: Islamic green (#059669) primary, gold accent (#F59E0B)
- **Icons**: Mosque (🕌), Utensils (🍽), ShoppingBag (🛒), Camera (📷)
- **Responsive**: Mobile-first design with touch-friendly UI

## Development Workflow
1. Always run `npx prisma generate` after modifying `prisma/schema.prisma`
2. Use `npm run db:seed` to populate with Seoul halal facility data
3. Test AI scanner with Korean products (e.g., 불닭볶음면, 신라면)
4. Verify multi-language support across all features

## Performance Considerations
- Kakao Maps integration for Korean location accuracy
- Claude API calls are rate-limited - implement proper error handling
- SQLite database is suitable for prototype; consider PostgreSQL for production
- Next.js App Router with static generation for optimal performance

## Security Notes
- User location data processed client-side only
- Uploaded images for scanning are not permanently stored
- Minimal personal data collection (optional email only)