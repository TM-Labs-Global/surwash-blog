import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { SendEmailBlastAction } from './sanity/actions/SendEmailBlastAction';

export default defineConfig({
  name: 'SURWASH_Blog_Platform',
  title: 'SURWASH Blog',
  projectId: '0qnyls1e',
  dataset: 'production',
  
  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'emailBlast') {
        return [...prev, SendEmailBlastAction];
      }
      return prev;
    },
  },
});
