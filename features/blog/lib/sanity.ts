import { createClient } from 'next-sanity';

export interface Comment {
  _id: string;
  name: string;
  comment: string;
  _createdAt: string;
  approved?: boolean;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  stateScope: string;
  _createdAt: string;
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
  postType: 'press_release' | 'news_update' | 'field_report' | 'policy_brief';
  isFeatured?: boolean;
  comments?: Comment[];
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

// Fetch posts by state scope
export const getPostsByState = async (stateScope: string): Promise<Post[]> => {
  if (!sanityClient) {
    console.warn('Sanity client not configured.');
    return [];
  }

  try {
    const query = stateScope === 'all' || !stateScope
      ? `*[_type == "post"] | order(_createdAt desc) { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured }`
      : `*[_type == "post" && stateScope == $stateScope] | order(_createdAt desc) { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured }`;
    
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
    const query = `*[_type == "post" && slug.current == $slug][0] { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, "mainImage": mainImage { asset-> { url, metadata { dimensions { width, height } } }, alt }, content, postType, isFeatured }`;
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

