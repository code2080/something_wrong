import { TablePaginationConfig } from 'antd';
import {
  SorterResult,
  SortOrder,
  TableRowSelection,
} from 'antd/lib/table/interface';
import { useContext } from 'react';

// COMPONENTS
import SelectAllCheckbox from '../Components/SelectAllCheckbox';

// TYPES
import { ESortDirection } from 'Types/SSP.type';
import SSPResourceContext from './context';

const useSSP = () => useContext(SSPResourceContext);
export default useSSP;

export const usePagination = (): TablePaginationConfig => {
  const { page, limit, totalPages, setPage, setLimit } =
    useContext(SSPResourceContext);

  return {
    size: 'small',
    hideOnSinglePage: true,
    pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
    current: page,
    pageSize: limit,
    total: totalPages * limit,
    onChange: (_page, _limit) => {
      // One can't change both page and limit at the same time sooo
      if (_page !== page) {
        setPage(_page);
      } else if (_limit && _limit !== limit) {
        setLimit(_limit);
      }
    },
    showSizeChanger: true,
  };
};

export const useRowSelection = (): TableRowSelection<any> => {
  const { setSelectedKeys, selectedKeys } = useContext(SSPResourceContext);

  const columnTitle = (<SelectAllCheckbox />);

  return {
    selectedRowKeys: selectedKeys,
    onChange: (_selectedKeys) => setSelectedKeys(_selectedKeys as string[]),
    preserveSelectedRowKeys: true,
    columnTitle,
  };
};

const getSortingDirection = (order?: SortOrder) => {
  if (!order) return undefined;
  return order === 'ascend'
    ? ESortDirection.ASCENDING
    : ESortDirection.DESCENDING;
};

export const useSorting = () => {
  const { sortBy, direction, setSorting } = useContext(SSPResourceContext);

  return (
    _: unknown,
    __: unknown,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    /**
     * Three reasons to terminate early:
     * x) Sorter is an array (we do not support multiple sorters)
     * x) We don't have a sortBy param, AND...
     * x) ... we don't have a direction
     */
    if (Array.isArray(sorter) || !sorter || (!sorter?.columnKey && !sorter?.order)) {
      return;
    }
    // If column key or direction are undefined, we'll reset the sorting
    const { columnKey, order } = sorter;
    if(!columnKey || !order) {setSorting(undefined, undefined); return; }
    // Parse the order string into our enums
    const parsedDirection = getSortingDirection(order);
    // Only update if something has changed in the sorting
    if (sortBy !== columnKey || direction !== parsedDirection) {
      const direction = getSortingDirection(order);
      if (direction === undefined) {
        setSorting(undefined, undefined);
      } else {
        setSorting(columnKey as string | undefined, direction);
      }
    }
  };
};

export const useFilters = () => {
  const {
    matchType,
    inclusion,
    filters,
    setMatchType,
    setInclusion,
    patchInclusion,
    setFilters,
    patchFilters,
    commitFilterChanges,
    discardFilterChanges,
  } = useContext(SSPResourceContext);

  return {
    matchType,
    inclusion,
    filters,
    setMatchType,
    setInclusion,
    patchInclusion,
    setFilters,
    patchFilters,
    commitFilterChanges,
    discardFilterChanges,
  };
};
