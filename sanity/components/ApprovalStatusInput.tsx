import React from 'react';
import { StringInputProps, useCurrentUser, set, unset } from 'sanity';
import { Radio, Stack, Flex, Text, Card } from '@sanity/ui';
import { isAdminEmail } from '../lib/auth';

export function ApprovalStatusInput(props: StringInputProps) {
  const currentUser = useCurrentUser();
  const isAdmin = isAdminEmail(currentUser?.email);

  const options = [
    { title: 'Draft', value: 'draft' },
    { title: 'Ready for Abuja Review', value: 'review' },
    ...(isAdmin ? [{ title: 'Approved by Head of Comms', value: 'approved' }] : []),
  ];

  const value = props.value || 'draft';

  const handleChange = (newValue: string) => {
    props.onChange(newValue ? set(newValue) : unset());
  };

  return (
    <Stack space={3}>
      <Card padding={3} border radius={2}>
        <Stack space={3}>
          {options.map((opt) => {
            const isChecked = value === opt.value;
            const isApprovedOpt = opt.value === 'approved';
            return (
              <Flex key={opt.value} align="center" gap={3}>
                <Radio
                  id={`approvalStatus-${opt.value}`}
                  name="approvalStatus"
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => handleChange(opt.value)}
                  disabled={props.readOnly}
                />
                <Text
                  as="label"
                  htmlFor={`approvalStatus-${opt.value}`}
                  size={1}
                  weight={isChecked ? 'bold' : 'regular'}
                  style={{
                    color: isApprovedOpt ? '#2E8B4A' : '#1A3A5C',
                    cursor: 'pointer',
                  }}
                >
                  {opt.title}
                </Text>
              </Flex>
            );
          })}
        </Stack>
      </Card>
      {!isAdmin && (
        <Text size={1} muted>
          Note: Final approval is restricted to the Head of Communications (Abuja).
        </Text>
      )}
    </Stack>
  );
}
