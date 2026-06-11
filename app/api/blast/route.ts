import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from 'next-sanity';
import fs from 'fs/promises';
import path from 'path';

// Initialize the Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Create Sanity read-only client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

// Create Sanity write client for updating dispatch status
const sanityWriteClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') || '*';
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin') || '*';
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // 1. Authenticate the handshake token signature
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || '';

    if (!token || token !== process.env.SANITY_EMAIL_BLAST_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized Request: Handshake token signature mismatch.' },
        { status: 401, headers }
      );
    }

    // 2. Parse payload request parameters
    const { blastId } = await request.json();
    if (!blastId) {
      return NextResponse.json(
        { error: 'Missing parameter: blastId is required.' },
        { status: 400, headers }
      );
    }

    // 3. Query Sanity CMS for Email Blast campaign and dereference target edition
    const query = `*[_type == "emailBlast" && _id == $blastId][0] {
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

    // Clean drafts ID prefixes if present
    const cleanBlastId = blastId.replace('drafts.', '');

    const blast = await sanityClient.fetch(query, { blastId: cleanBlastId });
    if (!blast) {
      return NextResponse.json(
        { error: `Email blast campaign with ID '${cleanBlastId}' not found.` },
        { status: 404, headers }
      );
    }

    const edition = blast.edition;
    if (!edition) {
      return NextResponse.json(
        { error: 'This campaign is not linked to any newsletter edition.' },
        { status: 400, headers }
      );
    }

    if (!edition.posts || edition.posts.length === 0) {
      return NextResponse.json(
        { error: `The linked edition '${edition.title}' has no referenced articles.` },
        { status: 400, headers }
      );
    }

    // 4. Retrieve Stakeholders from Resend Audience
    let stakeholders: string[] = [];
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      try {
        const contactsList = await resend.contacts.list({ audienceId });
        if (contactsList.data && Array.isArray(contactsList.data.data)) {
          stakeholders = contactsList.data.data
            .filter((c: any) => !c.unsubscribed)
            .map((c: any) => c.email);
        }
      } catch (contactsError: any) {
        console.error('Failed to retrieve contacts from Resend:', contactsError);
      }
    }

    // Fallback/Safety Check for local verification and dry runs
    const isDryRun = stakeholders.length === 0;
    if (isDryRun) {
      console.warn('No subscribers found in Resend Audience or audience ID is missing. Falling back to test recipient.');
      stakeholders = ['test-recipient@surwash.ng'];
    }

    // 5. Compose HTML and Plain Text Email contents using campaign customization
    const htmlEmail = renderEmailTemplate(blast, edition);
    const plainTextEmail = renderPlainTextTemplate(blast, edition);

    // 6. Deliver Bulk Emails via Resend (BCC chunking)
    const BATCH_SIZE = 90; // Resend limit is 100 recipients per single API call
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'SURWASH Communications <no-reply@surwash.ng>';
    const emailSubject = blast.subject?.trim() || `SURWASH Newsletter: ${edition.title} — ${edition.theme}`;

    // Split stakeholders into batches
    for (let i = 0; i < stakeholders.length; i += BATCH_SIZE) {
      const batch = stakeholders.slice(i, i + BATCH_SIZE);

      await resend.emails.send({
        from: fromAddress,
        to: 'newsletter-archive@surwash.ng', // Send to an archive placeholder
        bcc: batch, // Blind Carbon Copy protects privacy of stakeholders
        subject: emailSubject,
        html: htmlEmail,
        text: plainTextEmail,
      });
    }

    // 7. Write Back status to Sanity CMS
    let updatedInSanity = false;
    try {
      await sanityWriteClient
        .patch(cleanBlastId)
        .set({
          status: 'sent',
          sentAt: new Date().toISOString(),
        })
        .commit();
      updatedInSanity = true;
    } catch (writeBackError) {
      console.error('Failed to update email blast status in Sanity:', writeBackError);
      // We do not fail the request if the email blast WAS sent successfully
    }

    // 8. Log Trigger for Audit Trail
    try {
      const logDir = path.join(process.cwd(), 'data/backups');
      await fs.mkdir(logDir, { recursive: true });
      await fs.appendFile(
        path.join(logDir, 'email-blasts.log'),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          blastId: cleanBlastId,
          blastTitle: blast.title,
          editionTitle: edition.title,
          emailSubject,
          recipientsCount: stakeholders.length,
          updatedInSanity,
          isDryRun,
          recipients: stakeholders,
        }) + '\n'
      );
    } catch (logError) {
      console.error('Failed to write email blast audit log:', logError);
    }

    return NextResponse.json({
      success: true,
      recipientsTriggered: stakeholders.length,
      campaign: blast.title,
      edition: edition.title,
      updatedInSanity,
      isDryRun,
    }, { headers });
  } catch (error: any) {
    console.error('Email blast dispatch server error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred during dispatch.' },
      { status: 500, headers }
    );
  }
}

// Helper: Generates a responsive, visually cohesive newsletter digest email
function renderEmailTemplate(blast: any, edition: any) {
  const websiteUrl = 'https://newsletter.surwash.ng';
  
  // Resolve preheader and welcome message customized for this blast, falling back to edition fields
  const preheaderText = blast.preheader?.trim() || edition.themeDescription || 'Welcome to the latest bi-monthly edition of the SURWASH newsletter.';
  const welcomeMessage = blast.welcomeMessage?.trim() || edition.themeDescription || 'Welcome to the latest bi-monthly edition of the SURWASH newsletter, highlighting our continuous water reform achievements and field updates across the country.';

  const postsHtml = edition.posts
    .map((post: any) => {
      const displayCategory = post.stateScope === 'federal'
        ? 'Federal'
        : `${post.stateScope.charAt(0).toUpperCase()}${post.stateScope.slice(1)} State`;
      
      const displayType = post.postType
        .split('_')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return `
        <!-- Article Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #0EA5E9; font-weight: bold;">
                      ${displayCategory} &bull; ${displayType}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #0F172A; line-height: 1.3;">
                      ${post.title}
                    </h3>
                  </td>
                </tr>
                ${post.imageUrl ? `
                <tr>
                  <td style="padding-bottom: 12px;">
                    <img src="${post.imageUrl}" alt="${post.title}" width="100%" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 6px; display: block;" />
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.5;">
                      ${post.metaDescription}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="${websiteUrl}/newsletter/${post.slug}" target="_blank" style="display: inline-block; padding: 10px 18px; background-color: #0F172A; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">
                      Read Full Article &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SURWASH Newsletter: ${edition.title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <!-- Hidden Preheader Text (for email inbox preview) -->
        <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; color: transparent; line-height: 1px; mso-hide: all;">
          ${preheaderText}
        </div>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);">
                <!-- Brand Header -->
                <tr>
                  <td style="background-color: #0F172A; padding: 36px 24px; text-align: center;">
                    <span style="display: inline-block; padding: 4px 10px; background-color: #0EA5E9; color: #ffffff; font-size: 11px; font-weight: bold; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
                      Federal Ministry of Water Resources & Sanitation
                    </span>
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.2;">
                      SURWASH PROGRAMME
                    </h1>
                    <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">
                      National Bi-Monthly Newsletter Digest
                    </p>
                  </td>
                </tr>

                <!-- Cover Image -->
                ${edition.coverImageUrl ? `
                <tr>
                  <td>
                    <img src="${edition.coverImageUrl}" alt="${edition.title}" width="100%" style="width: 100%; height: auto; display: block;" />
                  </td>
                </tr>
                ` : ''}

                <!-- Edition Summary Block -->
                <tr>
                  <td style="padding: 32px 24px 16px 24px;">
                    <h2 style="margin: 0 0 8px 0; color: #0F172A; font-size: 22px; font-weight: 800;">
                      Edition ${edition.editionNumber}: ${edition.title}
                    </h2>
                    <div style="font-size: 15px; font-weight: 700; color: #0EA5E9; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.025em;">
                      Theme: ${edition.theme}
                    </div>
                    <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px 0; white-space: pre-line;">
                      ${welcomeMessage}
                    </p>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="border-top: 1px solid #e2e8f0; padding-top: 24px;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Articles Grid -->
                <tr>
                  <td style="padding: 0 24px 24px 24px;">
                    <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin: 0 0 16px 0;">
                      IN THIS DIGEST:
                    </h4>
                    ${postsHtml}
                  </td>
                </tr>

                <!-- CTA to Platform -->
                <tr>
                  <td align="center" style="padding: 8px 24px 32px 24px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 6px; background-color: #0EA5E9;">
                          <a href="${websiteUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">
                            Visit the SURWASH Newsletter Feed Archive &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f5f9; padding: 28px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 12px; color: #64748B; line-height: 1.6;">
                      Federal Programme Coordination Unit (FPCU)<br>
                      Federal Ministry of Water Resources and Sanitation<br>
                      No. 15 Ajesa Street, Wuse II, Abuja, Nigeria.
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #94A3B8;">
                      You are receiving this notification because you are a registered stakeholder of the SURWASH program.
                      <br>
                      To stop receiving these notifications, you can <a href="${websiteUrl}/unsubscribe" style="color: #64748B; text-decoration: underline;">unsubscribe here</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// Helper: Generates a clear, readable plain text version of the newsletter
function renderPlainTextTemplate(blast: any, edition: any) {
  const websiteUrl = 'https://newsletter.surwash.ng';
  const welcomeMessage = blast.welcomeMessage?.trim() || edition.themeDescription || 'Welcome to the latest bi-monthly edition of the SURWASH newsletter.';

  const postsText = edition.posts
    .map((post: any, idx: number) => {
      const displayCategory = post.stateScope === 'federal' ? 'Federal' : `${post.stateScope.charAt(0).toUpperCase()}${post.stateScope.slice(1)} State`;
      const displayType = post.postType.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      return `
${idx + 1}. ${post.title.toUpperCase()}
   Category: ${displayCategory} &bull; ${displayType}
   Summary: ${post.metaDescription}
   Read the full article: ${websiteUrl}/newsletter/${post.slug}
      `;
    })
    .join('\n');

  return `
SURWASH PROGRAMME
National Bi-Monthly Newsletter Digest

Edition ${edition.editionNumber}: ${edition.title}
Theme: ${edition.theme}
==================================================

${welcomeMessage}

--------------------------------------------------
IN THIS DIGEST:
${postsText}

--------------------------------------------------
To explore interactive maps, view beneficiary photos, and leave comments, visit the SURWASH Newsletter Feed Archive at: ${websiteUrl}

Federal Programme Coordination Unit (FPCU)
Federal Ministry of Water Resources and Sanitation, Abuja, Nigeria.
Unsubscribe: ${websiteUrl}/unsubscribe
  `;
}
