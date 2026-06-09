import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Newsletter Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
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
      name: 'edition',
      title: 'Newsletter Edition',
      type: 'reference',
      to: [{ type: 'newsletterEdition' }],
      description: 'Link this article to its Newsletter Edition for grouped homepage display.',
    }),
    defineField({
      name: 'stateScope',
      title: 'State / Region',
      type: 'string',
      options: {
        list: [
          { title: 'Federal / National', value: 'federal' },
          { title: 'Abuja (FCT)', value: 'abuja' },
          { title: 'Plateau State', value: 'plateau' },
          { title: 'Katsina State', value: 'katsina' },
          { title: 'Gombe State', value: 'gombe' },
          { title: 'Kaduna State', value: 'kaduna' },
          { title: 'Ekiti State', value: 'ekiti' },
          { title: 'Imo State', value: 'imo' },
          { title: 'Delta State', value: 'delta' },
          { title: 'Abia State', value: 'abia' },
          { title: 'Bauchi State', value: 'bauchi' },
          { title: 'Benue State', value: 'benue' },
          { title: 'Taraba State', value: 'taraba' },
          { title: 'Ogun State', value: 'ogun' },
          { title: 'Jigawa State', value: 'jigawa' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'postType',
      title: 'Article Category',
      type: 'string',
      options: {
        list: [
          { title: 'Programme Overview', value: 'programme_overview' },
          { title: 'Leadership Message', value: 'leadership_message' },
          { title: 'State Spotlight', value: 'state_spotlight' },
          { title: 'Community / Human Interest', value: 'community' },
          { title: 'Forward Look / Updates', value: 'forward_look' },
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
      description: 'When enabled, this article displays as the featured spotlight on the newsletter homepage.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover / Banner Image',
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
      title: 'Excerpt / SEO Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(160),
      description: 'A short summary of the article (160 characters max). Shown on article cards and search results.',
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
      edition: 'edition.title',
      media: 'mainImage',
    },
    prepare({ title, edition, media }) {
      return {
        title: title,
        subtitle: edition ? `Edition: ${edition}` : 'No edition linked',
        media: media,
      };
    },
  },
});
