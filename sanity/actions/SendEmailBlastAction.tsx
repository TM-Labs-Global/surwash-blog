import React, { useState, useEffect } from 'react';
import { useClient } from 'sanity';
import { Box, Stack, Card, Text, Button, Spinner, TextInput, Flex } from '@sanity/ui';

export function SendEmailBlastAction(props: any) {
  const { id, type, published, draft, onComplete } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [editionData, setEditionData] = useState<any>(null);
  const [confirmText, setConfirmText] = useState('');

  const client = useClient({ apiVersion: '2023-05-03' });

  // Use the active version (published or draft) of the campaign document
  const targetDoc = published || draft;

  // Load target edition metadata and linked articles when dialog opens
  useEffect(() => {
    if (dialogOpen && targetDoc?._id) {
      setLoading(true);
      
      // Fetch the emailBlast details, dereferencing the linked edition and fetching its articles
      const query = `*[_type == "emailBlast" && _id == $blastId][0] {
        _id,
        title,
        status,
        sentAt,
        edition-> {
          _id,
          title,
          theme,
          "posts": *[_type == "post" && edition._ref == ^._id] | order(publishedAt asc, _createdAt asc) {
            _id,
            title,
            postType
          }
        }
      }`;

      client.fetch(query, { blastId: targetDoc._id })
        .then((res) => {
          if (res?.edition) {
            setEditionData(res.edition);
          } else {
            setEditionData(null);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch edition and articles for email blast:', err);
          setLoading(false);
        });
    }
  }, [dialogOpen, targetDoc?._id, client]);

  // If the document is not saved/pushed at all, disable the action
  if (!targetDoc) {
    return {
      label: 'Send Email Blast',
      title: 'You must save this email blast campaign before sending.',
      disabled: true,
    };
  }

  const handleSend = async () => {
    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const token = process.env.SANITY_STUDIO_EMAIL_BLAST_SECRET;
      if (!token) {
        console.warn('SANITY_STUDIO_EMAIL_BLAST_SECRET is not configured. Handshake with Next.js API will fail.');
      }
      
      // Development vs Production API URL resolution
      const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        
      const apiBase = isLocalhost
        ? 'http://localhost:3000'
        : 'https://newsletter.surwash.ng';

      const response = await fetch(`${apiBase}/api/blast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          blastId: targetDoc._id,
        }),
      });

      const contentType = response.headers.get('content-type');
      let data: any = {};
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        throw new Error(`Server returned non-JSON response (status ${response.status}): ${textResponse.slice(0, 150)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger dispatch.');
      }

      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred during dispatch.');
    } finally {
      setLoading(false);
    }
  };

  const expectedConfirmText = targetDoc.title ? targetDoc.title.trim() : '';
  const isConfirmed = confirmText.trim().toLowerCase() === expectedConfirmText.toLowerCase();
  const articles = editionData?.posts || [];
  const isAlreadySent = targetDoc.status === 'sent';

  return {
    label: isAlreadySent ? 'Resend Email Blast' : 'Send Email Blast',
    title: isAlreadySent ? 'Resend this email campaign' : 'Trigger this email campaign to stakeholders',
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen && {
      type: 'dialog' as const,
      header: isAlreadySent ? 'Resend Email Campaign' : 'Trigger Email Campaign',
      onClose: () => {
        setDialogOpen(false);
        onComplete();
      },
      content: (
        <Box padding={4}>
          {status === 'success' ? (
            <Stack space={4}>
              <Card padding={4} tone="positive" radius={2}>
                <Text weight="bold" size={2}>Email Blast Triggered Successfully!</Text>
              </Card>
              <Text size={1} muted>
                The Next.js api dispatch is complete. Resend is now sending the email digest to your stakeholder list. The dispatch status of this campaign has been set to SENT.
              </Text>
              <Button mode="ghost" onClick={() => { setDialogOpen(false); onComplete(); }} text="Close Window" />
            </Stack>
          ) : (
            <Stack space={4}>
              <Text size={2}>
                You are preparing to send the email campaign: **{targetDoc.title}**
              </Text>

              {isAlreadySent && (
                <Card padding={3} tone="caution" radius={2}>
                  <Text size={1} weight="bold" style={{ color: '#D97706' }}>
                    Warning: This campaign was already sent on {targetDoc.sentAt ? new Date(targetDoc.sentAt).toLocaleString() : 'a previous date'}.
                  </Text>
                </Card>
              )}

              {loading ? (
                <Flex align="center" justify="center" padding={4}>
                  <Spinner muted />
                  <Box marginLeft={2}><Text size={1}>Loading campaign details...</Text></Box>
                </Flex>
              ) : (
                <Stack space={3}>
                  {editionData ? (
                    <>
                      <Text size={1}>
                        Target Edition: **{editionData.title}** (Theme: *{editionData.theme}*)
                      </Text>
                      <Text size={1} weight="bold">Included Articles ({articles.length}):</Text>
                      <Card border padding={3} radius={2}>
                        <Stack space={2}>
                          {articles.map((art: any, idx: number) => {
                            const displayType = art.postType
                              .split('_')
                              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
                            return (
                              <Text key={art._id} size={1}>
                                {idx + 1}. <span style={{ color: '#0EA5E9', fontWeight: 'bold' }}>[{displayType}]</span> {art.title}
                              </Text>
                            );
                          })}
                          {articles.length === 0 && (
                            <Text size={1} style={{ color: '#E11D48' }} weight="bold">
                              Warning: No articles are linked to the selected newsletter edition yet.
                            </Text>
                          )}
                        </Stack>
                      </Card>
                    </>
                  ) : (
                    <Card padding={3} tone="critical" radius={2}>
                      <Text size={1} weight="bold" style={{ color: '#E11D48' }}>
                        Error: No newsletter edition has been linked to this email campaign. Please select one.
                      </Text>
                    </Card>
                  )}
                </Stack>
              )}

              {status === 'error' && (
                <Card padding={3} tone="critical" radius={2}>
                  <Text size={1} style={{ color: '#E11D48' }} weight="bold">Dispatch Error: {errorMessage}</Text>
                </Card>
              )}

              <Stack space={2}>
                <Text size={1} weight="bold">
                  To confirm sending, please type the campaign name: <span style={{ textDecoration: 'underline' }}>{expectedConfirmText}</span>
                </Text>
                <TextInput
                  placeholder={`Type "${expectedConfirmText}"`}
                  value={confirmText}
                  onChange={(event: React.FormEvent<HTMLInputElement>) => setConfirmText(event.currentTarget.value)}
                />
              </Stack>

              <Flex gap={2} justify="flex-end">
                <Button
                  mode="ghost"
                  onClick={() => { setDialogOpen(false); onComplete(); }}
                  text="Cancel"
                  disabled={loading}
                />
                <Button
                  tone="critical"
                  onClick={handleSend}
                  text={loading ? 'Triggering...' : isAlreadySent ? 'Resend Blast Now' : 'Send Email Blast Now'}
                  disabled={!isConfirmed || loading || !editionData || articles.length === 0}
                />
              </Flex>
            </Stack>
          )}
        </Box>
      ),
    },
  };
}
