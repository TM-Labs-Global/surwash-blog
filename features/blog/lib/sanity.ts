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

// 6 diverse mock posts representing different categories, scopes, and featured roles with mock comments
export const MOCK_POSTS: Post[] = [
  {
    _id: '1',
    title: 'SURWASH Strategic National Sanitation Roadmap 2026-2030',
    slug: { current: 'surwash-strategic-national-sanitation-roadmap' },
    stateScope: 'federal',
    _createdAt: '2026-06-06T10:00:00Z',
    metaDescription: 'The Federal Ministry of Water Resources and World Bank outline the strategic sanitation roadmap for Nigeria.',
    imageUrl: '/blog-banners/surwash.webp',
    postType: 'policy_brief',
    isFeatured: true,
    comments: [
      {
        _id: 'c1',
        name: 'Sarah Cole (WASH Analyst)',
        comment: 'This roadmap provides the exact structural alignment required to streamline state-level sanitation interventions. Eager to see how monitoring tools are deployed.',
        _createdAt: '2026-06-06T12:00:00Z',
      }
    ],
    content: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c1', _type: 'span', text: 'Achieving safe sanitation for all Nigerians requires a coordinated national effort. The Federal SURWASH Coordination Office, in partnership with state implementation units and international stakeholders, has published the Strategic National Sanitation Roadmap.' }]
      },
      {
        _key: 'b2',
        _type: 'block',
        style: 'h2',
        children: [{ _key: 'c2', _type: 'span', text: 'Core Roadmap Milestones' }]
      },
      {
        _key: 'b3',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c3', _type: 'span', text: 'The roadmap targets the elimination of open defecation in rural communities, upgrading urban fecal sludge treatment networks, and building sustainable institutional capacities over the next four years.' }]
      }
    ]
  },
  {
    _id: '2',
    title: 'Federal Ministry Secures $150M World Bank Extension for SURWASH',
    slug: { current: 'federal-ministry-secures-funding-extension' },
    stateScope: 'federal',
    _createdAt: '2026-06-05T14:30:00Z',
    metaDescription: 'A critical funding extension has been approved to expand clean water access and sanitation structures.',
    imageUrl: '/blog-banners/IMG_2832.jpg',
    postType: 'press_release',
    comments: [],
    content: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c1', _type: 'span', text: 'In a major boost for the sustainable development goals (SDGs) in West Africa, the World Bank has approved an additional $150 million extension for the SURWASH program to escalate water grid rehabilitation.' }]
      }
    ]
  },
  {
    _id: '3',
    title: 'Abuja Clears Pipeline Bottlenecks, Restoring Water to 50,000 FCT Residents',
    slug: { current: 'abuja-clears-pipeline-bottlenecks' },
    stateScope: 'abuja',
    _createdAt: '2026-06-04T09:15:00Z',
    metaDescription: 'Engineers complete repairs on primary supply lines, resolving dry spells in several FCT suburbs.',
    imageUrl: '/blog-banners/IMG_2829.jpg',
    postType: 'news_update',
    comments: [
      {
        _id: 'c2',
        name: 'Engr. Ibrahim',
        comment: 'Water started flowing in our sector in Kubwa this morning. We thank the repair teams for working through the night.',
        _createdAt: '2026-06-04T12:00:00Z',
      },
      {
        _id: 'c3',
        name: 'Mrs. Obi (FCT Resident)',
        comment: 'A huge relief for families here. Safe water supply is critical for hygiene, especially during the hot season.',
        _createdAt: '2026-06-04T15:30:00Z',
      }
    ],
    content: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c1', _type: 'span', text: 'Repair teams in Abuja have successfully decommissioned and replaced damaged high-pressure valves along the main reservoir feeder lines. This completion returns safe drinking water to over 50,000 residents.' }]
      }
    ]
  },
  {
    _id: '4',
    title: 'Field Assessment: Sanitation and Solar Boreholes in Kano Rural Communities',
    slug: { current: 'field-assessment-kano-rural-boreholes' },
    stateScope: 'kano',
    _createdAt: '2026-06-03T11:00:00Z',
    metaDescription: 'A comprehensive audit of rural solar-powered pump stations highlights community-led operational success.',
    imageUrl: '/blog-banners/IMG_2873.jpg',
    postType: 'field_report',
    comments: [],
    content: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c1', _type: 'span', text: 'Evaluating solar-powered pumping networks in Kano shows a 90% uptime rate, thanks to local community maintenance committees trained under the SURWASH program guidelines.' }]
      }
    ]
  },
  {
    _id: '5',
    title: 'Lagos Partners with Local Developers for WASH Public Facilities',
    slug: { current: 'lagos-partners-local-developers-wash' },
    stateScope: 'lagos',
    _createdAt: '2026-06-02T16:00:00Z',
    metaDescription: 'Lagos State announces a new public-private partnership framework to construct modern public toilets.',
    imageUrl: '/blog-banners/IMG_2875.jpg',
    postType: 'press_release',
    comments: [],
    content: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c1', _type: 'span', text: 'Lagos State has structured a PPP initiative to construct and operate 200 public sanitation modules across congested markets and transport hubs, enhancing hygiene and reducing open defecation.' }]
      }
    ]
  },
  {
    _id: '6',
    title: 'FCT Urban Hygiene Guideline for Commercial Establishments',
    slug: { current: 'fct-urban-hygiene-guideline' },
    stateScope: 'abuja',
    _createdAt: '2026-05-29T10:00:00Z',
    metaDescription: 'New regulations mandate strict sanitation facilities and grease traps for all FCT food businesses.',
    imageUrl: '/blog-banners/IMG_2829.jpg',
    postType: 'policy_brief',
    comments: [],
    content: [
      {
        _key: 'b1',
        _type: 'block',
        style: 'normal',
        children: [{ _key: 'c1', _type: 'span', text: 'The Abuja Environmental Protection Board, aligned with SURWASH sanitary mandates, has released a code of practice requiring modern wastewater containment for commercial premises.' }]
      }
    ]
  }
];

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
    if (stateScope === 'all' || !stateScope) {
      return MOCK_POSTS;
    }
    return MOCK_POSTS.filter(post => post.stateScope === stateScope);
  }

  try {
    const query = stateScope === 'all' || !stateScope
      ? `*[_type == "post"] | order(_createdAt desc) { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured, "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) { _id, name, _createdAt, comment } }`
      : `*[_type == "post" && stateScope == $stateScope] | order(_createdAt desc) { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured, "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) { _id, name, _createdAt, comment } }`;
    
    const results = await sanityClient.fetch(query, { stateScope });
    
    // Fall back to mock data if Sanity returns empty (schemas not deployed yet)
    if (!results || results.length === 0) {
      if (stateScope === 'all' || !stateScope) {
        return MOCK_POSTS;
      }
      return MOCK_POSTS.filter(post => post.stateScope === stateScope);
    }
    
    return results;
  } catch (error) {
    // If Sanity query fails, fall back to mock data
    console.warn('Sanity query failed, using mock data:', error);
    if (stateScope === 'all' || !stateScope) {
      return MOCK_POSTS;
    }
    return MOCK_POSTS.filter(post => post.stateScope === stateScope);
  }
};

