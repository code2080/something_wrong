import _ from 'lodash';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  fetchLookupMap,
  setSelectedFilterValues,
} from '../../../Redux/Filters/filters.actions';
import {
  makeSelectFormLookupMap,
  makeSelectSelectedFilterValues,
} from '../../../Redux/Filters/filters.selectors';
import type { TFilterLookUpMap } from '../../../Types/FilterLookUp.type';
import type { GetExtIdPropsPayload } from '../../../Types/TECorePayloads.type';
import { useFetchLabelsFromExtIds } from '../../../Hooks/TECoreApiHooks';
import FilterSettings from './FilterSettings';

import './FilterModal.scss';
import FilterContent from './FilterContent';
import FilterModalContainer from './FilterModalContainer';
import { useForm } from 'antd/lib/form/Form';

const propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

type Props = {
  isVisible?: boolean;
  onClose?(): void;
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
): GetExtIdPropsPayload => {
  const labels: { field: 'fields' | 'types' | 'objects'; extId: string }[] =
    Object.entries(filterMap).flatMap(
      ([property, values]) => getLabelsFromProp[property]?.(values) ?? null,
    );
  return _.compact(labels).reduce<GetExtIdPropsPayload>(
    (payload, label) => ({
      ...payload,
      [label.field]: _.uniq([...(payload[label.field] ?? []), label.extId]),
    }),
    { objects: [], fields: [], types: [] },
  );
};
const FilterModal = ({ isVisible = false, onClose = _.noop }: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const selectFormLookupMap = useMemo(() => makeSelectFormLookupMap(), []);
  const filterLookupMap = useSelector((state) =>
    selectFormLookupMap(state, formId),
  );
  const teCorePayload = useMemo(
    () => getTECorePayload(filterLookupMap),
    [filterLookupMap],
  );

  // console.log(teCorePayload);
  useFetchLabelsFromExtIds(teCorePayload);

  const selectSelectedFilterValues = useMemo(
    () => makeSelectSelectedFilterValues(),
    [],
  );
  const currentlySelectedFilterValues = useSelector((state) =>
    selectSelectedFilterValues(state, formId),
  );

  useEffect(
    () => isVisible && dispatch(fetchLookupMap({ formId })),
    [dispatch, formId, isVisible],
  );
  const handleCancel = useCallback(() => {
    onClose();
  }, [currentlySelectedFilterValues, onClose]);

  const handleOk = useCallback(
    (values) => {
      !_.isEqual(values, currentlySelectedFilterValues) &&
        dispatch(setSelectedFilterValues({ formId, filterValues: values }));
      onClose();
    },
    [currentlySelectedFilterValues, dispatch, formId, onClose],
  );

  const [form] = useForm();

  useEffect(() => {
    console.log('formID', formId, currentlySelectedFilterValues);
  }, [formId]);

  return (
    <FilterModalContainer.Provider
      filterLookupMap={filterLookupMap}
      form={form}
      formId={formId}
      defaultMapping={currentlySelectedFilterValues}
    >
      {({ onSubmit }) => {
        return (
          <Modal
            title='Filter activities'
            visible={isVisible}
            onOk={() => onSubmit(handleOk)}
            onCancel={handleCancel}
            width={1000}
            getContainer={false}
          >
            <div>
              <FilterSettings />
              <FilterContent />
            </div>
          </Modal>
        );
      }}
    </FilterModalContainer.Provider>
  );
};

FilterModal.propTypes = propTypes;

export default FilterModal;
