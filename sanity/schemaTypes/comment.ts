import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'comment',
  title: 'Blog Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Commenter Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Optional — stored privately for admin reference, never displayed publicly.',
      validation: Rule =>
        Rule.custom(email => {
          if (!email) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? true : 'Invalid email address';
        }),
    }),
    defineField({
      name: 'comment',
      title: 'Comment Text',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required().min(2).max(1000),
    }),
    defineField({
      name: 'post',
      title: 'Blog Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Approved for Public Display',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to true when comment is reviewed and ready to display publicly.',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      approved: 'approved',
      postTitle: 'post.title',
    },
    prepare({ name, approved, postTitle }) {
      const status = approved ? '✅ Approved' : '⏳ Awaiting Review';
      return {
        title: `${name}: "${postTitle}"`,
        subtitle: status,
      };
    },
  },
});
