# Project Overview

## Synedria

**Synedria** (dal greco synedria, "sedersi insieme") is a platform for forming small, intentional study groups built on shared interests and goals, with an explicit preference for in-person meetings.

- **Type**: Community platform (free for users, always)
- **Platform**: Web (Next.js + Supabase)
- **Status**: Pre-development (vision defined, technical phase starting)
- **Launch area**: Milan and Lombardy
- **Target**: Young adults (18-30) in tech, expanding later

## Development Methodology

- **Functional minimalism**: Minimum complexity for current requirements
- **Incrementality**: One component at a time, test before proceeding
- **Effective simplicity**: Simplest solution that works
- **Vision-driven**: Every feature must reduce friction toward physical meetings or make existing groups healthier

## Architecture

- **Full-stack**: Next.js (frontend + API routes)
- **Backend-as-a-Service**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Deployment**: Vercel (automatic from GitHub)
- **SSR/SEO**: Server-side rendering for public group pages

## Technology Stack

- **Next.js** - React framework with SSR and API routes
- **Supabase** - PostgreSQL database, authentication (GitHub/Google/Apple OAuth), RLS
- **Vercel** - Hosting, HTTPS, automatic deployments
- **Leaflet + OpenStreetMap** - Static neighborhood maps (no API keys)
- **TypeScript** - Type safety across the full stack

## Key Design Decisions

- No internal chat (forces physical meetings)
- No aggressive gamification
- Reputation by visibility, not by explicit ratings
- Group pages public and indexable; user profiles private
- Communication happens outside the platform (WhatsApp, Signal, etc.)
