import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { get, keyBy } from 'lodash';
import React, { useMemo, createContext, useState, ReactChild, ReactChildren } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { TFilterLookUpMap } from 'Types/FilterLookUp.type';
import { generateSelectComponent, FILTER_ITEMS_MAPPING } from './FilterModal.constants';
import { SelectOption, ItemsMapping } from './FilterModal.type';

export interface ValueProps {
  selectedProperty: string;
  setSelectedProperty: (field: string) => void;
  form: FormInstance;
  mapping: TFilterLookUpMap;
  filterOptions: { [key: string]: SelectOption[] };
  propertiesMapping: ItemsMapping;
  values: any;
  onValueChange: (obj, allValues) => void;
};

const emptyValue: ValueProps = {
  selectedProperty: 'date',
  setSelectedProperty: () => {},
  // @ts-ignore
  form: null,
  mapping: {},
  filterOptions: {},
  propertiesMapping: {},
  values: {},
  onValueChange: () => {}
};

const Context = createContext(emptyValue);

const convertToKeys = key => {
  const splitted = key.split('.');
  return [splitted[0], splitted.slice(1).join('.')];
}

interface Props {
  filterLookupMap: TFilterLookUpMap;
  children: (values) => ReactChild | ReactChildren;
  form: FormInstance;
  formId: string;
}

const generateObjectItems = (filterLookupMap: TFilterLookUpMap, field: string) => {
  return Object.keys(filterLookupMap[field] || {}).reduce((results, key) => {
    const _key = `${field}.${key}`;
    return {
      ...results,
      [_key]: generateSelectComponent({
        title: key,
        name: _key,
        label: key,
        parent: field,
      }),
    };
  }, {});
}

const Provider = ({ children, filterLookupMap, form, formId }: Props) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('date');
  const [values, setValues] = useState({});
  const submissions = useSelector(state => makeSelectSubmissions()(state, formId));

  const indexedSubmissions = useMemo(() => keyBy(submissions, 'recipientId'), [submissions.length]);
  const objectsAndFields = ['objects', 'fields'].reduce((results, key) => {
    return {
      ...results,
      ...generateObjectItems(filterLookupMap, key),
    }
  }, {});


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

  const onValueChange = obj => {
    setValues({ ...values, ...obj });
  }
  const propertiesMapping = {
    ...FILTER_ITEMS_MAPPING,
    ...objectsAndFields,
  }
  return (
    <Context.Provider value={{
      selectedProperty,
      setSelectedProperty,
      form,
      mapping: filterLookupMap,
      filterOptions,
      propertiesMapping,
      values,
      onValueChange,
    }}>
      <Form form={form} layout="vertical" onValuesChange={onValueChange}>
        {children({ values })}
      </Form>
    </Context.Provider>
  );
};

export default {
  Context,
  Provider,
}