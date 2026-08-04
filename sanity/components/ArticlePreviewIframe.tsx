import React, { useState } from 'react';
import { Card, Flex, Button, Text, Box } from '@sanity/ui';

interface ArticlePreviewIframeProps {
  document: {
    displayed: {
      _id?: string;
      slug?: { current?: string };
    };
  };
}

export function ArticlePreviewIframe(props: ArticlePreviewIframeProps) {
  const { displayed } = props.document;
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  if (!displayed?._id) {
    return (
      <Box padding={4}>
        <Text muted size={1}>Save the article first to view the live preview.</Text>
      </Box>
    );
  }

  const cleanId = displayed._id;
  const secret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || 'surwash-preview-secret-2026';
  const previewUrl = `/newsletter/preview/${encodeURIComponent(cleanId)}?secret=${secret}`;

  return (
    <Flex direction="column" style={{ height: '100%', width: '100%', backgroundColor: '#F8FAFC' }}>
      {/* Viewport Control Bar */}
      <Card padding={3} borderBottom style={{ backgroundColor: '#1A3A5C', color: '#ffffff' }}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <Text size={1} weight="bold" style={{ color: '#ffffff' }}>
              Live Draft Preview
            </Text>
            <Text size={1} style={{ color: '#94A3B8' }}>
              (Live Next.js Render)
            </Text>
          </Flex>
          <Flex gap={2}>
            <Button
              size={1}
              mode={viewport === 'desktop' ? 'default' : 'ghost'}
              tone={viewport === 'desktop' ? 'primary' : 'default'}
              onClick={() => setViewport('desktop')}
              text="💻 Desktop"
              style={{ cursor: 'pointer' }}
            />
            <Button
              size={1}
              mode={viewport === 'mobile' ? 'default' : 'ghost'}
              tone={viewport === 'mobile' ? 'primary' : 'default'}
              onClick={() => setViewport('mobile')}
              text="📱 Mobile (375px)"
              style={{ cursor: 'pointer' }}
            />
          </Flex>
        </Flex>
      </Card>

      {/* Frame Container */}
      <Flex flex={1} align="center" justify="center" style={{ overflow: 'auto', padding: viewport === 'mobile' ? '24px' : '0' }}>
        <div
          style={{
            width: viewport === 'desktop' ? '100%' : '375px',
            height: viewport === 'desktop' ? '100%' : '667px',
            maxWidth: '100%',
            maxHeight: '100%',
            transition: 'all 0.3s ease-in-out',
            borderRadius: viewport === 'mobile' ? '16px' : '0',
            boxShadow: viewport === 'mobile' ? '0 20px 25px -5px rgba(0,0,0,0.3)' : 'none',
            overflow: 'hidden',
            border: viewport === 'mobile' ? '8px solid #0F172A' : 'none',
            backgroundColor: '#ffffff',
          }}
        >
          <iframe
            src={previewUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="SURWASH Draft Preview"
          />
        </div>
      </Flex>
    </Flex>
  );
}

export default ArticlePreviewIframe;
