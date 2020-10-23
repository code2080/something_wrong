export const formInstanceStatusTypes = {
  SENT: 'SENT',
  OPENED: 'OPENED',
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  OVERDUE: 'OVERDUE',
  INVALIDATE: 'INVALIDATE',
  DECLINED: 'DECLINED',
};

export const formInstanceStatusTypeMap = {
  [formInstanceStatusTypes.SENT]: {
    value: formInstanceStatusTypes.SENT,
    label: 'Sent',
    color: 'success',
  },
  [formInstanceStatusTypes.OPENED]: {
    value: formInstanceStatusTypes.OPENED,
    label: 'Opened',
    color: 'success',
  },
  [formInstanceStatusTypes.DRAFT]: {
    value: formInstanceStatusTypes.DRAFT,
    label: 'Draft saved',
    color: 'success',
  },
  [formInstanceStatusTypes.SUBMITTED]: {
    value: formInstanceStatusTypes.SUBMITTED,
    label: 'Submitted',
    color: 'success',
  },
  [formInstanceStatusTypes.OVERDUE]: {
    value: formInstanceStatusTypes.OVERDUE,
    label: 'Overdue',
    color: 'attention',
  },
  [formInstanceStatusTypes.INVALIDATE]: {
    value: formInstanceStatusTypes.INVALIDATE,
    label: 'Invalidated',
    color: 'attention',
  },
};
