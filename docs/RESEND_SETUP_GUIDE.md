# 📧 Resend Email Integration — Setup Guide

> **For website developers on the Surwash team.**
> Follow this guide to wire up a contact form so that messages submitted by website visitors are delivered directly to your inbox via [Resend](https://resend.com).

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1 — Create a Resend Account](#step-1--create-a-resend-account)
4. [Step 2 — Verify Your Domain](#step-2--verify-your-domain)
5. [Step 3 — Generate Your API Key](#step-3--generate-your-api-key)
6. [Step 4 — Create an Audience (Optional but Recommended)](#step-4--create-an-audience-optional-but-recommended)
7. [Step 5 — Configure Environment Variables](#step-5--configure-environment-variables)
8. [Step 6 — Install the Resend SDK](#step-6--install-the-resend-sdk)
9. [Step 7 — Create the Contact Form API Route](#step-7--create-the-contact-form-api-route)
10. [Step 8 — Build the Contact Form (Frontend)](#step-8--build-the-contact-form-frontend)
11. [Step 9 — Test End-to-End](#step-9--test-end-to-end)
12. [Best Practices & Security](#best-practices--security)
13. [Troubleshooting](#troubleshooting)

---

## Overview

When a visitor fills out the contact form on the website and submits it, here is what happens under the hood:

```
Visitor fills form → Hits your API route → Resend sends email → You receive it in your inbox
                                         ↓
                              (Optional) Visitor is added
                              to your Resend Audience as a contact
```

All you need to do is:
1. Verify your domain on Resend (one-time, ~5 minutes)
2. Drop the 3 environment variables into `.env.local`
3. Plug in the API route and form code below

---

## Prerequisites

Before you start, make sure you have:

- [ ] A **Next.js** project (App Router) up and running
- [ ] Access to your **domain's DNS records** (via your domain registrar or Cloudflare)
- [ ] `npm` or `yarn` available in your terminal
- [ ] A **Resend account** (free tier is fine for most projects)

---

## Step 1 — Create a Resend Account

1. Go to [https://resend.com](https://resend.com) and click **Get Started**.
2. Sign up with your **work email** (e.g., your `@surwash.ng` address).
3. You'll land on the **Resend Dashboard**.

> ✅ Free tier gives you **3,000 emails/month** and **1 custom domain** — more than enough for a contact form.

---

## Step 2 — Verify Your Domain

This is the most important step. Resend requires you to verify ownership of the domain you want to send from (e.g., `surwash.ng`).

### 2a. Add the Domain

1. In the Resend dashboard, go to **Domains** in the left sidebar.
2. Click **Add Domain**.
3. Enter your domain (e.g., `surwash.ng`).
4. Choose your region (usually **US East** or **EU West**).
5. Click **Add**.

### 2b. Add the DNS Records

Resend will show you a set of DNS records to add. They typically look like this:

| Type | Name | Value |
|------|------|-------|
| `TXT` | `resend._domainkey.surwash.ng` | `p=MIGfMA0GC...` |
| `MX` | `send.surwash.ng` | `feedback-smtp.us-east-1.amazonses.com` |
| `TXT` | `send.surwash.ng` | `v=spf1 include:amazonses.com ~all` |

> ⚠️ **Copy the exact values from the Resend dashboard** — do not copy from this table, the values are unique to your account.

**Where to add these records:**
- If your domain is managed on **Cloudflare**: Go to DNS → Add Record
- If on **Namecheap**: Go to Advanced DNS → Add a new record
- If on **GoDaddy**: Go to DNS → Add Record

### 2c. Wait for Verification

DNS propagation takes **a few minutes to 24 hours**. Click **Verify** in the Resend dashboard when you're ready. You'll see a green ✅ next to each record when it's confirmed.

---

## Step 3 — Generate Your API Key

1. In the Resend dashboard, go to **API Keys** in the left sidebar.
2. Click **Create API Key**.
3. Give it a name (e.g., `surwash-contact-form`).
4. Set permission to **Sending access** only (never Full Access for client-facing keys).
5. Click **Add** and **copy the key immediately** — you won't see it again.

Your key will look like:

```
re_UJja2ZYF_EeZkcxiwYbCQwaQqNDJnYouh
```

> 🔐 **Never commit this key to Git.** It goes only in `.env.local` which is `.gitignore`d.

---

## Step 4 — Create an Audience (Optional but Recommended)

An **Audience** is a contact list in Resend. Adding form submitters to an audience lets you:
- Track who has contacted you
- Send follow-up newsletters to them later
- Manage unsubscribes automatically

### To create one:

1. In the dashboard, go to **Audiences** → **Create Audience**.
2. Name it something like `Website Contacts` or `Surwash Newsletter`.
3. After creating it, click on the audience and **copy the Audience ID** from the URL or settings panel.

It will look like: `07f8d6b8-919e-4a66-81f7-7428579ca5b8`

---

## Step 5 — Configure Environment Variables

In the **root of your Next.js project**, open (or create) `.env.local` and add:

```env
# ──────────────────────────────────────────────────────
# Resend Email Integration
# ──────────────────────────────────────────────────────

# Your Resend API key (from Step 3)
RESEND_API_KEY=re_UJja2ZYF_EeZkcxiwYbCQwaQqNDJnYouh

# The Audience ID your contacts will be added to (from Step 4)
RESEND_AUDIENCE_ID=07f8d6b8-919e-4a66-81f7-7428579ca5b8

# The "From" address — must use a verified domain (from Step 2)
RESEND_FROM_EMAIL=newsletter@surwash.ng

# The email address that RECEIVES the contact form messages
CONTACT_RECIPIENT_EMAIL=hello@surwash.ng
```

> 📝 `RESEND_FROM_EMAIL` is the **sender** address (what appears in the "From" field).
> `CONTACT_RECIPIENT_EMAIL` is **your inbox** — where the visitor's message lands.

> ⚠️ After editing `.env.local`, **restart your dev server** (`Ctrl+C` then `npm run dev`) for changes to take effect.

---

## Step 6 — Install the Resend SDK

In your terminal, run:

```bash
npm install resend
```

Verify it was added to your `package.json` under `dependencies`.

---

## Step 7 — Create the Contact Form API Route

Create a new file at `app/api/contact/route.ts`:

```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. Parse the form data from the request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 2. Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 3. Data Preservation Layer — Log submission locally before calling any external API
    //    This ensures you never lose a lead even if Resend is temporarily unavailable.
    try {
      const backupDir = path.join(process.cwd(), 'data/contact-submissions');
      await fs.mkdir(backupDir, { recursive: true });
      await fs.appendFile(
        path.join(backupDir, 'submissions.log'),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          name,
          email,
          subject: subject || '(no subject)',
          message,
        }) + '\n'
      );
    } catch (logError) {
      // Non-fatal — log the error but continue
      console.error('Failed to write local backup log:', logError);
    }

    // 4. Send notification email to your inbox
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.CONTACT_RECIPIENT_EMAIL!,
      replyTo: email,                          // ← Visitor's email, so you can Reply directly
      subject: subject
        ? `[Website Contact] ${subject}`
        : `[Website Contact] New message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                       background-color: #f8fafc; padding: 24px; margin: 0;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <table width="600" border="0" cellspacing="0" cellpadding="0"
                         style="background: #ffffff; border-radius: 12px; overflow: hidden;
                                box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

                    <!-- Header -->
                    <tr>
                      <td style="background-color: #0F172A; padding: 28px 32px;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">
                          📬 New Contact Form Submission
                        </h1>
                        <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 13px;">
                          Received on ${new Date().toLocaleDateString('en-NG', {
                            weekday: 'long', year: 'numeric',
                            month: 'long', day: 'numeric'
                          })}
                        </p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding: 32px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700;
                                         text-transform: uppercase; letter-spacing: 0.08em; color: #64748B;">
                                From
                              </p>
                              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #0F172A;">
                                ${name}
                              </p>
                              <a href="mailto:${email}" style="font-size: 14px; color: #0EA5E9;">
                                ${email}
                              </a>
                            </td>
                          </tr>
                          ${subject ? `
                          <tr>
                            <td style="padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
                              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700;
                                         text-transform: uppercase; letter-spacing: 0.08em; color: #64748B;">
                                Subject
                              </p>
                              <p style="margin: 0; font-size: 15px; color: #1E293B;">${subject}</p>
                            </td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding-top: 20px;">
                              <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 700;
                                         text-transform: uppercase; letter-spacing: 0.08em; color: #64748B;">
                                Message
                              </p>
                              <div style="background: #f8fafc; border-left: 4px solid #0EA5E9;
                                          border-radius: 6px; padding: 16px 20px;">
                                <p style="margin: 0; font-size: 15px; color: #334155;
                                           line-height: 1.7; white-space: pre-wrap;">
                                  ${message}
                                </p>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <!-- Reply CTA -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0"
                               style="margin-top: 28px;">
                          <tr>
                            <td>
                              <a href="mailto:${email}?subject=Re: ${subject || 'Your message'}"
                                 style="display: inline-block; padding: 12px 24px;
                                        background-color: #0F172A; color: #ffffff;
                                        text-decoration: none; border-radius: 8px;
                                        font-size: 14px; font-weight: 600;">
                                Reply to ${name} →
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background: #f1f5f9; padding: 20px 32px;
                                  border-top: 1px solid #e2e8f0; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                          This message was submitted via the contact form on your website.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      // Always include plain-text fallback — improves deliverability
      text: `
New Contact Form Submission
===========================
From:    ${name} <${email}>
Subject: ${subject || '(none)'}
Date:    ${new Date().toISOString()}

Message:
--------
${message}

---
Reply directly to: ${email}
      `.trim(),
    });

    // 5. (Optional) Add the visitor to your Resend Audience for future newsletters
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      try {
        const nameParts = name.trim().split(' ');
        await resend.contacts.create({
          audienceId,
          email,
          firstName: nameParts[0] || name,
          lastName: nameParts.slice(1).join(' ') || '',
          unsubscribed: false,
        });
      } catch (contactError: any) {
        // Non-fatal — contact may already exist. Log and continue.
        console.error('Failed to add contact to Resend Audience:', contactError?.message);
      }
    }

    // 6. Return success
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });

  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
```

---

## Step 8 — Build the Contact Form (Frontend)

Create a client-side form component at `features/contact/components/ContactForm.tsx`:

```tsx
// features/contact/components/ContactForm.tsx
'use client';

import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed.');
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: '32px', textAlign: 'center',
        background: '#f0fdf4', borderRadius: '12px',
        border: '1px solid #86efac'
      }}>
        <p style={{ fontSize: '32px', margin: '0 0 8px 0' }}>✅</p>
        <h3 style={{ margin: '0 0 8px 0', color: '#166534' }}>Message Sent!</h3>
        <p style={{ margin: 0, color: '#166534' }}>
          Thank you for reaching out. We'll get back to you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{
            marginTop: '16px', padding: '8px 20px',
            background: '#166534', color: '#fff',
            border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontSize: '14px'
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {status === 'error' && (
        <div style={{
          padding: '12px 16px', background: '#fef2f2',
          border: '1px solid #fca5a5', borderRadius: '8px',
          color: '#991b1b', fontSize: '14px'
        }}>
          ⚠️ {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
            Full Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
            Email Address <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          placeholder="What is this regarding?"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
          Message <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message here..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '14px 28px',
          background: status === 'loading' ? '#94A3B8' : '#0F172A',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {status === 'loading' ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #CBD5E1',
  borderRadius: '8px',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};
```

Then use it on your contact page:

```tsx
// app/contact/page.tsx
import { ContactForm } from '@/features/contact/components/ContactForm';

export default function ContactPage() {
  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
        Get in Touch
      </h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>
        Have a question or want to collaborate? Fill out the form below and we'll
        get back to you as soon as possible.
      </p>
      <ContactForm />
    </main>
  );
}
```

---

## Step 9 — Test End-to-End

### Local Testing

1. Make sure your dev server is running: `npm run dev`
2. Navigate to `http://localhost:3000/contact`
3. Fill in the form and submit
4. Check your inbox (the `CONTACT_RECIPIENT_EMAIL` address) for the notification email
5. Check `data/contact-submissions/submissions.log` to confirm the local backup worked

### Quick curl Test

You can test the API route directly without a UI:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Hello from curl",
    "message": "This is a test submission."
  }'
```

Expected response:
```json
{ "success": true, "message": "Your message has been sent successfully!" }
```

---

## Best Practices & Security

| Practice | Why it Matters |
|----------|----------------|
| **Never expose `RESEND_API_KEY` client-side** | API keys in browser JS can be scraped and abused |
| **Use `replyTo: email`** | Lets you reply directly to the visitor from your email client |
| **Always include `text:` fallback** | HTML-only emails are flagged by spam filters |
| **Log submissions locally first** | Protects against data loss if Resend has an outage |
| **Validate server-side, not just client-side** | Client validation can be bypassed |
| **Add rate-limiting in production** | Prevents form spam abuse (consider `upstash/ratelimit`) |
| **Add a honeypot field** | Simple bot trap — a hidden field bots fill in but humans don't |

### Optional: Add a Honeypot Field (Anti-Spam)

In your form HTML, add a hidden field:
```html
<input name="bot-field" style="display: none" tabindex="-1" autocomplete="off" />
```

In your API route, check for it at the top:
```typescript
if (body['bot-field']) {
  // Silently drop the request — it's a bot
  return NextResponse.json({ success: true });
}
```

---

## Troubleshooting

### "Email not arriving in inbox"

- Check your **spam/junk folder** first
- Confirm the domain DNS records are all ✅ verified in the Resend dashboard
- Verify `RESEND_FROM_EMAIL` uses the **exact verified domain**
- Check `CONTACT_RECIPIENT_EMAIL` is spelled correctly in `.env.local`
- Restart the dev server after any `.env.local` changes

### "Domain not verifying"

- DNS changes can take up to **24 hours** — wait and retry
- Make sure you're adding records to the **root domain** (not a subdomain registrar)
- If using Cloudflare, set DNS-only mode (orange cloud OFF) for `TXT` records

### "400 Bad Request from API"

- Make sure you're sending `name`, `email`, and `message` in the request body
- Confirm the `Content-Type: application/json` header is set

### "500 Internal Server Error"

- Check your terminal for the error log
- Verify `RESEND_API_KEY` is correctly set and not expired
- Confirm the Resend SDK is installed: `npm install resend`

### "Contact not being added to Audience"

- Double-check `RESEND_AUDIENCE_ID` is the correct UUID (find it in Resend → Audiences)
- The contact may already exist in the audience — Resend may return an error for duplicates, but the email still sends

---

## Environment Variable Checklist

Copy this into a team onboarding doc or Notion page:

```
[ ] RESEND_API_KEY          → From: Resend Dashboard → API Keys
[ ] RESEND_AUDIENCE_ID      → From: Resend Dashboard → Audiences → [Your Audience] → ID
[ ] RESEND_FROM_EMAIL       → Must be: an address on your verified domain (e.g., newsletter@yourdomain.com)
[ ] CONTACT_RECIPIENT_EMAIL → Your inbox (e.g., hello@yourdomain.com)
```

---

*Guide maintained by the Surwash frontend team. Last updated: June 2026.*
