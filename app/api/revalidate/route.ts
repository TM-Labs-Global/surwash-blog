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

    const payload = await request.json();
    const dynamicSlug = payload?.slug?.current || payload?.slug;

    if (!dynamicSlug) {
      return NextResponse.json(
        { message: 'Invalid payload — route slug missing' },
        { status: 400 }
      );
    }

    // Force cache purge over specific path boundaries
    revalidatePath(`/blog/${dynamicSlug}`);
    revalidatePath('/blog');
    revalidatePath('/');
    revalidatePath('/publications');

    return NextResponse.json({
      revalidated: true,
      executionTimestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
