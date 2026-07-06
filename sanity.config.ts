import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { SendEmailBlastAction } from './sanity/actions/SendEmailBlastAction';
import { SurwashLogo } from './sanity/components/SurwashLogo';

const surwashTheme = buildLegacyTheme({
  /* Base theme colors */
  '--black': '#1A3A5C',
  '--white': '#ffffff',

  /* Brand */
  '--brand-primary': '#1B9FD4',

  /* Navbar */
  '--main-navigation-color': '#1A3A5C',
  '--main-navigation-color--inverted': '#ffffff',

  /* Focus color */
  '--focus-color': '#1B9FD4',
});

export default defineConfig({
  name: 'default',
  title: 'SURWASH Newsletter Feed Archive',
  projectId: '0qnyls1e',
  dataset: 'production',
  basePath: '/studio',

  icon: SurwashLogo,
  theme: surwashTheme,
  
  plugins: [
    structureTool(),
    visionTool(),
  ],

  // Hide the developer "Vision" tab/tool from users who are not admin or developer (e.g. Editor role)
  tools: (prev, { currentUser }) => {
    const isAdminOrDev = currentUser?.roles.some(
      (role) => role.name === 'administrator' || role.name === 'developer'
    );
    if (!isAdminOrDev) {
      return prev.filter((tool) => tool.name !== 'vision');
    }
    return prev;
  },

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

