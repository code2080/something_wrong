import React, { useMemo, useState } from 'react';
import { Modal, Button, Radio } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectDesignForForm } from '../../Redux/ActivityDesigner/activityDesigner.selectors';
import {
  selectActivityFilterOptionsForForm,
  selectActivityFilterForForm,
  selectActivityFilterModeForForm,
  selectActivityFilterInclusionForForm,
} from '../../Redux/Filters/filters.selectors';

// ACTIONS
import { updateFilter, setActivityFilterMode, setActivityFilterInclusion } from '../../Redux/Filters/filters.actions';

// COMPONENTS
import PropertySelector from '../PropertySelector';
import { EPropertyType, TProperty } from '../../Types/property.type';

// CONSTANTS
import TimingNameMap from '../../Constants/activityDesignTimingMap.constants';
import { EActivityFilterInclusion, EActivityFilterMode } from '../../Types/ActivityFilter.interface';

const mapArrayToProperties = (arr: any[], labelMap: object | null = null) => {
  return Object.keys(arr).reduce((props: any, key: string) => {
    if (key && key === 'mode') return props;
    if (arr[key] && arr[key] != null && (!Array.isArray(arr[key]) || arr[key].length))
      return [
        ...props,
        { value: key, label: labelMap ? labelMap[key] || key : key },
      ];
    return props;
  }, []);
};
const mapDesignToProperties = (design: any): TProperty[] => {
  return [
    ...(mapArrayToProperties(design.timing, TimingNameMap) || []),
    ...(mapArrayToProperties(design.objects, null) || []),
    ...(mapArrayToProperties(design.fields, null) || []),
  ];
};

const createPropertySelectorProperties = (spv: string | null, filterOptions: any, filterValues: any): TProperty[] => {
  if (!spv) return [];
  const options = filterOptions[spv];
  const selectedOptions = filterValues[spv] || [];
  if (!options) return [];
  if (Array.isArray(options)) return filterOptions[spv].filter(el => selectedOptions.findIndex(v => v === el.value) === -1);
  return Object.keys(options).reduce((tot: TProperty[], key: string) => {
    const filteredOptions = options[key].filter(el => selectedOptions.findIndex(v => v === el.value) === -1);
    if (!filteredOptions || !filteredOptions.length) return tot;
    return [
      ...tot,
      { value: key, label: key, type: EPropertyType.HEADING },
      ...filteredOptions,
    ];
  }, []);
};

const generateSelectedValuesFromFilter = (filterValues): TProperty[] => {
  return (Object.keys(filterValues) || []).reduce((tot: TProperty[], key: string) => {
    if (!filterValues[key] || !filterValues[key].length) return tot;
    return [
      ...tot,
      { value: key, label: key, type: EPropertyType.HEADING },
      ...filterValues[key].map(el => {
        const splitEl = el.split('/');
        const nEl = splitEl.length - 1;
        let label = '';
        for (let i = 1; i <= nEl; i += 1) {
          label = label !== '' ? label + ': ' + splitEl[i] : splitEl[i];
        }
        return ({ value: el, label, type: EPropertyType.VALUE });
      }),
    ];
  }, []);
};

const mapExtraInfoToProperties = (): TProperty[] => [
  { value: 'submitter', label: 'Submitter' },
  { value: 'primaryObject', label: 'Primary object' },
  { value: 'groupId', label: 'Group' }
];

/**
 * TODO
 * x) Add filter options for submission, activity group
 * x) Add filter options for padding
 * x) Add filter options for date ranges
 * x) Add filter options for padding weekday
 */

type Props = {
  isVisible: boolean,
  onClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
}

