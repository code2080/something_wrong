import { TablePaginationConfig } from "antd";
import { SorterResult, TableRowSelection } from "antd/lib/table/interface";
import { useContext } from "react";
import { ESortDirection } from "Types/SSP.type";
import SSPResourceContext from "./context";

const useSSP = () => useContext(SSPResourceContext);
export default useSSP;

export const usePagination = (): TablePaginationConfig => {
  const { page, limit, totalPages, setPage, setLimit } = useContext(SSPResourceContext);

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
}

export const useRowSelection = (): TableRowSelection<any> => {
  const { setSelectedKeys, selectedKeys } = useContext(SSPResourceContext);

  return {
    selectedRowKeys: selectedKeys,
    onChange: (_selectedKeys) => setSelectedKeys(_selectedKeys as string[]),
    preserveSelectedRowKeys: true,
  };
}

export const useSorting = () => {
  const { setSorting } = useContext(SSPResourceContext);

  return (_: unknown, __: unknown, sorter: SorterResult<any> | SorterResult<any>[]) => {
    // We're not supporting multiple sorters (yet), so if our payload is an array, we're resetting sorting
    if (Array.isArray(sorter)) {
      setSorting('', ESortDirection.DESCENDING);
      return;
    }
    // If column key or direction are undefined, we'll reset the sorting
    const { columnKey, order } = sorter;
    if (!columnKey || !order) {
      setSorting('', ESortDirection.DESCENDING);
    } else {
      const direction = order === 'ascend' ? ESortDirection.ASCENDING : ESortDirection.DESCENDING;
      setSorting(columnKey as string, direction);
    }
  }
}

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
    discardFilterChanges
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
    discardFilterChanges
  };
}

