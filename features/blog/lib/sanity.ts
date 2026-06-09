import { createClient } from 'next-sanity';

export interface Comment {
  _id: string;
  name: string;
  comment: string;
  _createdAt: string;
  approved?: boolean;
}

export interface EditionReference {
  _id: string;
  title: string;
  slug: { current: string };
  theme: string;
  themeDescription?: string;
  editionNumber: number;
  month: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  stateScope: string;
  _createdAt: string;
  publishedAt?: string;
  metaDescription: string;
  imageUrl?: string;
  mainImage?: {
    asset: {
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  content: any;
  postType: string;
  isFeatured?: boolean;
  comments?: Comment[];
  edition?: EditionReference;
}

export interface NewsletterEdition {
  _id: string;
  title: string;
  slug: { current: string };
  theme: string;
  themeDescription?: string;
  editionNumber: number;
  month: string;
  publishedAt: string;
  coverImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  posts: Post[];
}

export interface PageSection {
  _key: string;
  sectionTitle?: string;
  body: any;
}

export interface PageData {
  _id: string;
  title: string;
  slug: { current: string };
  sections: PageSection[];
  showInTicker?: boolean;
}

export interface TickerPage {
  _id: string;
  title: string;
  slug: { current: string };
}

const isConfigured = !!process.env.SANITY_PROJECT_ID;

export const sanityClient = isConfigured
  ? createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN,
    })
  : null;

// Fetch all newsletter editions with their linked articles (for homepage)
export const getEditionsWithPosts = async (): Promise<NewsletterEdition[]> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return [];
  }

  try {
    // Fetch editions ordered newest first
    const editionsQuery = `*[_type == "newsletterEdition"] | order(month desc) {
      _id, title, slug, theme, themeDescription, editionNumber, month, publishedAt,
      "coverImage": coverImage { asset->{ url }, alt }
    }`;
    const editions = await sanityClient.fetch(editionsQuery, {}, { next: { tags: ['editions'] } });

    if (!editions || editions.length === 0) return [];

    // For each edition, fetch its linked posts
    const editionsWithPosts = await Promise.all(
      editions.map(async (edition: NewsletterEdition) => {
        const postsQuery = `*[_type == "post" && edition._ref == $editionId] | order(publishedAt asc, _createdAt asc) {
          _id, title, slug, stateScope, _createdAt, publishedAt, metaDescription,
          "imageUrl": mainImage.asset->url, postType, isFeatured
        }`;
        const posts = await sanityClient!.fetch(postsQuery, { editionId: edition._id }, { next: { tags: ['posts', `edition-${edition._id}`] } });
        return { ...edition, posts: posts || [] };
      })
    );

    return editionsWithPosts;
  } catch (error) {
    console.error('Sanity editions query failed:', error);
    return [];
  }
};

// Fetch a single edition by slug, with all its posts (for edition landing page)
export const getEditionBySlug = async (slug: string): Promise<NewsletterEdition | null> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return null;
  }

  try {
    const editionQuery = `*[_type == "newsletterEdition" && slug.current == $slug][0] {
      _id, title, slug, theme, themeDescription, editionNumber, month, publishedAt,
      "coverImage": coverImage { asset->{ url }, alt }
    }`;
    const edition = await sanityClient.fetch(editionQuery, { slug }, { next: { tags: [`edition-${slug}`] } });
    if (!edition) return null;

    const postsQuery = `*[_type == "post" && edition._ref == $editionId] | order(publishedAt asc, _createdAt asc) {
      _id, title, slug, stateScope, _createdAt, publishedAt, metaDescription,
      "imageUrl": mainImage.asset->url, postType, isFeatured
    }`;
    const posts = await sanityClient.fetch(postsQuery, { editionId: edition._id }, { next: { tags: [`edition-${slug}`, 'posts'] } });

    return { ...edition, posts: posts || [] };
  } catch (error) {
    console.error('Sanity edition query failed:', error);
    return null;
  }
};

// Fetch all edition slugs for static path generation
export const getAllEditionSlugs = async (): Promise<string[]> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return [];
  }

  try {
    const query = `*[_type == "newsletterEdition" && defined(slug.current)][].slug.current`;
    const results = await sanityClient.fetch(query, {}, { next: { tags: ['editions'] } });
    return results || [];
  } catch (error) {
    console.error('Sanity edition slugs query failed:', error);
    return [];
  }
};

// Fetch posts by state scope (kept for backward compatibility / fallback)
export const getPostsByState = async (stateScope: string): Promise<Post[]> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return [];
  }

  try {
    const query = stateScope === 'all' || !stateScope
      ? `*[_type == "post"] | order(publishedAt desc, _createdAt desc) { _id, title, slug, stateScope, _createdAt, publishedAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured }`
      : `*[_type == "post" && stateScope == $stateScope] | order(publishedAt desc, _createdAt desc) { _id, title, slug, stateScope, _createdAt, publishedAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured }`;
    
    const results = await sanityClient.fetch(query, { stateScope }, { next: { tags: ['posts'] } });
    return results || [];
  } catch (error) {
    console.error('Sanity query failed:', error);
    return [];
  }
};

// Fetch a single post by its slug path
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return null;
  }

  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, stateScope, _createdAt, publishedAt, metaDescription,
      "imageUrl": mainImage.asset->url,
      "mainImage": mainImage { asset->{ url, metadata { dimensions { width, height } } }, alt },
      content, postType, isFeatured,
      "edition": edition->{ _id, title, slug, theme, themeDescription, editionNumber, month }
    }`;
    const result = await sanityClient.fetch(query, { slug }, { next: { tags: ['posts', `post-${slug}`] } });
    return result || null;
  } catch (error) {
    console.error('Sanity query failed:', error);
    return null;
  }
};

// Fetch all slugs for Next.js build-time dynamic paths generation
export const getAllPostSlugs = async (): Promise<string[]> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return [];
  }

  try {
    const query = `*[_type == "post" && defined(slug.current)][].slug.current`;
    const results = await sanityClient.fetch(query, {}, { next: { tags: ['posts'] } });
    return results || [];
  } catch (error) {
    console.error('Sanity query failed:', error);
    return [];
  }
};

// Fetch a single custom page by its slug path
export const getPageBySlug = async (slug: string): Promise<PageData | null> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return null;
  }

  try {
    const query = `*[_type == "page" && slug.current == $slug][0] { _id, title, slug, sections[]{ _key, sectionTitle, body }, showInTicker }`;
    const result = await sanityClient.fetch(query, { slug }, { next: { tags: [`page-${slug}`] } });
    return result || null;
  } catch (error) {
    console.error('Sanity page query failed:', error);
    return null;
  }
};

// Fetch all custom pages that have the ticker toggle enabled
export const getTickerPages = async (): Promise<TickerPage[]> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return [];
  }

  try {
    const query = `*[_type == "page" && showInTicker == true && defined(slug.current)] | order(_createdAt desc) { _id, title, slug }`;
    const results = await sanityClient.fetch(query, {}, { next: { tags: ['pages'] } });
    return results || [];
  } catch (error) {
    console.error('Sanity ticker pages query failed:', error);
    return [];
  }
};
