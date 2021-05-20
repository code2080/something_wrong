import { Select, Cascader } from 'antd';

const { Option } = Select;

type Props = {
  paramFields: any;
  availableOperators: string[];
  activityDesignObj: any;
};

const ParameterCascader = ({
  paramFields,
  availableOperators,
  activityDesignObj,
}: Props) => {
  const options = Object.keys(activityDesignObj).map((objField) => ({
    value: objField,
    label: objField,
    children: Object.keys(
      paramFields[objField] ?? { [objField]: objField },
    ).map((field) => ({
      value: field,
      label: field,
    })),
  }));

  return (
    <div>
      <Cascader
        options={options}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
      />{' '}
      <Select
        placeholder='Operator'
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
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
      />
    </div>
  );
};

export default ParameterCascader;
