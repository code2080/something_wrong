import { Select, Cascader } from 'antd';
import _ from 'lodash';

const { Option } = Select;

type Props = {
  paramFields: any;
  paramFormElements: any | {};
  availableOperators: string[];
  activityDesignObj: any;
  onSelect?: () => void;
};

const ParameterCascader = ({
  paramFields,
  availableOperators,
  activityDesignObj,
  paramFormElements,
  onSelect,
}: Props) => {
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
          value: 'Objects',
          label: 'Objects',
          children: paramFormElements,
        },
    {
      value: 'Form',
      label: 'Form',
      children: fieldOptions,
    },
  ];

  return (
    <div>
      <Cascader
        options={options}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        onChange={onSelect}
      />{' '}
      <Select
        placeholder='Operator'
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        onChange={onSelect}
      >
        {availableOperators.map((operator) => (
          <Option key={operator} value={operator}>
            {operator}
          </Option>
        ))}
      </Select>{' '}
      <Cascader
        options={options}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
        onChange={onSelect}
      />
    </div>
  );
};

export default ParameterCascader;
