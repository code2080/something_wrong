export const formStatus = {
  ACTIVE: 'FORM_STATUS_ACTIVE',
  DRAFT: 'FORM_STATUS_DRAFT',
  COMPLETED: 'FORM_STATUS_COMPLETED',
  ARCHIVED: 'FORM_STATUS_ARCHIVED',
};

export const formStatusProps = {
  [formStatus.ACTIVE]: {
    label: 'Active',
    color: 'warning',
  },
  [formStatus.DRAFT]: {
    label: 'Draft',
    color: 'success',
  },
  [formStatus.COMPLETED]: {
    label: 'Completed',
    color: 'success',
  },
  [formStatus.ARCHIVED]: {
    label: 'Archived',
    color: 'attention',
  },
};
