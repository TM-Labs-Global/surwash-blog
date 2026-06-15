import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { renderEmailTemplate } from '../blast/route';

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function GET(request: Request) {
  // Restrict preview endpoint to development environment to prevent public drafts leakage
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const blastId = searchParams.get('id');

  let query = '';
  let params = {};

  if (blastId) {
    query = `*[_type == "emailBlast" && _id == $blastId][0] {
      _id,
      title,
      subject,
      preheader,
      welcomeMessage,
      status,
      edition-> {
        _id,
        title,
        theme,
        themeDescription,
        editionNumber,
        month,
        "coverImageUrl": coverImage.asset->url,
        "posts": *[_type == "post" && edition._ref == ^._id] | order(publishedAt asc, _createdAt asc) {
          _id,
          title,
          "slug": slug.current,
          stateScope,
          postType,
          metaDescription,
          "imageUrl": mainImage.asset->url
        }
      }
    }`;
    params = { blastId };
  } else {
    query = `*[_type == "emailBlast"] | order(_createdAt desc)[0] {
      _id,
      title,
      subject,
      preheader,
      welcomeMessage,
      status,
      edition-> {
        _id,
        title,
        theme,
        themeDescription,
        editionNumber,
        month,
        "coverImageUrl": coverImage.asset->url,
        "posts": *[_type == "post" && edition._ref == ^._id] | order(publishedAt asc, _createdAt asc) {
          _id,
          title,
          "slug": slug.current,
          stateScope,
          postType,
          metaDescription,
          "imageUrl": mainImage.asset->url
        }
      }
    }`;
  }

  try {
    const blast = await sanityClient.fetch(query, params);
    if (!blast) {
      return new NextResponse('<h1>No email blast campaign found.</h1>', {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const edition = blast.edition;
    if (!edition) {
      return new NextResponse('<h1>Linked newsletter edition not found.</h1>', {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const html = renderEmailTemplate(blast, edition);
    
    // Resolve local host vs production host to render logo images correctly in the browser
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;
    const localHtml = html.replaceAll('https://newsletter.surwash.ng', origin);

    return new NextResponse(localHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    return new NextResponse(`<h1>Error rendering email preview</h1><pre>${error.message}</pre>`, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
