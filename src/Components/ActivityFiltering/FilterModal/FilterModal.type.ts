import { ReactNode } from 'react';

export interface FilterItem {
  label: string;
  title: string;
  name: string;
  parent?: string;
  render: (options?: SelectOption[]) => ReactNode | Element;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface ItemsMapping {
  [key: string]: FilterItem;
}
