# Sanity Studio Setup Guide

This project now includes a Sanity Studio configuration with the `post` and `comment` document schemas.

## Local Development

Run the Sanity Studio locally to test schema changes and content management:

```bash
npm run studio:dev
```

This will start the Sanity Studio on `http://localhost:3333`.

## Deploy to Your Sanity Studio

To sync your local schemas with your live Sanity Studio at `https://www.sanity.io/organizations/oaUsjfgAO/project/0qnyls1e/studios`:

### Step 1: Authenticate with Sanity
```bash
npx sanity login
```
This will open a browser window to authenticate your Sanity account.

### Step 2: Link Your Project
The `sanity/sanity.config.ts` file is already configured to use:
- **Project ID**: `0qnyls1e`
- **Dataset**: `production`

### Step 3: Deploy the Schemas
```bash
npm run studio:build
```

Then deploy to Sanity's hosting:
```bash
npx sanity deploy
```

This will:
1. Validate your schemas
2. Deploy to your live Sanity Studio
3. Make the `post` and `comment` document types available in your Studio

## Verify in Sanity Studio

Once deployed, go to your Sanity Studio and:
1. ✅ You should see **"SURWASH Blog Post"** in the left sidebar under **Create**
2. ✅ You should see **"Blog Comment"** in the left sidebar under **Create**
3. Create a test post to verify the schema works

## Document Types Available

### **Post** (`post`)
- Title (required, max 100 chars)
- Slug (auto-generated from title)
- State Scope (federal, abuja, lagos, kano)
- Post Type (press_release, news_update, field_report, policy_brief)
- Featured Flag (marks as hero post)
- Cover Image (with hotspot for cropping)
- Rich Content (Portable Text with blocks, lists, links)
- SEO Meta Description (max 160 chars)
- Published Date

### **Comment** (`comment`)
- Commenter Name (required)
- Email (optional, private)
- Comment Text (required, 2-1000 chars)
- Post Reference (link to a blog post)
- Approved Flag (toggle to publish publicly)

## Querying Data

Once you've created content, the frontend will automatically fetch posts using GROQ queries in:
- `features/blog/lib/sanity.ts` — handles `getPostsByState()`, `getPostBySlug()`, `getAllPostSlugs()`

Published posts will appear on:
- `/blog` — Blog listing feed (state-filterable)
- `/blog/[slug]` — Individual post detail page

Comments will display only if `approved: true` in Sanity.

---

## Next Steps

1. **Deploy schemas**: Run `npx sanity login` → `npm run studio:build` → `npx sanity deploy`
2. **Create a test post** in Sanity Studio
3. **Toggle a comment to approved** to see it display publicly
4. **Test the comment form** on a blog detail page
5. **Test ISR webhook** by publishing a post and watching `/api/revalidate` endpoint get called
