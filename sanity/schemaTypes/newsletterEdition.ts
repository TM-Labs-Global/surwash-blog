import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'newsletterEdition',
  title: 'Newsletter Edition',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Edition Title',
      type: 'string',
      description: 'e.g. "March – April 2026"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Auto-generated from the title. Used in the edition landing page URL.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'theme',
      title: 'Edition Theme',
      type: 'string',
      description: 'e.g. "Re-introducing SURWASH" — the narrative focus of this edition.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'themeDescription',
      title: 'Theme Description',
      type: 'text',
      rows: 3,
      description: 'A short paragraph introducing the theme of this edition (shown on the homepage edition block).',
    }),
    defineField({
      name: 'month',
      title: 'Edition Month (for sorting)',
      type: 'date',
      description: 'Set to the first day of the edition period (e.g. 2026-03-01 for March–April). Used for chronological ordering.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'editionNumber',
      title: 'Edition Number',
      type: 'number',
      description: 'e.g. 1 for the maiden edition.',
      validation: Rule => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Edition Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the cover image for accessibility and SEO.',
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      theme: 'theme',
      editionNumber: 'editionNumber',
      media: 'coverImage',
    },
    prepare({ title, theme, editionNumber, media }) {
      return {
        title: `Edition ${editionNumber}: ${title}`,
        subtitle: theme,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'monthDesc',
      by: [{ field: 'month', direction: 'desc' }],
    },
    {
      title: 'Edition Number',
      name: 'editionNumberDesc',
      by: [{ field: 'editionNumber', direction: 'desc' }],
    },
  ],
});
