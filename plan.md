# Implementation Plan - Blog Post Commenting System

This plan details the steps to implement an interactive commenting and moderation system for the SURWASH Blog Platform.

## User Review Required

> [!IMPORTANT]
> - **Sanity Moderation Workflow**: To support comment submission and moderation, we recommend adding a `comment` document type in Sanity. Comments are submitted as unapproved drafts, allowing editors to review and toggle them to `approved` in the Sanity Studio before they show up publicly.
> - **Sandbox Mock Mode**: The frontend form will post to a secure endpoint. If Sanity is not fully connected or the write token is absent, the form will simulate a successful post and instantly append it to the browser's view, allowing immediate UX testing.
> - **Email Privacy**: The email field will be marked optional and will only be stored securely in the database for admin reference — never exposed on the frontend.

## Proposed Changes

### 1. Data Layer & Schema Configurations

#### [NEW] [app/api/comment/route.ts](file:///Users/user/Desktop/El-Roy/Professional%20Career/Frontend%20Development/Projects/surwash-blog-website/app/api/comment/route.ts)
- Create a POST handler to process form submissions:
  - Validate parameters (name, comment, post ID).
  - Authenticate against Sanity API and create a new `comment` document with `{ approved: false }` referencing the target `_id` of the post.
  - Return a graceful success status even if Sanity credentials are empty (in mock mode).

#### [MODIFY] [features/blog/lib/sanity.ts](file:///Users/user/Desktop/El-Roy/Professional%20Career/Frontend%20Development/Projects/surwash-blog-website/features/blog/lib/sanity.ts)
- Update post detail queries to retrieve associated comments where `approved == true`.
- Update mock post data to include standard mock comments (e.g., local engineers or residents praising the FCT water pipeline repairs) to verify UI aesthetics.

---

### 2. Frontend Components

#### [NEW] [features/blog/components/CommentForm.tsx](file:///Users/user/Desktop/El-Roy/Professional%20Career/Frontend%20Development/Projects/surwash-blog-website/features/blog/components/CommentForm.tsx)
- Create an interactive client component for comment submission:
  - Input fields: `name` (required), `email` (optional), `comment` (required).
  - Visual states: `submitting` (disable buttons), `success` (hide form and show "Awaiting Moderation" success message), `error`.

#### [MODIFY] [features/blog/pages/blog-detail-page.tsx](file:///Users/user/Desktop/El-Roy/Professional%20Career/Frontend%20Development/Projects/surwash-blog-website/features/blog/pages/blog-detail-page.tsx)
- Embed the comment list and the `<CommentForm>` at the bottom of the article card.
- Maintain a local state to immediately append successfully submitted comments, ensuring immediate visual feedback.

## Verification Plan

### Automated Verification
- Run `npm run build` to ensure the API route and type properties compile cleanly.

### Manual Verification
- Navigate to a post detail page (e.g. `/blog/abuja-clears-pipeline-bottlenecks`).
- Confirm the mock comments load correctly.
- Fill out the form and submit:
  - Verify loading animation.
  - Verify success message.
  - Confirm the submitted comment is appended to the view in "Awaiting moderation" state.
