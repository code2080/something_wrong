import _ from 'lodash';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import PropertySelector from '../PropertySelector';
import { TProperty, TProp } from '../../Types/property.type';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectMultipleExtIdLabels } from '../../Redux/TE/te.selectors';
import {
  fetchLookupMap,
  setSelectedFilterValues,
} from '../../Redux/Filters/filters.actions';
import {
  makeSelectFormLookupMap,
  makeSelectSelectedFilterValues,
} from '../../Redux/Filters/filters.selectors';

const propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

type Props = {
  isVisible?: boolean;
  onClose?(): void;
};
const FilterModal = ({ isVisible = false, onClose = _.noop }: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const selectFormLookupMap = useMemo(() => makeSelectFormLookupMap(), []);
  const filterLookupMap = useSelector((state) =>
    selectFormLookupMap(state, formId),
  );

  const selectSelectedFilterValues = useMemo(
    () => makeSelectSelectedFilterValues(),
    [],
  );
  const currentlySelectedFilterValues = useSelector((state) =>
    selectSelectedFilterValues(state, formId),
  );

  const [localSelectedValues, setLocalSelectedValues] = useState<{
    [property: string]: string[];
  }>(currentlySelectedFilterValues);

  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(
    () => isVisible && dispatch(fetchLookupMap({ formId })),
    [dispatch, formId, isVisible],
  );

  const ModalBody = () => {
    const valuesWithNoLabel = Object.values(filterLookupMap).flatMap((values) =>
      Object.entries(values)
        .filter(([_, { label }]) => !label)
        .flatMap(([id]) => id),
    );
    const labels = useSelector(selectMultipleExtIdLabels)(
      valuesWithNoLabel.map((id) => ({ field: 'objects', extId: id })),
    );
    const availableValuesForSubmitter = Object.entries(
      filterLookupMap,
    ).reduce<any>((filterMap, [key, values]) => {
      const idsAndLabels = Object.entries(values);
      return {
        ...filterMap,
        [key]: idsAndLabels.map(([id, { label }]) => ({
          value: id,
          label: label ?? labels[id],
        })),
      };
    }, {});

    const availProps = Object.keys(availableValuesForSubmitter).map(
      (key) =>
        ({
          label: _.startCase(key),
          value: key,
        } as TProp),
    );

    const availableSubmitters: TProp[] = selectedProperty
      ? availableValuesForSubmitter[selectedProperty as string].filter(
          ({ value }: TProp) =>
            !localSelectedValues[selectedProperty]?.includes(value),
        )
      : [];

    const selectedSubmitters = Object.entries(localSelectedValues).map(
      ([property, values]) =>
        ({
          ...(availProps.find((prop) => prop.value === property) as TProp),
          children: values.map((val) =>
            availableValuesForSubmitter[property].find((v) => v.value === val),
          ),
        } as TProperty),
    );

    return (
      <div style={{ display: 'flex' }}>
        <PropertySelector
          properties={availProps}
          onSelect={(selected) => setSelectedProperty(selected)}
          selectedPropertyValue={selectedProperty}
          emptyText='No filter properties available'
          title='Available properties'
        />
        <PropertySelector
          properties={availableSubmitters}
          onSelect={(value) =>
            setLocalSelectedValues({
              ...localSelectedValues,
              [selectedProperty as string]: [
                ...(localSelectedValues[selectedProperty as string] ?? []),
                value,
              ],
            })
          }
          emptyText={
            selectedProperty
              ? 'No more values available'
              : 'Select a property to see available filter values'
          }
          title='Available filters'
        />
        <PropertySelector
          properties={selectedSubmitters}
          onSelect={(removedValue) => {
            const obj = Object.entries(localSelectedValues).reduce<any>(
              (newSelected, [property, values]) => ({
                ...newSelected,
                [property]: [
                  ...(newSelected[property] || []),
                  ...values.filter((val) => val !== removedValue),
                ],
              }),
              {},
            );
            setLocalSelectedValues(obj);
          }}
          emptyText='No filters selected'
          title='Selected filters'
        />
      </div>
    );
  };

  const handleCancel = useCallback(() => {
    setLocalSelectedValues(currentlySelectedFilterValues);
    onClose();
  }, [currentlySelectedFilterValues, onClose]);

  const handleOk = useCallback(() => {
    !_.isEqual(localSelectedValues, currentlySelectedFilterValues) &&
      dispatch(
        setSelectedFilterValues({ formId, filterValues: localSelectedValues }),
      );
    onClose();
  }, [
    localSelectedValues,
    currentlySelectedFilterValues,
    dispatch,
    formId,
    onClose,
  ]);

  return (
    <Modal
      title='Filter activities'
      visible={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      getContainer={() =>
        document.getElementById('te-prefs-lib') as HTMLElement
      }
    >
      <ModalBody />
    </Modal>
  );
};

FilterModal.propTypes = propTypes;

export default FilterModal;
