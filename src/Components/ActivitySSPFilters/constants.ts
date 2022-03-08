export const REPLACED_KEY = '____';
export const CUSTOM_RENDERED_FILTER_PROPERTIES_OPTIONS: Record<
  string,
  string
>[] = [
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'status', label: 'Status' },
];
export const NESTED_FILTER_PROPERTIES = ['objects', 'objectFilters', 'fields'];

// TODO: Rename?
export const FIXED_FILTER_PROPERTIES_ARR = [
  'submitter',
  'tag',
  'primaryObject',
  'status',
];
