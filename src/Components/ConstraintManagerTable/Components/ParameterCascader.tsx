import { Select, Cascader } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { selectMultipleExtIdLabels } from 'Redux/TE/te.selectors';
import { useState } from 'react';

const { Option } = Select;

type ParameterType = {
  firstParam: CascaderValueType | undefined;
  lastParam: CascaderValueType | undefined;
};

type Props = {
  constraintId: string;
  paramFields: any;
  paramFormElements: any;
  availableOperators: string[];
  activityDesignObj: any;
  oldParameters: ParameterType | undefined;
  operator: string;
  onUpdate: (
    constraintId: string,
    field: string,
    value: ParameterType | string,
  ) => void;
};

const ParameterCascader = ({
  constraintId,
  paramFields,
  availableOperators,
  activityDesignObj,
  paramFormElements,
  oldParameters,
  operator,
  onUpdate,
}: Props) => {
  const labels = useSelector(selectMultipleExtIdLabels)(
    Object.keys(activityDesignObj).map((extId) => ({
      field: 'types',
      extId,
    })),
  );

  const firstParam = Array.isArray(oldParameters)
    ? oldParameters.flatMap((param) => param?.firstParam)
    : oldParameters?.firstParam;
  const lastParam = Array.isArray(oldParameters)
    ? oldParameters.flatMap((param) => param?.lastParam)
    : oldParameters?.lastParam;

  const [parameters, setParameters] = useState<{
    firstParam?: CascaderValueType;
    lastParam?: CascaderValueType;
  }>({
    firstParam: firstParam,
    lastParam: lastParam,
  });
  const fieldOptions = activityDesignObj
    ? [
        ...Object.keys(activityDesignObj).map((objField) => ({
          value: objField,
          label: labels[objField],
          children: Object.entries(
            paramFields[objField] ?? { [objField]: objField },
          ).map(([value, label]) => ({
            value,
            label,
          })),
        })),
      ]
    : [];
  const MissingOptionsMessage = 'Missing Activity Design';

  const options = _.isEmpty(activityDesignObj)
    ? []
    : [
        _.isEmpty(paramFormElements)
          ? {}
          : {
              value: 'Form',
              label: 'Form',
              children: paramFormElements,
            },
        {
          value: 'Objects',
          label: 'Objects',
          children: fieldOptions,
        },
      ];
  return (
    <div>
      <Cascader
        notFoundContent={MissingOptionsMessage}
        defaultValue={parameters?.firstParam}
        options={options}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        onChange={(selected) => {
          setParameters({
            firstParam: selected,
            lastParam: parameters.lastParam,
          });
          onUpdate(constraintId, 'parameters', {
            firstParam: selected,
            lastParam: parameters.lastParam,
          });
        }}
      />{' '}
      <Select
        defaultValue={operator}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        onChange={(selected) => {
          onUpdate(constraintId, 'operator', selected);
        }}
      >
        {availableOperators.map((operator) => (
          <Option key={operator} value={operator}>
            {operator}
          </Option>
        ))}
      </Select>{' '}
      <Cascader
        notFoundContent={MissingOptionsMessage}
        defaultValue={parameters?.lastParam}
        options={options}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        onChange={(selected) => {
          setParameters({
            firstParam: parameters.firstParam,
            lastParam: selected,
          });
          onUpdate(constraintId, 'parameters', {
            firstParam: parameters.firstParam,
            lastParam: selected,
          });
        }}
      />
    </div>
  );
};

export default ParameterCascader;
