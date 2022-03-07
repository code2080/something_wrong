import { ColumnType } from "antd/lib/table";
import { ISSPQueryObject } from "Types/SSP.type";

export type TSSPWrapperProps = {
  name: string;
  selectorFn: any;
  fetchFn: (args?: Partial<ISSPQueryObject>) => void;
  fetchFilterLookupsFn?: (args?: any) => void;
}

export interface ISSPColumn extends ColumnType<any> {
  width?: number;
};