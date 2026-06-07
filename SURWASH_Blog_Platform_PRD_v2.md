# SURWASH Blog Platform
## Technical Product Requirement Document
**Version 2.0 | June 2026**
Prepared by TM Labs
*For the Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Program*

---

## 1. Executive Summary & Core Objectives

The objective is to establish an automated, zero-maintenance web infrastructure allowing non-technical content managers and SEO operators across multiple Nigerian states to independently draft, optimise, and publish localised blog posts.

The architectural goal is sub-second global content updates without rebuilding the core application, relying entirely on cloud-managed free-tier infrastructure.

### Program Context

SURWASH is a 6-year program implemented by the Nigerian government and the World Bank to deliver an integrated package of Water supply, Sanitation and Hygiene (WASH) interventions in urban and rural areas. The blog platform extends the program's digital communication infrastructure, enabling:

- State-level content teams to publish WASH updates independently
- SEO-optimised public health messaging at national and regional scope
- Zero-cost operations on Vercel and Sanity free tiers
- Fully brand-compliant output aligned to the SURWASH Visual Identity Guideline v1.0

---

## 2. System Topology & Data Flow Lifecycle

The lifecycle relies on On-Demand Incremental Static Regeneration (ISR) to bridge the decoupled content and delivery layers:

**Step 1 — Content Modification**
A state editor logs into the cloud-hosted Sanity Studio interface, populates structured fields (title, state scope, body content, SEO meta), and triggers a publication cycle.

**Step 2 — Webhook Dispatch**
Sanity securely dispatches an HTTP POST payload containing document metadata and a cryptographic token to the Next.js edge API route at `/api/revalidate`.

**Step 3 — Edge Purge & Cache Revalidation**
The Vercel edge node processes the request, matches the cryptographic hash, purges the stale cache wrapper for the specific route path, and silently rebuilds the updated page against the live Sanity API.

**Step 4 — Global Delivery**
Global users fetch the pre-compiled, statically optimised HTML document on subsequent network calls — no full redeploy, no downtime.

---

## 3. Project Directory Architecture

To optimise context parsing for AI agents, the implementation maps cleanly into the existing modular directory layout without changing structural foundations:

| Directory / File Path | Architectural Layer | Functional Responsibility |
|---|---|---|
| `app/blog/page.tsx` | Routing Layer | Entry point for the primary blog listing interface. Imports presentation logic directly from the features domain. |
| `app/blog/[slug]/page.tsx` | Routing Layer | Dynamic route template capturing unique post paths. Enforces static path revalidation boundaries. |
| `app/api/revalidate/route.ts` | API Integration Layer | Secure endpoint handling webhook payload streams from Sanity CMS to clear Vercel's edge cache on-demand. |
| `features/blog/components/` | Domain Presentation | Isolated UI modules including `StateFilter.tsx`, `BlogCard.tsx`, and `RichTextRenderer.tsx`. Consumes shared design system variables. |
| `features/blog/lib/` | Data Integration Layer | Configures the Sanity Client initialisation parameters and houses optimised GROQ data fetching queries. |

---

## 4. Sanity Content Engine — Schema Definition

The following structured configuration array defines the document model parsed directly into Sanity's content schemas. Written in TypeScript for alignment with the project's vibe coding framework:

```typescript
export default {
  name: 'post',
  title: 'SURWASH Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Post Title',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    },
    {
      name: 'slug',
      title: 'Slug Route Path',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'stateScope',
      title: 'Target State Region',
      type: 'string',
      options: {
        list: [
          { title: 'Federal / National', value: 'federal' },
          { title: 'Abuja (FCT)',        value: 'abuja'   },
          { title: 'Lagos State',        value: 'lagos'   },
          { title: 'Kano State',         value: 'kano'    }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'mainImage',
      title: 'Cover Featured Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'content',
      title: 'Rich Body Content',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      description: 'Summarise post below 160 chars for high search ranking.',
      validation: Rule => Rule.max(160)
    }
  ]
}
```

### Field Rationale

- **`stateScope`** — Restricts each post to a single state region, enabling the `StateFilter.tsx` component to partition the public feed by geography.
- **`mainImage` with hotspot** — Allows editors to control focal point crop across responsive breakpoints, critical for the 4/5 immersive image layout defined in the brand guidelines.
- **`metaDescription` (max 160 chars)** — Hard validation enforces SEO best practice at the schema level; non-technical editors cannot publish without completing this field.

---

## 5. Edge Integration Engine — Next.js Revalidation Router

To instantiate instant visual updates without redeploying the code pipeline, the edge route handles targeted structural cache purges on receipt of a verified Sanity webhook:

