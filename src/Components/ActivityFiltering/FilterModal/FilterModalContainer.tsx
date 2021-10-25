import {
  useMemo,
  useEffect,
  createContext,
  useState,
  ReactChild,
  ReactChildren,
} from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, omit } from 'lodash';

// COMPONENTS
import { FormInstance } from 'antd/lib/form/Form';
import { Form } from 'antd';

// TYPES
import { INITIAL_FILTER_VALUES } from './FilterModal.constants';
import { TActivityFilterQuery } from '../../../Types/ActivityFilter.type';
import { TFilterLookUpMap } from '../../../Types/FilterLookUp.type';
import { EActivityStatus } from 'Types/ActivityStatus.enum';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';

// HELPERS
import {
  validateFilterQuery,
  beautifyObject,
  reparseKey,
} from './FilterModal.helper';

// SELETORS
import { makeSelectSubmissions } from '../../../Redux/FormSubmissions/formSubmissions.selectors';
import {
  selectFieldLabelsMapping,
  selectObjectLabelsMapping,
} from '../../../Redux/Integration/integration.selectors';
import { selectAllLabels } from '../../../Redux/TE/te.selectors';
import { selectActivityTagsForForm } from 'Redux/ActivityTag/activityTag.selectors';

export interface ValueProps {
  selectedProperty: string;
  setSelectedProperty: (field: string) => void;
  form: FormInstance;
  values: any;
  validationError: any;
  onValueChange: (obj, allValues) => void;
  onClear: (fields: string[]) => void;
  onDeselect: (field: string, itemsToDeselect: string[]) => void;
  onSubmit: (cb?: (values) => void) => void;
  filterLookupMap: any;
  getOptionLabel: (field: string, id?: string) => string;
  tableType?: string;
}

const emptyValue: ValueProps = {
  selectedProperty: 'date',
  setSelectedProperty: () => {},
  // @ts-ignore
  form: null,
  values: {},
  validationError: {},
  onValueChange: () => {},
  onClear: () => {},
  onDeselect: () => {},
  onSubmit: () => false,
  filterLookupMap: {},
  getOptionLabel: () => '',
  tableType: ACTIVITIES_TABLE,
};

const Context = createContext(emptyValue);

interface Props {
  filterLookupMap: TFilterLookUpMap;
  children: (values) => ReactChild | ReactChildren;
  form: FormInstance;
  formId: string;
  defaultMapping: TActivityFilterQuery;
  tableType?: string;
}

const Provider = ({
  children,
  filterLookupMap,
  defaultMapping,
  form,
  formId,
  tableType,
}: Props) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('date');
  const [values, setValues] = useState({});
  const [validationError, setValidationError] = useState({});

  const submissions = useSelector((state) =>
    makeSelectSubmissions()(state, formId),
  );
  const activityTags = useSelector(selectActivityTagsForForm)(formId).reduce(
    (tagsMap, tag) => ({ ...tagsMap, null: 'N/A', [tag._id]: tag.name }),
    {},
  );
  const objectLabelsMapping = useSelector(selectObjectLabelsMapping());
  const fieldsLabelMapping = useSelector(selectFieldLabelsMapping());
  const allLabels = useSelector(selectAllLabels());

  const optionsLabelMapping = useMemo(() => {
    return {
      submitter: submissions.reduce(
        (results, submission) => ({
          ...results,
          [submission.recipientId as string]: submission.submitter,
        }),
        {},
      ),
      tag: activityTags,
      ...objectLabelsMapping,
      ...fieldsLabelMapping,
      ...allLabels,
    };
  }, [
    submissions,
    objectLabelsMapping,
    fieldsLabelMapping,
    allLabels,
    activityTags,
  ]);

  const getOptionLabel = (field: string, id?: string) => {
    if (id) {
      return (
        optionsLabelMapping?.[reparseKey(field)]?.[id] ||
        optionsLabelMapping?.[id] ||
        id
      );
    }
    return optionsLabelMapping?.[reparseKey(field)] ?? field;
  };

  // onInitialize
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(defaultMapping);
    setValues(isEmpty(defaultMapping) ? INITIAL_FILTER_VALUES : defaultMapping);
  }, [form, defaultMapping]);

  const onValueChange = (obj) => {
    setValues({ ...values, ...obj });
    setValidationError({});
  };
  const onClear = (fields: string[]) => {
    form.setFieldsValue(
      fields.reduce(
        (results, field) => ({
          ...results,
          [field]: undefined,
        }),
        {},
      ),
    );
    setValues(omit(values, fields));
  };
  const onDeselect = (key: string, itemsToDeselect: string[]) => {
    if (!values[key] || !Array.isArray(values[key])) return;
    const selectedValues = values[key].filter(
      (item) => !itemsToDeselect.includes(item),
    );
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
    <Context.Provider
      value={{
        selectedProperty,
        setSelectedProperty,
        form,
        values,
        validationError,
        onValueChange,
        onClear,
        onDeselect,
        onSubmit,
        filterLookupMap: beautifyObject({
          ...omit(filterLookupMap, ['objectFilters']),
          objects: {
            ...filterLookupMap.objects,
            ...filterLookupMap.objectFilters,
          },
        }),
        getOptionLabel,
        tableType,
      }}
    >
      <Form
        form={form}
        layout='vertical'
        onValuesChange={onValueChange}
        initialValues={INITIAL_FILTER_VALUES}
      >
        {children({ values, onSubmit })}
      </Form>
    </Context.Provider>
  );
};

export default {
  Context,
  Provider,
};
