import { Select, Cascader } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';
import _ from 'lodash';
import { useState } from 'react';

const { Option } = Select;

type Props = {
  constraintId: string;
  paramFields: any;
  paramFormElements: any | {};
  availableOperators: string[];
  activityDesignObj: any;
  oldParameters: any;
  operator: string;
  onUpdate: (
    constraintId: string,
    field: string,
    value:
      | {
          firstParam: string | CascaderValueType;
          lastParam: string | CascaderValueType;
        }
      | string
      | string[]
      | number[],
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
  const firstParam = Array.isArray(oldParameters)
    ? oldParameters.flatMap((param) => param?.firstParam)
    : [];
  const lastParam = Array.isArray(oldParameters)
    ? oldParameters.flatMap((param) => param?.lastParam)
    : [];

  const [parameters, setParameters] = useState<{
    firstParam: CascaderValueType;
    lastParam: CascaderValueType;
  }>({
    firstParam: firstParam || null,
    lastParam: lastParam || null,
  });

  const fieldOptions = activityDesignObj
    ? [
        ...Object.keys(activityDesignObj).map((objField) => ({
          value: objField,
          label: objField,
          children: Object.keys(
            paramFields[objField] ?? { [objField]: objField },
          ).map((field) => ({
            value: field,
            label: field,
          })),
        })),
      ]
    : [];
  const options = [
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
