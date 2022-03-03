import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { usePrevious } from './usePrevious';
import { IndexedObject } from 'Redux/ObjectRequests/ObjectRequests.types';

export interface TablePagination {
  current: number;
  pageSize: number;
  filter?: IndexedObject;
}
export interface TableSorting {
  order?: string;
  orderBy?: string;
}

const INITIAL_PAGINATION: TablePagination = {
  current: 1,
  pageSize: 10,
};

const INITIAL_SORTING: TableSorting = {
  order: undefined,
  orderBy: undefined,
};
export interface TableDetails {
  pagination: TablePagination;
}
interface Props {
  onChangeCallback: (
    pagination: TablePagination,
    filter?: IndexedObject,
  ) => void;
}
export const usePaginationAndSorting = (props: Props) => {
  const { onChangeCallback } = props;
  const [forceUpdate, setForceUpdate] = useState(false);
  const [pagination, setPagination] =
    useState<TablePagination>(INITIAL_PAGINATION);
  const [sorting, setSorting] = useState<TableSorting>(INITIAL_SORTING);
  const prevPagination = usePrevious(pagination);
  const prevSorting = usePrevious(sorting);

  useEffect(() => {
    if (
      !isEqual(pagination, prevPagination) ||
      !isEqual(sorting, prevSorting) ||
      forceUpdate
    ) {
      onChangeCallback({ ...pagination, ...sorting });
      setForceUpdate(false);
    }
  }, [
    onChangeCallback,
    pagination,
    prevPagination,
    sorting,
    prevSorting,
    forceUpdate,
  ]);

  return {
    pagination,
    sorting,
    onSortingChange: (order, orderBy) => {
      setSorting({ order, orderBy });
    },
    onChange: (current, pageSize) => {
      setPagination({ current, pageSize });

      // const { current, pageSize } = obj;
      // setPagination({
      //   ...pagination,
      //   current,
      //   pageSize,
      // });
      // if (forceUpdate) setForceUpdate(true);
    },
  };
};

export const toOrderDirection = (order?: string): undefined | number => {
  if (!order) return undefined;
  return order === 'ascend' ? 1 : -1;
};
