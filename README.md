# SURWASH Blog Website

A feature-driven Next.js blog platform with a built-in design system and documentation engine for the SURWASH program.

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

## SURWASH Content Engine Setup

This project uses **Sanity CMS** for managing blog posts across multiple Nigerian states.
To operate the ISR (Incremental Static Regeneration) features, you must supply the following environment variables:

```bash
SANITY_PROJECT_ID=           # Sanity project identifier
SANITY_DATASET=production    # 'production' or 'staging'
SANITY_API_TOKEN=            # Read/write token scoped to dataset
SANITY_REVALIDATION_SECRET=  # Shared secret for webhook authentication
NEXT_PUBLIC_SITE_URL=        # Base URL for OG image generation
```

### Webhook Configuration
The Sanity webhook must be configured to point to the edge API route:
`https://<domain>/api/revalidate?secret=<SANITY_REVALIDATION_SECRET>`

## Folder Structure

The project follows a modular, feature-based architecture:

```
├── app/                  # Next.js App Router (Entry points & Routing)
│   ├── api/revalidate/   # Sanity webhook Edge API cache revalidation
│   ├── blog/             # Primary blog listing and dynamic routes
│   ├── design-system/    # Design System Showcase page
│   └── docs/             # Documentation site page
├── features/             # Business logic & components grouped by feature
│   ├── blog/             # Domain presentation (BlogCard, StateFilter) & Data logic
│   ├── design-system/    # Logic for the design system showcase
│   └── docs/             # Logic for the documentation engine
├── shared/               # Shared utilities, styles, and types
│   ├── styles/           # SURWASH CSS design tokens (colors, typography)
│   └── utils/            # Shared helper functions (CSS parsers, etc.)
└── public/               # Static assets & SURWASH brand logos
```

## Documentation & Design System

The project includes built-in tools for maintaining a living style guide and documentation:

- **Documentation Engine**: View and edit project documentation at [/docs](http://localhost:3000/docs)
- **Design System Showcase**: Explore the interactive design system at [/design-system](http://localhost:3000/design-system)

The design system uses SURWASH tokens:
- Primary Blue (`#1B9FD4`), Dark Navy (`#1A3A5C`), Accent Orange (`#E8762B`), Accent Green (`#2E8B4A`)
- Fira Sans (Primary/Body) & Unbounded (Accent/Data)
