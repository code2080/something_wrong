import _, { get } from 'lodash';
import { Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'antd/lib/form/Form';

// ACTIONS
import { fetchActivityFilterLookupMap } from 'Redux/FilterLookupMap/filterLookupMap.actions';

// HOOKS
import { useFetchLabelsFromExtIds } from 'Hooks/TECoreApiHooks';

// SELECTORS
import {
  selectExactFormActivityLookupMap,
  selectFormActivityLookupMap,
} from 'Redux/FilterLookupMap/filterLookupMap.selectors';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
import type { TFilterLookUpMap } from 'Types/FilterLookUp.type';
import type { TGetExtIdPropsPayload } from 'Types/TECorePayloads.type';
import { FETCH_ACTIVITY_FILTER_LOOKUP_MAP } from 'Redux/FilterLookupMap/filterLookupMap.actionTypes';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';

// COMPONENTS
import FilterSettings from './FilterSettings';
import FilterContent from './FilterContent';
import FilterModalContainer from './FilterModalContainer';

import './FilterModal.scss';
import { useRecipients } from 'Hooks/useRecipients';

const propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

type Props = {
  formId: string;
  isVisible?: boolean;
  onClose?(): void;
  selectedFilterValues: any;
  onSubmit: (values) => void;
  tableType?: string;
};

const getLabelsFromProp = {
  objects: (val) =>
    Object.entries(val).flatMap(([type, values]) => [
      { field: 'types', extId: type },
      ...Object.keys(values as any).map((v) => ({
        field: 'objects',
        extId: v,
      })),
    ]),
  objectFilters: (val) =>
    Object.entries(val).flatMap(([type, values]) => [
      { field: 'types', extId: type },
      ...Object.keys(values as any).map((v) => ({ field: 'fields', extId: v })),
    ]),
  fields: (val) => Object.keys(val).map((v) => ({ field: 'fields', extId: v })),
  primaryObject: (val) =>
    Object.keys(val).map((v) => ({ field: 'objects', extId: v })),
};

const getTECorePayload = (
  filterMap: TFilterLookUpMap,
): TGetExtIdPropsPayload => {
  const labels: { field: 'fields' | 'types' | 'objects'; extId: string }[] =
    Object.entries(filterMap).flatMap(
      ([property, values]) => getLabelsFromProp[property]?.(values) ?? null,
    );
  return _.compact(labels).reduce<TGetExtIdPropsPayload>(
    (payload, label) => ({
      ...payload,
      [label.field]: _.uniq([...(payload[label.field] ?? []), label.extId]),
    }),
    { objects: [], fields: [], types: [] },
  );
};
const FilterModal = ({
  isVisible = false,
  onClose = _.noop,
  formId,
  selectedFilterValues,
  onSubmit,
  tableType = ACTIVITIES_TABLE,
}: Props) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const { fetchRecipients } = useRecipients();

  const rawFilterLookupMap = useSelector(selectFormActivityLookupMap(formId));
  const filterLookupMap = useSelector(
    selectExactFormActivityLookupMap({
      formId,
      filterLookupMap: rawFilterLookupMap,
    }),
  );

  const teCorePayload = useMemo(
    () => getTECorePayload(rawFilterLookupMap),
    [rawFilterLookupMap],
  );
  useFetchLabelsFromExtIds(teCorePayload);

  const loading: boolean = useSelector(
    createLoadingSelector([FETCH_ACTIVITY_FILTER_LOOKUP_MAP]),
  );

  useEffect(() => {
    const doGetFilterLookupMap = async () => {
      const res = await dispatch(fetchActivityFilterLookupMap({ formId }));
      const submissionIds = Object.keys(get(res, 'lookupMap.submitter', {}));
      fetchRecipients(submissionIds);
    };
    if (isVisible) {
      doGetFilterLookupMap();
    }
  }, [dispatch, formId, isVisible]);
  const handleCancel = useCallback(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilterValues, onClose, form]);

  const handleOk = useCallback(
    (values) => {
      !_.isEqual(values, selectedFilterValues) && onSubmit(values);
      onClose();
    },
    [selectedFilterValues, onSubmit, onClose],
  );

  return (
    <FilterModalContainer.Provider
      filterLookupMap={filterLookupMap}
      form={form}
      formId={formId}
      defaultMapping={isVisible ? selectedFilterValues : {}}
      tableType={tableType}
    >
      {({ onSubmit }) => {
        return (
          <Modal
            title='Filter activities'
            visible={isVisible}
            onOk={() => onSubmit(handleOk)}
            onCancel={() => {
              handleCancel();
            }}
            width={1000}
            getContainer={false}
          >
            <Spin spinning={loading!!}>
              <FilterSettings />
              <FilterContent />
            </Spin>
          </Modal>
        );
      }}
    </FilterModalContainer.Provider>
  );
};

FilterModal.propTypes = propTypes;

export default FilterModal;
