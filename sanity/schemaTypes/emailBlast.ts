import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'emailBlast',
  title: 'Email Blast',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Blast Campaign Name',
      type: 'string',
      description: 'e.g. "Maiden Edition — Stakeholder Broadcast" or "Plateau State Spotlight Campaign"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'edition',
      title: 'Target Newsletter Edition',
      type: 'reference',
      to: [{ type: 'newsletterEdition' }],
      description: 'Select the newsletter edition whose articles and metadata will be included in this blast.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subject',
      title: 'Email Subject Line',
      type: 'string',
      description: 'The subject line of the email in the inbox. If left blank, it will fallback to "SURWASH Newsletter: [Edition Title] — [Theme]"',
    }),
    defineField({
      name: 'preheader',
      title: 'Email Preheader (Inbox Preview)',
      type: 'string',
      description: 'The short preview text that appears next to the subject line in email clients.',
      validation: Rule => Rule.max(150),
    }),
    defineField({
      name: 'welcomeMessage',
      title: 'Email Welcome Message',
      type: 'text',
      rows: 5,
      description: 'The greeting and introductory message that appears at the top of the email blast (above the articles).',
    }),
    defineField({
      name: 'status',
      title: 'Dispatch Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft / Ready to Send', value: 'draft' },
          { title: 'Sent successfully', value: 'sent' },
        ],
        layout: 'radio',
      },
      readOnly: true,
    }),
    defineField({
      name: 'sentAt',
      title: 'Sent Date & Time',
      type: 'datetime',
      readOnly: true,
      description: 'This timestamp is automatically set by the system when the email blast is executed.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      editionTitle: 'edition.title',
      status: 'status',
      sentAt: 'sentAt',
    },
    prepare({ title, editionTitle, status, sentAt }) {
      const formattedDate = sentAt ? new Date(sentAt).toLocaleString() : '';
      const displayStatus = status === 'sent' ? 'SENT' : 'DRAFT';
      return {
        title: title,
        subtitle: `Edition: ${editionTitle || 'Not Selected'} | Status: ${displayStatus}${formattedDate ? ` on ${formattedDate}` : ''}`,
      };
    },
  },
});
