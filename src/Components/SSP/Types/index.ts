import { ColumnType } from 'antd/lib/table';
import { ISSPFilterQuery, ISSPQueryObject } from 'Types/SSP.type';

export type TSSPWrapperProps = {
  name: string;
  selectorFn: any;
  fetchFn: (args?: Partial<ISSPQueryObject>) => void;
  initSSPStateFn: (args?: Partial<ISSPQueryObject>) => void;
  initialFilters?: Partial<ISSPFilterQuery>;
  fetchFilterLookupsFn?: (args?: any) => void;
};

export interface ISSPColumn extends ColumnType<any> {
  width?: number;
}

/** Describes filters */
export interface FilterObject {
  /** An entry will either be a leaf (string array) or a nested object */
  [key: string]: string[] | FilterObject;
}
