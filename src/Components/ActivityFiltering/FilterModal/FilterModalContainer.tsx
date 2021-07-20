import React, { useEffect, useMemo, createContext, useState, ReactChild, ReactChildren } from 'react';
import { get, isEmpty, keyBy, omit } from 'lodash';
import { useSelector } from 'react-redux';

// COMPONENTS
import { FormInstance } from 'antd/lib/form/Form';
import { Form } from 'antd';

// SELECTORS
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';

// TYPES
import { TFilterLookUpMap } from 'Types/FilterLookUp.type';
import { SelectOption, ItemsMapping } from './FilterModal.type';

// CONSTANTS
import { FILTER_ITEMS_MAPPING, NESTED_FIELDS } from './FilterModal.constants';

// HELPERS
import { generateObjectItems, convertToKeys, validateFilterQuery } from './FilterModal.helper';
import { TActivityFilterQuery } from 'Types/ActivityFilter.type';

export interface ValueProps {
  selectedProperty: string;
  setSelectedProperty: (field: string) => void;
  form: FormInstance;
  filterOptions: { [key: string]: SelectOption[] };
  propertiesMapping: ItemsMapping;
  values: any;
  validationError: any;
  onValueChange: (obj, allValues) => void;
  onClear: (fields: string[]) => void;
  onDeselect: (field: string, itemsToDeselect: string[]) => void;
  onSubmit: (cb?: (values) => void) => void;
};

const emptyValue: ValueProps = {
  selectedProperty: 'date',
  setSelectedProperty: () => {},
  // @ts-ignore
  form: null,
  filterOptions: {},
  propertiesMapping: {},
  values: {},
  validationError: {},
  onValueChange: () => {},
  onClear: () => {},
  onDeselect: () => {},
  onSubmit: () => false,
};

const Context = createContext(emptyValue);

interface Props {
  filterLookupMap: TFilterLookUpMap;
  children: (values) => ReactChild | ReactChildren;
  form: FormInstance;
  formId: string;
  defaultMapping: TActivityFilterQuery;
}

const flattenObject = (obj: {[key: string]: any}) => {
  return Object.keys(obj).reduce((results, key) => {
    if (NESTED_FIELDS.includes(key)) return {
      ...results,
      ...Object.keys(obj[key]).reduce((rs, itemKey) => ({
        ...rs,
        [`${key}.${itemKey}`]: obj[key][itemKey],
      }), {})
    };
    return {
      ...results,
      [key]: obj[key],
    };
  }, {})
}

const Provider = ({ children, filterLookupMap, defaultMapping, form, formId }: Props) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('date');
  const [values, setValues] = useState({});
  const [validationError, setValidationError] = useState({});
  const submissions = useSelector(state => makeSelectSubmissions()(state, formId));

  const indexedSubmissions = useMemo(() => keyBy(submissions, 'recipientId'), [submissions.length]);
  const objectsAndFields = useMemo(() =>
    NESTED_FIELDS.reduce((results, key) => {
      return {
        ...results,
        ...generateObjectItems(filterLookupMap, key),
      }
    }, {}), [filterLookupMap]);

  console.log('objectsAndFields', objectsAndFields);

  const propertiesMapping = useMemo(() => ({
    ...FILTER_ITEMS_MAPPING,
    ...objectsAndFields,
  }), [objectsAndFields]);

  const filterOptions = useMemo(() => {
    return {
      tag: filterLookupMap.tag ? Object.keys(filterLookupMap.tag).map(tag => ({
        label: tag,
        value: tag,
      })) : [],
      submitter: filterLookupMap.submitter ? Object.keys(filterLookupMap.submitter).map(submitterId => ({
        label: indexedSubmissions[submitterId]?.submitter || submitterId,
        value: submitterId,
      })) : [],
      primaryObject: filterLookupMap.primaryObject ? Object.keys(filterLookupMap.primaryObject).map(tag => ({
        label: tag,
        value: tag,
      })) : [],
      ...Object.keys(objectsAndFields).reduce((results, key) => {
        return {
          ...results,
          [key]: Object.keys(get(filterLookupMap, convertToKeys(key), {})).map(item => ({
            label: item,
            value: item,
          }))
        }
      }, {}),
    }
  }, [filterLookupMap]);

  // onInitialize
  useEffect(() => {
    const falttenValues = flattenObject(defaultMapping);
    form.setFieldsValue(falttenValues);
    setValues(falttenValues);
  }, [formId, defaultMapping])

  const onValueChange = obj => {
    setValues({ ...values, ...obj });
    setValidationError({});
  }
  const onClear = (fields: string[]) => {
    form.setFieldsValue(
      fields.reduce((results, field) => ({
        ...results,
        [field]: undefined,
      }), {})
    );
    setValues(omit(values, fields));
  };
  const onDeselect = (key: string, itemsToDeselect: string[]) => {
    if (!values[key] || !Array.isArray(values[key])) return;
    const selectedValues = values[key].filter(item => !itemsToDeselect.includes(item));
    form.setFieldsValue({
      [key]: selectedValues,
    });
    onValueChange({
      [key]: selectedValues,
    });
  };

  const onSubmit = (cb?: (values) => void) => {
    const err = validateFilterQuery(values);
    setValidationError(err);
    if (isEmpty(err) && typeof cb === 'function') cb(values);
  };

  return (
    <Context.Provider value={{
      selectedProperty,
      setSelectedProperty,
      form,
      filterOptions,
      propertiesMapping,
      values,
      validationError,
      onValueChange,
      onClear,
      onDeselect,
      onSubmit,
    }}>
      <Form form={form} layout="vertical" onValuesChange={onValueChange} initialValues={{ criteria: 'one', mode: 'single'}}>
        {children({ values, onSubmit })}
      </Form>
    </Context.Provider>
  );
};

export default {
  Context,
  Provider,
}