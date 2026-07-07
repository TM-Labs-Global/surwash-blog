import React from 'react';
import { Card, Text, Heading, Stack } from '@sanity/ui';

export function PublishingGuidelines() {
  return (
    <Card padding={4} radius={2} shadow={1} tone="neutral" border style={{ marginBottom: '16px' }}>
      <Stack space={3}>
        <Heading size={1} style={{ color: '#1B9FD4', fontWeight: 'bold' }}>SURWASH Comms Publishing Rules</Heading>
        <Text size={1} weight="semibold">Please observe the following guidelines when drafting updates:</Text>
        <Stack space={2}>
          <Text size={1}>• <strong>Newsletter Edition:</strong> Every article must be linked to its corresponding edition period.</Text>
          <Text size={1}>• <strong>State Scope:</strong> Choose the primary state matching the WASH intervention.</Text>
          <Text size={1}>• <strong>Images:</strong> Every inline image must have a descriptive alternative text (SEO/Accessibility) and caption.</Text>
          <Text size={1}>• <strong>Workflow Status:</strong> Transition the approval status to <em>&quot;Ready for Abuja Review&quot;</em> when you finish writing. Only approved articles will display on the public website.</Text>
        </Stack>
      </Stack>
    </Card>
  );
}
export default PublishingGuidelines;
