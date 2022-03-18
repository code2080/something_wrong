export enum EFormStatus {
  ACTIVE = 'FORM_STATUS_ACTIVE',
  DRAFT = 'FORM_STATUS_DRAFT',
  COMPLETED = 'FORM_STATUS_COMPLETED',
  ARCHIVED = 'FORM_STATUS_ARCHIVED',
}

export const CFormStatusProps = {
  [EFormStatus.ACTIVE]: {
    label: 'Active',
    color: 'warning',
  },
  [EFormStatus.DRAFT]: {
    label: 'Draft',
    color: 'success',
  },
  [EFormStatus.COMPLETED]: {
    label: 'Completed',
    color: 'success',
  },
  [EFormStatus.ARCHIVED]: {
    label: 'Archived',
    color: 'attention',
  },
};
