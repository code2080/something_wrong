import _, { isObject } from 'lodash';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import PropertySelector from '../PropertySelector';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  fetchLookupMap,
  setSelectedFilterValues,
} from '../../Redux/Filters/filters.actions';
import {
  makeSelectFormLookupMap,
  makeSelectSelectedFilterValues,
} from '../../Redux/Filters/filters.selectors';
import type { TFilterLookUpMap } from '../../Types/FilterLookUp.type';
import type { GetExtIdPropsPayload } from '../../Types/TECorePayloads.type';
import { useFetchLabelsFromExtIds } from '../../Hooks/TECoreApiHooks';
import { selectMultipleExtIdLabels } from '../../Redux/TE/te.selectors';
import { selectActivityTagsForForm } from '../../Redux/ActivityTag/activityTag.selectors';
import { makeSelectSubmissions } from '../../Redux/FormSubmissions/formSubmissions.selectors';

const propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

type TProp = {
  value: string | string[];
  label: string;
};

type TProperty = TProp & {
  children?: (TProp & { children?: TProp[] })[];
};

type InputType = {
  [property: string]: TProperty[];
};

type Field = { fieldExtId: string; values: string[] };

type SelectedValues = Partial<{
  submitter: string[];
  tag: string[];
  primaryObject: string[];
  objects: {
    [typeExtId: string]: (string | Field)[];
  };
  fields: {
    [fieldExtId: string]: string[];
  };
}>;

type Selection = {
  parent?: string;
  selected: string;
};

type Props = {
  isVisible?: boolean;
  onClose?(): void;
};

type AvailableProperties =
  | 'submitter'
  | 'tag'
  | 'primaryObject'
  | 'objects'
  | 'fields'
  | 'objectFilters'
  | string;

const getLabelForValue = ({
  extIdLabels,
  submitterLabels,
  tagLabels,
}: {
  extIdLabels: { [extId: string]: string };
  submitterLabels: { [recipientId: string]: [] };
  tagLabels: { [tagId: string]: string };
}) => ({
  submitter: (val) => submitterLabels[val] ?? val,
  tag: (val) => tagLabels[val] ?? val,
  primaryObject: (val) => extIdLabels[val],
  objects: (val) => extIdLabels[val],
  fields: (val) => extIdLabels[val],
  objectFilters: (val) => extIdLabels[val],

  object: (val) => extIdLabels[val],
  field: (val) => extIdLabels[val],
});

