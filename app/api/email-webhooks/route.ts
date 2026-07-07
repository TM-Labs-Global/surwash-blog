import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Setup write-enabled Sanity client if token is provided
const isConfigured = !!process.env.SANITY_PROJECT_ID && !!process.env.SANITY_API_WRITE_TOKEN;
const writeClient = isConfigured
  ? createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN,
    })
  : null;

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const webhookSecret = process.env.EMAIL_WEBHOOK_SECRET || '';

    // 1. Securely verify signature hash (HMAC-SHA256) if secret is configured
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(bodyText)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid payload signature verification check failed' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(bodyText);
    const { editionId, eventType, count = 1 } = payload;

    if (!editionId || !eventType) {
      return NextResponse.json(
        { error: 'Bad Request: Missing editionId or eventType' },
        { status: 400 }
      );
    }

    // 2. Map event type to matching newsletterEdition telemetry field
    let patchField = '';
    switch (eventType) {
      case 'delivered':
      case 'email.delivered':
        patchField = 'emailsDelivered';
        break;
      case 'opened':
      case 'email.opened':
        patchField = 'emailsOpened';
        break;
      case 'clicked':
      case 'email.clicked':
      case 'link.clicked':
        patchField = 'linkClicks';
        break;
      case 'bounced':
      case 'email.bounced':
        patchField = 'bounces';
        break;
      default:
        return NextResponse.json(
          { error: `Bad Request: Unsupported event type "${eventType}"` },
          { status: 400 }
        );
    }

    // 3. Patch telemetry count in Sanity document
    if (writeClient) {
      await writeClient
        .patch(editionId)
        .inc({ [patchField]: count })
        .commit();
      
      console.log(`Successfully patched newsletterEdition "${editionId}" telemetry metric "${patchField}" by +${count}`);
    } else {
      console.warn(
        `Sanity write client not configured (missing token). Sandbox Telemetry Log: edition "${editionId}", incremented "${patchField}" by ${count}`
      );
    }

    return NextResponse.json({
      success: true,
      editionId,
      updatedField: patchField,
      increment: count,
      sandboxMode: !writeClient,
    });
  } catch (error: any) {
    console.error('Email tracking webhook processing failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