// Fetch a single post by its slug path
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  if (!sanityClient) {
    return MOCK_POSTS.find(post => post.slug.current === slug) || null;
  }

  try {
    const query = `*[_type == "post" && slug.current == $slug][0] { _id, title, slug, stateScope, _createdAt, metaDescription, "imageUrl": mainImage.asset->url, content, postType, isFeatured, "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) { _id, name, _createdAt, comment } }`;
    const result = await sanityClient.fetch(query, { slug });
    
    // Fall back to mock data if Sanity returns nothing
    if (!result) {
      return MOCK_POSTS.find(post => post.slug.current === slug) || null;
    }
    
    return result;
  } catch (error) {
    // If Sanity query fails, fall back to mock data
    console.warn('Sanity query failed, using mock data:', error);
    return MOCK_POSTS.find(post => post.slug.current === slug) || null;
  }
};

// Fetch all slugs for Next.js build-time dynamic paths generation
export const getAllPostSlugs = async (): Promise<string[]> => {
  if (!sanityClient) {
    return MOCK_POSTS.map(post => post.slug.current);
  }

  try {
    const query = `*[_type == "post" && defined(slug.current)][].slug.current`;
    const results = await sanityClient.fetch(query);
    
    // Fall back to mock data if Sanity returns empty
    if (!results || results.length === 0) {
      return MOCK_POSTS.map(post => post.slug.current);
    }
    
    return results;
  } catch (error) {
    // If Sanity query fails, fall back to mock data
    console.warn('Sanity query failed, using mock data:', error);
    return MOCK_POSTS.map(post => post.slug.current);
  }
};
