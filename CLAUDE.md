# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZuzaluCityOS is a Next.js 15-based decentralized application for managing events, spaces, and communities. It combines Web3 technologies (Ceramic Network, wallet connectivity) with traditional web services (Supabase, AWS S3).

## Essential Commands

```bash
# Development
pnpm dev                    # Start development server with Turbo
pnpm build                  # Production build
pnpm build:analyze          # Build with bundle analysis
pnpm lint                   # Run ESLint
pnpm prettier               # Format code
pnpm codegen                # Generate GraphQL types
pnpm codegen:watch          # Watch and regenerate GraphQL types

# Testing
# No test commands found - verify with user if tests exist
```

## Architecture Overview

### Storage Strategy

The app uses a **hybrid storage model**:

- **Ceramic Network**: Decentralized data for events, spaces, profiles
- **Supabase**: Authentication, centralized data, real-time features
- **IPFS**: Media storage via Pinata and public gateways
- **AWS S3**: File uploads and backups

Data access is abstracted through a repository pattern in `/repositories`.

### Provider Architecture

The app uses nested React Context providers (~12 total) initialized in `app/providers.tsx`:

- `CeramicProvider`: Ceramic Network connection
- `SupabaseProvider`: Supabase client and auth
- `WalletProvider`: Web3 wallet connectivity
- `ZupassProvider`: Zupass authentication
- Others for dialogs, sidebars, navigation

### Key Directories

- `app/`: Next.js pages and API routes (App Router)
- `components/base/`: Reusable UI primitives
- `components/biz/`: Business logic components
- `repositories/`: Data access layer (Ceramic/Supabase abstraction)
- `services/`: Business logic and external service integrations
- `context/`: React Context definitions
- `composites/`: Ceramic/ComposeDB schemas

### API Structure

API routes follow RESTful patterns:

```
app/api/
├── admin/          # Admin operations
├── auth/           # Authentication endpoints
├── event/          # Event CRUD operations
├── space/          # Space management
└── user/           # User operations
```

### Component Patterns

1. **Feature-based organization**: Components live near their pages (e.g., `app/events/components/`)
2. **Base components**: Generic UI in `components/base/`
3. **Business components**: Domain-specific in `components/biz/`
4. **Client components**: Most components use `'use client'` directive

### Key Technologies

- **Frontend**: Next.js 15, React 18, TypeScript (strict mode)
- **Styling**: Tailwind CSS, MUI, HeroUI, Emotion
- **State**: React Query (TanStack Query), Context API
- **Web3**: Wagmi, RainbowKit, Ethers.js, Viem
- **Editor**: EditorJS, TipTap
- **Forms**: React Hook Form with Yup/Zod validation

### Development Notes

1. **Package Manager**: Use `pnpm` exclusively
2. **Code Style**: Prettier with import sorting, ESLint with Next.js config
3. **Git Hooks**: Pre-commit hooks via Husky run linting
4. **TypeScript**: Strict mode enabled - avoid `any` types
5. **Environment**: Multiple `.env` files for different services (Ceramic, Supabase, S3)

### Common Patterns

- Dynamic imports for performance: `const Component = dynamic(() => import(...))`
- Error boundaries around major features
- Responsive design with mobile-first approach
- Repository pattern for data access abstraction
- Service layer for business logic

### Current State

- App is in Beta with ongoing Ceramic node upgrades
- Dark mode only (light theme commented out)
- Some API routes are being refactored (see git status)
- Using Supabase refactor branch currently
