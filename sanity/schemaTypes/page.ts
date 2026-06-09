import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'page',
  title: 'Custom Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      description: 'Add one or more content sections. Each section has an optional title and a rich-text body.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pageSection',
          title: 'Section',
          fields: [
            defineField({
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              description: 'Optional. Displayed as a heading above this section\'s content.',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'blockContent',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'sectionTitle' },
            prepare: ({ title }) => ({
              title: title || '(Untitled Section)',
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'showInTicker',
      title: 'Show in Homepage Ticker',
      type: 'boolean',
      description: 'When enabled, this page will appear as a featured link in the scrolling marquee on the homepage.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title: title,
        subtitle: slug ? `/${slug}` : '',
      };
    },
  },
});
