import _ from 'lodash';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import PropertySelector from '../PropertySelector';
import { TProperty, TProp } from '../../Types/property.type';
import type FilterLookupMap from '../../Types/FilterLookUp.type';
import { useState } from 'react';
const propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  filterLookupMap: PropTypes.object.isRequired,
};

type Props = {
  isVisible?: boolean;
  onClose?(): void;
  filterLookupMap: FilterLookupMap;
};
const FilterModal = ({
  isVisible = false,
  onClose = _.noop,
  filterLookupMap,
}: Props) => {
  }>({});
  const [selectedProperty, setSelectedProperty] =
  useState<string | null>(null);
  
  const ModalBody = () => {
    
    const availableValuesForSubmitter = Object.entries(
      filterLookupMap,
    ).reduce<any>((filterMap, [key, values]) => {
      const ids = Object.keys(values);
      return {
        ...filterMap,
        [key]: ids.map((id) => ({ value: id, label: id })),
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
            !selectedValues[selectedProperty]?.includes(value),
        )
      : [];

    const selectedSubmitters = Object.entries(selectedValues).map(
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
            setSelectedValues({
              ...selectedValues,
              [selectedProperty as string]: [
                ...(selectedValues[selectedProperty as string] ?? []),
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
            const obj = Object.entries(selectedValues).reduce<any>(
              (newSelected, [property, values]) => ({
                ...newSelected,
                [property]: [
                  ...(newSelected[property] || []),
                  ...values.filter((val) => val !== removedValue),
                ],
              }),
              {},
            );
            setSelectedValues(obj);
          }}
          emptyText='No filters selected'
          title='Selected filters'
        />
      </div>
    );
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <Modal
      title='Filter activities'
      visible={isVisible}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[
        <Button key='ok' onClick={handleClose}>
          OK
        </Button>,
      ]}
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
