import { DocumentBadgeComponent } from 'sanity';

export const ApprovalStatusBadge: DocumentBadgeComponent = (props) => {
  const status = (props.draft as any)?.approvalStatus || (props.published as any)?.approvalStatus || 'draft';
  
  let label = 'Draft';
  let color: 'success' | 'warning' | 'primary' | 'danger' = 'warning';
  
  if (status === 'review') {
    label = 'Ready for Abuja Review';
    color = 'primary';
  } else if (status === 'approved') {
    label = 'Approved';
    color = 'success';
  }

  return {
    label,
    title: `Approval Status: ${label}`,
    color,
  };
};
