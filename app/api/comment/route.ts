import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

export async function POST(request: Request) {
  try {
    const { name, email, comment, postId } = await request.json();

    if (!name || !comment || !postId) {
      return NextResponse.json(
        { message: 'Validation failed: Name, comment, and post ID are required.' },
        { status: 400 }
      );
    }

    const isWriteConfigured = !!process.env.SANITY_PROJECT_ID && !!(process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN);

    if (isWriteConfigured) {
      // Initialize client with write token permission
      const writeClient = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET || 'production',
        apiVersion: '2023-05-03',
        useCdn: false,
        token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
      });

      // Submit comment as a draft/unapproved document for moderation
      await writeClient.create({
        _type: 'comment',
        name,
        email: email || undefined,
        comment,
        post: {
          _type: 'reference',
          _ref: postId,
        },
        approved: false,
      });

      return NextResponse.json({
        success: true,
        message: 'Comment submitted successfully and is awaiting approval.',
      });
    } else {
      // Mock mode fallback logs comment submission to console
      console.log('--- Mock Comment Submitted ---');
      console.log(`Post ID: ${postId}`);
      console.log(`Author: ${name} (${email || 'No email'})`);
      console.log(`Body: ${comment}`);
      console.log('------------------------------');

      return NextResponse.json({
        success: true,
        mocked: true,
        message: 'Comment registered successfully in local sandbox. Awaiting moderation.',
      });
    }
  } catch (error: any) {
    console.error('Comment API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
