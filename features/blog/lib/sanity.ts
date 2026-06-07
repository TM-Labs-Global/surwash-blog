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
  content: any;
  postType: 'press_release' | 'news_update' | 'field_report' | 'policy_brief';
  isFeatured?: boolean;
  comments?: Comment[];
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
      ? `*[_type == "post"] | order(_createdAt desc) { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured, "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) { _id, name, _createdAt, comment } }`
      : `*[_type == "post" && stateScope == $stateScope] | order(_createdAt desc) { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured, "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) { _id, name, _createdAt, comment } }`;
    
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
    const query = `*[_type == "post" && slug.current == $slug][0] { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured, "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) { _id, name, _createdAt, comment } }`;
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