const ActivityFilterModal = ({ isVisible, onClose }: Props) => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();
  const design = useSelector(selectDesignForForm)(formId);
  const filterOptions = useSelector(selectActivityFilterOptionsForForm)(formId);
  const filterValues = useSelector(selectActivityFilterForForm)(formId);
  const filterMode = useSelector(selectActivityFilterModeForForm)(formId);
  const filterInclusion = useSelector(selectActivityFilterInclusionForForm)(formId);

  /**
   * STATE VARS
   */
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  /**
   * MEMOIZED VALUES
   */
  const properties: TProperty[] = useMemo(() => [...mapDesignToProperties(design), ...mapExtraInfoToProperties()], [design]);
  const selectedValues: TProperty[] = useMemo(() => generateSelectedValuesFromFilter(filterValues), [filterValues]);
  const availableValues = useMemo(() => createPropertySelectorProperties(selectedProperty, filterOptions, filterValues), [selectedProperty, filterOptions, filterValues]);

  /**
   * EVENT HANDLERS
   */
  const onSelectProperty = (selectedProperty: string) => {
    setSelectedProperty(selectedProperty);
  };

  const onAddFilterValue = (propertyValue: string) => {
    if (selectedProperty)
      dispatch(updateFilter({
        filterId: `${formId}_ACTIVITIES`,
        key: selectedProperty,
        value: [...(filterValues[selectedProperty] || []), propertyValue],
      }));
  };

  const onRemoveFilterValue = (propertyValue: string) => {
    // Get selected property fot the value
    const splitValue = propertyValue.split('/');
    if (!splitValue || !splitValue[0] || splitValue[0] === '') return;
    const extId = splitValue[0];
    const idx = (filterValues[extId] || []).findIndex(el => el === propertyValue);
    dispatch(updateFilter({
      filterId: `${formId}_ACTIVITIES`,
      key: extId,
      value: [...filterValues[extId].slice(0, idx), ...filterValues[extId].slice(idx + 1)],
    }));
  };

  const onSetActivityFilterMode = (mode: EActivityFilterMode) => {
    dispatch(setActivityFilterMode({ filterId: formId, mode }));
  };

  const onSetActivityFilterInclusion = (inclusion: EActivityFilterInclusion) => {
    dispatch(setActivityFilterInclusion({ filterId: formId, inclusion }));
  };

  return (
    <Modal
      title='Filter activities'
      visible={isVisible}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key='ok' onClick={onClose}>OK</Button>
      ]}
      width={800}
      getContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
    >
      <div className='activity-filtering--modal'>
        <div className='activity-filtering--settings'>
          <div className='activity-filtering--settings-label'>
            Filter settings:
          </div>
          <div className='activity-filtering--content'>
            <div className='activity-filtering--settings-group'>
              <div className='activity-filtering--settings-label'>Match criteria:</div>
              <Radio.Group onChange={e => onSetActivityFilterMode(e.target.value)} value={filterMode}>
                <Radio value={'every'}>Match all</Radio>
                <Radio value={'some'}>Match some</Radio>
              </Radio.Group>
            </div>
            <div className='activity-filtering--settings-group'>
              <div className='activity-filtering--settings-label'>Include full submission for matching activity:</div>
              <Radio.Group onChange={e => onSetActivityFilterInclusion(e.target.value)} value={filterInclusion}>
                <Radio value={EActivityFilterInclusion.SINGLE}>Single activity</Radio>
                <Radio value={EActivityFilterInclusion.SUBMISSION}>All in submission</Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className='activity-filtering--selection'>
          <PropertySelector
            properties={properties}
            onSelect={onSelectProperty}
            selectedPropertyValue={selectedProperty}
            emptyText='No filter properties available'
            title='Available properties'
          />
          <PropertySelector
            properties={availableValues}
            onSelect={onAddFilterValue}
            emptyText={selectedProperty ? 'No more values available' : 'Select a property to see available filter values'}
            title='Available filters'
          />
          <PropertySelector
            properties={selectedValues}
            onSelect={onRemoveFilterValue}
            emptyText='No filters selected'
            title='Selected filters'
          />
        </div>
      </div>
    </Modal>
  );
};

export default ActivityFilterModal;
