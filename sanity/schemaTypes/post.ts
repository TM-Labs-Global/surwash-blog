import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'SURWASH Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
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
      name: 'stateScope',
      title: 'Target State Region',
      type: 'string',
      options: {
        list: [
          { title: 'Federal / National', value: 'federal' },
          { title: 'Abuja (FCT)', value: 'abuja' },
          { title: 'Lagos State', value: 'lagos' },
          { title: 'Kano State', value: 'kano' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'postType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Press Release', value: 'press_release' },
          { title: 'News Update', value: 'news_update' },
          { title: 'Field Report', value: 'field_report' },
          { title: 'Policy Brief', value: 'policy_brief' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature as Hero Post',
      type: 'boolean',
      initialValue: false,
      description: 'When enabled, this post displays as the featured spotlight on the blog homepage.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Rich Body Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(160),
      description: 'Summarize the post in 160 characters max for search engine listings.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      stateScope: 'stateScope',
      media: 'mainImage',
    },
    prepare({ title, stateScope, media }) {
      return {
        title: title,
        subtitle: stateScope,
        media: media,
      };
    },
  },
});
