import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { SendEmailBlastAction } from './sanity/actions/SendEmailBlastAction';
import { SurwashLogo } from './sanity/components/SurwashLogo';
import { ApprovalStatusBadge } from './sanity/components/ApprovalStatusBadge';

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
  basePath: '/login',

  icon: SurwashLogo,
  theme: surwashTheme,

  auth: {
    loginMethod: 'signUp' as any,
    providers: (prev) => prev.filter((provider) => provider.name !== 'github'),
  },
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('SURWASH Feed Archive')
          .items([
            S.documentTypeListItem('newsletterEdition').title('Newsletter Editions'),
            S.divider(),
            
            // Articles Grouped by State collapsible list
            S.listItem()
              .title('Articles by State')
              .child(
                S.list()
                  .title('Filter by State Scope')
                  .items([
                    S.listItem()
                      .title('Federal / National')
                      .child(
                        S.documentList()
                          .title('Federal / National')
                          .filter('_type == "post" && stateScope == "federal"')
                      ),
                    S.listItem()
                      .title('Abuja (FCT)')
                      .child(
                        S.documentList()
                          .title('Abuja (FCT)')
                          .filter('_type == "post" && stateScope == "abuja"')
                      ),
                    S.listItem()
                      .title('Plateau State')
                      .child(
                        S.documentList()
                          .title('Plateau State')
                          .filter('_type == "post" && stateScope == "plateau"')
                      ),
                    S.listItem()
                      .title('Katsina State')
                      .child(
                        S.documentList()
                          .title('Katsina State')
                          .filter('_type == "post" && stateScope == "katsina"')
                      ),
                    S.listItem()
                      .title('Gombe State')
                      .child(
                        S.documentList()
                          .title('Gombe State')
                          .filter('_type == "post" && stateScope == "gombe"')
                      ),
                    S.listItem()
                      .title('Kaduna State')
                      .child(
                        S.documentList()
                          .title('Kaduna State')
                          .filter('_type == "post" && stateScope == "kaduna"')
                      ),
                    S.listItem()
                      .title('Ekiti State')
                      .child(
                        S.documentList()
                          .title('Ekiti State')
                          .filter('_type == "post" && stateScope == "ekiti"')
                      ),
                    S.listItem()
                      .title('Imo State')
                      .child(
                        S.documentList()
                          .title('Imo State')
                          .filter('_type == "post" && stateScope == "imo"')
                      ),
                    S.listItem()
                      .title('Delta State')
                      .child(
                        S.documentList()
                          .title('Delta State')
                          .filter('_type == "post" && stateScope == "delta"')
                      ),
                    S.listItem()
                      .title('Abia State')
                      .child(
                        S.documentList()
                          .title('Abia State')
                          .filter('_type == "post" && stateScope == "abia"')
                      ),
                    S.listItem()
                      .title('Bauchi State')
                      .child(
                        S.documentList()
                          .title('Bauchi State')
                          .filter('_type == "post" && stateScope == "bauchi"')
                      ),
                    S.listItem()
                      .title('Benue State')
                      .child(
                        S.documentList()
                          .title('Benue State')
                          .filter('_type == "post" && stateScope == "benue"')
                      ),
                    S.listItem()
                      .title('Taraba State')
                      .child(
                        S.documentList()
                          .title('Taraba State')
                          .filter('_type == "post" && stateScope == "taraba"')
                      ),
                    S.listItem()
                      .title('Ogun State')
                      .child(
                        S.documentList()
                          .title('Ogun State')
                          .filter('_type == "post" && stateScope == "ogun"')
                      ),
                    S.listItem()
                      .title('Jigawa State')
                      .child(
                        S.documentList()
                          .title('Jigawa State')
                          .filter('_type == "post" && stateScope == "jigawa"')
                      ),
                  ])
              ),
            
            S.documentTypeListItem('post').title('All Articles'),
            S.divider(),
            
            S.documentTypeListItem('emailBlast').title('Email Blasts'),
            S.documentTypeListItem('page').title('Custom Pages'),
          ])
    }),
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
    badges: (prev, context) => {
      if (context.schemaType === 'post') {
        return [...prev, ApprovalStatusBadge];
      }
      return prev;
    },
  },
});
