import { Col, Modal, Row, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

// HOOKS
import { useFetchLabelsFromExtIdsWithTransformation } from 'Hooks/TECoreApiHooks';
import useSSP from '../../../SSP/Utils/hooks';

// SELECTORS
import {
  activityFilterLookupMapSelector,
  selectLabelsForFilterOptionsForForm,
} from 'Redux/ActivitiesSlice';

// HELPERS
import {
  createPatchFromFilterPropertyAndValues,
  getTECorePayload,
  transformFilterValues,
} from '../../helpers';

// COMPONENTS
import MatchType from '../MatchType';
import IncludeSubmission from '../IncludeSubmission';
import IncludeJointTeaching from '../IncludeJointTeaching';
import FilterProperties from '../FilterProperties';
import FilterItems from '../FilterItems';
import FilterSummary from '../FilterSummary';

// STYLES
import './index.scss';
import { isEmpty, unset } from 'lodash';
import { REPLACED_KEY } from 'Components/ActivitySSPFilters/constants';
import { removeDeepEntry } from 'Components/SSP/Utils/helpers';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const FilterModal = ({ isVisible, onClose }: Props) => {
  const { formId }: { formId: string } = useParams();
  /**
   * SELECTORS
   */
  const filterLookupMap = useSelector(activityFilterLookupMapSelector);
  const filterOptionLabels = useSelector(
    selectLabelsForFilterOptionsForForm(formId),
  );

  /**
   * CUSTOM HOOKS
   */
  const {
    loading,
    setFilters,
    patchFilters,
    filters,
    commitFilterChanges,
    discardFilterChanges,
  } = useSSP();
  useFetchLabelsFromExtIdsWithTransformation(filterLookupMap, getTECorePayload);

  /**
   * STATE
   */
  const [selectedFilterProperty, setSelectedFilterProperty] = useState('');
  const selectedFilterValues = transformFilterValues(filters);

  console.log('latest filters: ', filters);

  /**
   * EVENT HANDLERS
   */
  const onSelectFilterProperty = (property: string) => {
    setSelectedFilterProperty(property);
  };

  const onSelectFilterValue = (values: any) => {
    const patch = createPatchFromFilterPropertyAndValues(
      selectedFilterProperty,
      values,
    );
    patchFilters(patch);
  };

  const onDeselectFilterValue = (
    filterProperty: string,
    itemsToDeselect: string[],
  ) => {
    /**
     * Find the existing selected filter values for filterProperty
     */
    const selectedValues: string[] = selectedFilterValues[filterProperty] || [];
    if (!selectedValues || !selectedValues.length) return;

    /**
     * Modify a shallow copy of the selected filter values by excluding all
     * items in itemsToDeselect
     */
    const updatedFilterValues = selectedValues.filter(
      (el) => !itemsToDeselect.includes(el),
    );

    /** The update will lead to the category having no filter values left */
    if (isEmpty(updatedFilterValues)) {
      const pathToDelete = filterProperty.split(REPLACED_KEY);

      const updatedFilters = removeDeepEntry(filters, pathToDelete);
      setFilters(updatedFilters);

      return;
    }

    /**
     * Use patch filters to merge all of this together
     */
    const patch = createPatchFromFilterPropertyAndValues(
      filterProperty,
      updatedFilterValues,
    );

    patchFilters(patch);
  };

  /**
   * Removes {filterProperties} from selected filters
   * @param filterProperties
   */
  const onClearFilterValues = (filterProperties: string[]) => {
    const filtersCopy = { ...filters };

    filterProperties.forEach((keyToRemove) => {
      delete filtersCopy[keyToRemove];
    });

    setFilters(filtersCopy);
  };

  const onGetFilterOptionLabel = (fieldProperty: string, id?: string) => {
    if (!id) return fieldProperty;
    if (['status', 'submitter', 'tag'].includes(fieldProperty)) {
      return filterOptionLabels[fieldProperty][id];
    }
    return filterOptionLabels[id] || id;
  };

  const onOK = () => {
    commitFilterChanges();
    onClose();
  };

  const onCancel = () => {
    discardFilterChanges();
    onClose();
  };

  return (
    <Modal
      title='Activity filters'
      visible={isVisible}
      onOk={onOK}
      onCancel={onCancel}
      width={1000}
      getContainer={false}
    >
      <Spin spinning={!!loading}>
        <Row>
          <Col span={8}>
            <MatchType />
          </Col>
          <Col span={8}>
            <IncludeSubmission />
          </Col>
          <Col span={8}>
            <IncludeJointTeaching />
          </Col>
        </Row>
        <Row gutter={16} className='filter-modal__content'>
          <Col span={7}>
            <FilterProperties
              selectedFilterProperty={selectedFilterProperty}
              onSelect={onSelectFilterProperty}
              getOptionLabel={onGetFilterOptionLabel}
            />
          </Col>
          <Col span={7}>
            <FilterItems
              selectedFilterProperty={selectedFilterProperty}
              selectedFilterValues={selectedFilterValues}
              onSelectFilterValue={onSelectFilterValue}
              getOptionLabel={onGetFilterOptionLabel}
            />
          </Col>
          <Col span={10}>
            <FilterSummary
              selectedFilterValues={selectedFilterValues}
              onRemoveFilterProperty={onClearFilterValues}
              onDeselectFilterValue={onDeselectFilterValue}
              getOptionLabel={onGetFilterOptionLabel}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default FilterModal;