const filterMap = {
  submitter: {
    kalle: ['actitityB'],
  },
  tag: {
    tagA: ['actitityB'],
  },
  primaryObject: {
    SALM1011: ['actitityB'],
  },
  objects: {
    room: {
      SALM1011: ['actitityB'],
    },
  },
  fields: {
    rescomment: {
      Testarlite: ['ActivityA'],
    },
  },
  objectFilters: {
    room: {
      roomtype: {
        Datorsal: ['ActivityA'],
      },
    },
  },
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

const mapValuesToTProperty = (
  values,
  property: AvailableProperties,
  labels,
): TProperty[] =>
  Object.entries(values).flatMap(([type, vals]) => ({
    value: type,
    label: getLabelForValue(labels)[property](type),
    children: Array.isArray(vals)
      ? undefined
      : Object.entries(vals as any).flatMap(([key, val]) => ({
          value: key,
          label: Array.isArray(val)
            ? property === 'objects'
              ? getLabelForValue(labels).object(key)
              : key
            : getLabelForValue(labels).field(key),
          children: Array.isArray(val)
            ? undefined
            : Object.keys(val as any).flatMap((k) => ({
                value: k,
                label: k,
              })),
        })),
  }));

const mapFilterMapToPropSelectorInput = (
  filterMap: TFilterLookUpMap,
  labels,
): InputType => {
  return Object.entries(filterMap || {}).reduce<InputType>(
    (inputValues, [property, values]) => {
      const isObjectFields = property === 'objectFilters';
      const newValues = mapValuesToTProperty(values, property, labels);
      const mergedObjects =
        newValues.map((value) => {
          const existingVal = inputValues.objects?.find(
            (v) => v.value === value.value,
          );
          return existingVal
            ? {
                ...existingVal,
                children: [
                  ...(existingVal?.children ?? []),
                  ...(value.children ?? []),
                ],
              }
            : value;
        }) ?? [];
      return {
        ...inputValues,
        [isObjectFields ? 'objects' : property]: isObjectFields
          ? mergedObjects
          : [
              ...(inputValues[
                property === 'objectFilters' ? 'objects' : property
              ] || []),
              ...newValues,
            ],
      };
    },
    {},
  );
};

const FilterModal = ({ isVisible = false, onClose = _.noop }: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  // const selectFormLookupMap = useMemo(() => makeSelectFormLookupMap(), []);
  const filterLookupMap = filterMap;
  // useSelector((state) =>
  //   selectFormLookupMap(state, formId),
  // );
  const teCorePayload = useMemo(
    () => getTECorePayload(filterLookupMap),
    [filterLookupMap],
  );

  useFetchLabelsFromExtIds(teCorePayload);

  const labels = useSelector(selectMultipleExtIdLabels)(
    Object.entries(teCorePayload).flatMap(([field, values]) =>
      values.map((val) => ({ field: field as any, extId: val })),
    ),
  );
  const activityTags = useSelector(selectActivityTagsForForm)(formId).reduce(
    (tagsMap, tag) => ({ ...tagsMap, [tag.id]: tag.name }),
    {},
  );

  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) =>
    selectSubmissions(state, formId),
  ).reduce(
    (submissionMap, submission) => ({
      ...submissionMap,
      [submission.recipientId as string]: `${submission.firstName} ${submission.lastName}`,
    }),
    {},
  );

  const labelsObject = useMemo(
    () => ({
      extIdLabels: labels,
      submitterLabels: submissions,
      tagLabels: activityTags,
    }),
    [activityTags, labels, submissions],
  );

  const input = useMemo(
    () => mapFilterMapToPropSelectorInput(filterLookupMap, labelsObject),
    [filterLookupMap, labelsObject],
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

  const [selectedProperty, setSelectedProperty] =
    useState<Selection | null>(null);
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});

  useEffect(
    () => isVisible && dispatch(fetchLookupMap({ formId })),
    [dispatch, formId, isVisible],
  );

  const ModalBody = () => {
    const getSimpleProp = (prop: string): TProp => ({
      label: _.startCase(prop),
      value: prop,
    });

    const getNestedProp = (prop: string) => (values: TProperty[]) => ({
      ...getSimpleProp(prop),
      children: values.map((vals) => _.omit(vals, 'children') as TProp),
    });

    const nestedProps = ['fields', 'objects'];

    const availProps = Object.entries(input).map(([property, values]) =>
      nestedProps.includes(property)
        ? getNestedProp(property)(values)
        : getSimpleProp(property),
    );

    const getAvailableValues = (input: InputType, property: Selection) => {
      return property.parent
        ? _.find(input[property.parent], ['value', property.selected])
            ?.children ?? []
        : input[property.selected];
    };

    const hideSelectedValues = (availableValues) => {
      if (!selectedProperty) return availableValues;
      const currentlySelectedValues =
        (selectedProperty.parent
          ? selectedValues[selectedProperty.parent]?.[selectedProperty.selected]
          : selectedValues[selectedProperty.selected]) ?? [];
      const basicFilteredAvailableValues = availableValues.filter(({ value }) =>
        selectedProperty.parent
          ? !currentlySelectedValues.includes(value)
          : !currentlySelectedValues.includes(value),
      );

      return basicFilteredAvailableValues.map((value) => ({
        ...value,
        children: value.children?.filter(
          (child) =>
            !currentlySelectedValues
              .find((selectedValue) => selectedValue.fieldExtId === value.value)
              ?.values.includes(child.value),
        ),
      }));
    };

    const availableValues = selectedProperty
      ? hideSelectedValues(getAvailableValues(input, selectedProperty))
      : [];

    const isFilter = (selection: string | Field) =>
      typeof selection !== 'string';

    const getNextSelectedValues = (
      selectedProperty: Selection,
      currentValues: SelectedValues,
      selection: Selection,
      add = true,
    ): SelectedValues => {
      const addNewValue = (
        currentValues: (string | Field)[] = [],
        selection: Selection,
      ) => {
        const selectedValue = selection.parent
          ? ({
              fieldExtId: selection.parent,
              values: [selection.selected],
            } as Field)
          : selection.selected;

        const insertValueIntoFilter = (
          currentValues: Field[],
          newValue: Field,
        ): any[] =>
          currentValues.find(
            (val: Field) => val.fieldExtId === newValue.fieldExtId,
          )
            ? currentValues.map((val: Field) =>
                val.fieldExtId === newValue.fieldExtId
                  ? {
                      ...val,
                      values: add
                        ? _.uniq([...val.values, ...newValue.values])
                        : val.values.filter((v) => !val.values.includes(v)),
                    }
                  : val,
              )
            : [...currentValues, newValue];

        if (isFilter(selectedValue))
          return insertValueIntoFilter(
            currentValues as Field[],
            selectedValue as Field,
          );
        return add
          ? _.uniq([...(currentValues as string[]), selectedValue as string])
          : (currentValues as string[]).filter(
              (v: string) => v !== (selectedValue as string),
            );
      };

      if (selectedProperty.parent) {
        return {
          ...currentValues,
          [selectedProperty.parent]: {
            ...(currentValues[selectedProperty.parent] || {}),
            [selectedProperty.selected]: addNewValue(
              currentValues[selectedProperty.parent]?.[
                selectedProperty.selected
              ],
              selection,
            ),
          },
        };
      }
      return {
        ...currentValues,
        [selectedProperty.selected]: add
          ? _.uniq([
              ...(currentValues[selectedProperty.selected] || []),
              selection.selected,
            ])
          : (currentValues[selectedProperty.selected] || []).filter(
              (v: string) => v !== selection.selected,
            ),
      };
    };

    const handleSelectValue =
      ({
        selectedProperty,
        add = true,
      }: {
        selectedProperty: Selection;
        add?: boolean;
      }) =>
      (selection: Selection) => {
        if (!selectedProperty) return;

        const nextSelectedValues = getNextSelectedValues(
          selectedProperty,
          selectedValues,
          selection,
          add,
        );

        setSelectedValues(nextSelectedValues);
      };

    const getSimplePropName = (prop: string, exceptions: string[] = []) =>
      exceptions.includes(prop) ? _.startCase(prop) : null;

    const joinSelectionHeaderLabel = (
      labels: (string | null)[],
      delimiter = ' > ',
    ) => _.compact(labels).join(delimiter);

    const getRenderPayloadForSelectedValues = (
      selectedValues: SelectedValues,
    ) =>
      Object.entries(selectedValues).flatMap(([property, values]) => {
        if (!values) return [];
        return Array.isArray(values)
          ? {
              value: [property],
              label: _.startCase(property),
              children: values.flatMap(
                (simpleValue: string) =>
                  input[property]?.find((v) => v.value === simpleValue) ?? [],
              ),
            }
          : Object.entries(values).flatMap(([type, valsOrFilters]) => {
              const [filters = [], vals = []]: [any[], any[]] = _.partition(
                valsOrFilters,
                isFilter,
              );
              return [
                ...filters.flatMap((filter: Field) => {
                  return {
                    value: [property, type, filter.fieldExtId],
                    label: joinSelectionHeaderLabel([
                      getSimplePropName(property, nestedProps),
                      input[property]?.find((v) => v.value === type)?.label ??
                        'N/A',
                      input[property]
                        ?.find((v) => v.value === type)
                        ?.children?.find(
                          (child) => child.value === filter.fieldExtId,
                        )?.label ?? 'N/A',
                    ]),
                    children: filter.values.flatMap((filterValue) => ({
                      value: filterValue,
                      label: filterValue,
                    })),
                  } as TProperty;
                }),
                {
                  value: [property, type],
                  label: joinSelectionHeaderLabel([
                    getSimplePropName(property, nestedProps),
                    input[property]?.find((v) => v.value === type)?.label ??
                      'N/A',
                  ]),
                  children: vals.map((val: string) => ({
                    label: val,
                    value: val,
                  })),
                } as TProperty,
              ];
            });
      });

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
          properties={availableValues}
          onSelect={handleSelectValue({
            add: true,
            selectedProperty: selectedProperty as Selection,
          })}
          emptyText={
            selectedProperty
              ? 'No more values available'
              : 'Select a property to see available filter values'
          }
          title='Available filters'
        />
        <PropertySelector
          properties={getRenderPayloadForSelectedValues(selectedValues)}
          onSelect={(selection) => {
            const [property, type, fieldExtId] = selection.parent ?? [];
            handleSelectValue({
              add: false,
              selectedProperty: {
                parent: type ? property : undefined,
                selected: type ?? property,
              },
            })({ parent: fieldExtId, selected: selection.selected });
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
