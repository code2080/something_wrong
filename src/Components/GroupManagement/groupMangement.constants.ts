export type AllocationStatus = 1 | 0 | -1;
export const allocationStatusMapping = {
  '1': {
    label: 'ALLOCATED',
    color: 'success',
  },
  '-1': {
    label: 'ALLOCATION FAILED',
    color: 'error',
  },
  '0': {
    label: 'NOT ALLOCATED',
    color: 'default',
  },
};