```typescript
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenSecret = searchParams.get('secret');

    if (tokenSecret !== process.env.SANITY_REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Unauthorized Request Boundary' },
        { status: 401 }
      );
    }

    const payload     = await request.json();
    const dynamicSlug = payload?.slug;

    if (!dynamicSlug) {
      return NextResponse.json(
        { message: 'Invalid payload — route slug missing' },
        { status: 400 }
      );
    }

    // Force cache purge over specific path boundaries
    revalidatePath(`/blog/${dynamicSlug}`);
    revalidatePath('/blog');

    return NextResponse.json({
      revalidated: true,
      executionTimestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Implementation Notes

- Secret comparison uses strict equality against `process.env.SANITY_REVALIDATION_SECRET` — the environment variable is never exposed to the client bundle.
- Both the specific slug route and the parent `/blog` listing are purged simultaneously, ensuring index pages reflect new or updated posts immediately.
- `executionTimestamp` returned in the success response aids debugging and Sanity webhook delivery log correlation.

---

## 6. Visual Identity & Brand System Constraints

All blog platform UI output must conform to the **SURWASH Visual Identity Guideline v1.0** (prepared by TakeoutMedia-Gatefield-IdeasandPeople, August 2023 – February 2024). The following constraints are binding for frontend component development.

### 6.1 Typography

Two typefaces are approved for all SURWASH communications:

| Typeface | Role | Usage |
|---|---|---|
| **Fira Sans** | Primary / Body | All headings, body copy, UI labels, and navigation elements. |
| **Unbounded** | Accent / Data | Key statistics, impact numbers, and data callout blocks only. |

Both fonts are available via Google Fonts and must be loaded via `next/font` to avoid layout shift. No other typefaces are permitted.

### 6.2 Colour Palette

The brand palette reflects the program's commitment to cleanliness, vitality, and sustainability:

| Name | Hex | Meaning |
|---|---|---|
| Primary Blue | `#1B9FD4` | Sky Blue — water, clarity, trust |
| Dark Navy | `#1A3A5C` | Headings, authority, depth |
| Accent Orange | `#E8762B` | Energy, optimism, action |
| Accent Green | `#2E8B4A` | Growth, renewal, sustainability |
| Body Grey | `#5A6472` | Body text, neutral readability |

**Important constraints for blog UI implementation:**

- The SURWASH logo must **never** appear in green (`#2E8B4A`) or orange (`#E8762B`) — these colours are accent-only.
- The logo should appear on white backgrounds wherever possible. On photographic image backgrounds, use the all-white logo variant.
- Preferred logo lockup is the horizontal spread signature; use the stacked lockup only where horizontal space is constrained (e.g., mobile header ≤ 360px).

### 6.3 Communication Layout Grids

The SURWASH design language divides canvases into two unequal sections to maximise visual impact. These proportions must be respected in blog hero components, OG image generation, and social share card templates:

**Portrait layout (blog post cover / OG image)**
4/5 of the canvas is dedicated to immersive imagery. The remaining 1/5 (bottom strip) carries the SURWASH logo and the Nigerian coat of arms on a white or brand-blue background.

**Landscape layout (social share / banner)**
3/4 of the canvas is dedicated to compelling imagery or illustration. The remaining 1/4 (right column) carries branding elements, ensuring recognition at a glance.

> A left-edge vertical rule in SURWASH Blue (`#1B9FD4`) is used as the accent bar preceding primary display headlines in all layout variants. Implement this as a CSS `border-left` or an SVG stripe — not as a Unicode character.

### 6.4 Logo Usage Rules

- Never alter, deform, recreate, or stretch the logo in any form.
- Maintain a clear-space zone of half the logo icon height on all sides for the spread lockup.
- The logo must not appear on orange or green backgrounds.
- The logo icon alone (without logotype) may be used on very small surfaces such as favicons and app icons.

---

## 7. Security Framework & Multi-State Access Strategy

Operational control balances accessibility with system isolation across all participating state teams:

### Token Encapsulation

Environmental variable validation tokens are injected entirely within server boundaries (`process.env`) to hide runtime parameters from client bundle inspection. The revalidation secret is never referenced in any component, hook, or client-side utility.

### Identity Isolation

Utilising Sanity's 20-seat free-tier quota, individual authentication tokens are distributed to state-specific operators. This approach:

- Restricts editing permissions to the assigned state's content pool
- Enables exact author attribution in Sanity's activity logs
- Allows token revocation per operator without affecting other state teams

### Interface Guardrails

Input-level content validations applied inside the schema definitions (Section 4) enforce hard structural rules:

- Required fields (`title`, `slug`, `stateScope`, `metaDescription`) block publication if empty
- `metaDescription` hard-capped at 160 characters — non-technical editors cannot break SEO structure
- Slug auto-generated from title with `maxLength: 96`, preventing malformed URL paths

### Required Environment Variables

```bash
SANITY_PROJECT_ID           # Sanity project identifier
SANITY_DATASET              # 'production' or 'staging'
SANITY_API_TOKEN            # Read/write token scoped to dataset
SANITY_REVALIDATION_SECRET  # Shared secret for webhook authentication
NEXT_PUBLIC_SITE_URL        # Base URL for OG image generation
```

---

## 8. Deployment Checklist

Use this checklist before going live in any state environment:

- [ ] Sanity Studio deployed and accessible to state operators
- [ ] All 5 environment variables set in Vercel project settings
- [ ] Sanity webhook configured: `https://<domain>/api/revalidate?secret=<SANITY_REVALIDATION_SECRET>`
- [ ] Google Fonts (Fira Sans, Unbounded) loaded via `next/font` in `layout.tsx`
- [ ] Favicon and OG image use the correct logo variant per Section 6.4
- [ ] `StateFilter.tsx` tested against all `stateScope` values in schema
- [ ] `RichTextRenderer.tsx` applies Fira Sans body styles to Portable Text output
- [ ] `metaDescription` passed to `<meta name="description">` in `generateMetadata()`

---

*SURWASH Blog Platform — Technical PRD v2.0 | Prepared by TM Labs | June 2026*
*For the Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Program*
