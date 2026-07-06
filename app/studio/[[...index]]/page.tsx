import type { Metadata, Viewport } from 'next';
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio';
import { Studio } from './Studio';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'SURWASH Newsletter Feed Archive - Studio',
};

export const viewport: Viewport = {
  ...studioViewport,
  viewportFit: studioViewport.viewportFit as 'auto' | 'contain' | 'cover' | undefined,
  interactiveWidget: 'resizes-content',
};

export default function StudioPage() {
  return <Studio />;
}
