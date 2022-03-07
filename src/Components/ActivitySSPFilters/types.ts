import { ReactNode } from 'react';

export interface TFilterItem {
  label: string;
  title: string;
  name: string;
  parent?: string;
  render: (options?: Record<string, string>[]) => ReactNode | Element;
}

export interface TFilterItemsMapping {
  [key: string]: TFilterItem;
}
