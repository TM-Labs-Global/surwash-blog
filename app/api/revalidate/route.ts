import { revalidatePath, revalidateTag } from 'next/cache';
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

    let payload: any = {};
    try {
      payload = await request.json();
    } catch (e) {
      // Safe fallback for empty or non-JSON payloads
    }
    
    const dynamicSlug = payload?.slug?.current || payload?.slug;
    const docType = payload?._type;

    if (docType === 'page') {
      revalidateTag('pages', {});
      if (dynamicSlug) {
        revalidateTag(`page-${dynamicSlug}`, {});
        // Force static page rebuild over specific path
        revalidatePath(`/${dynamicSlug}`);
      }
    } else if (docType === 'newsletterEdition') {
      revalidateTag('editions', {});
      if (dynamicSlug) {
        revalidateTag(`edition-${dynamicSlug}`, {});
        revalidatePath(`/newsletter/edition/${dynamicSlug}`);
      }
      revalidatePath('/newsletter');
      revalidatePath('/');
    } else {
      // default: post
      revalidateTag('posts', {});
      if (dynamicSlug) {
        revalidateTag(`post-${dynamicSlug}`, {});
        // Force static page rebuild over specific path
        revalidatePath(`/newsletter/${dynamicSlug}`);
      }

      // Force static page rebuild over path boundaries
      revalidatePath('/newsletter');
      revalidatePath('/');
      revalidatePath('/publications');
    }

    return NextResponse.json({
      revalidated: true,
      executionTimestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
