export const REPLACED_KEY = '____';
export const CUSTOM_RENDERED_FILTER_PROPERTIES_OPTIONS: Record<
  string,
  string
>[] = [
  { value: 'date', label: 'Date interval' },
  // { value: 'time', label: 'Time' }, // Removed until we have a reasonable use case for it
  { value: 'status', label: 'Status' },
];
export const NESTED_FILTER_PROPERTIES = ['objects', 'objectFilters', 'fields'];

export const FIXED_FILTER_PROPERTIES_ARR = [
  'submitter',
  'tag',
  'primaryObject',
  'status',
  'weekPatternUID',
];
