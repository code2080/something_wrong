import { Select, Cascader } from 'antd';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { selectMultipleExtIdLabels } from 'Redux/TE/te.selectors';

const { Option } = Select;

type Props = {
  paramFields: any;
  paramFormElements: any | {};
  availableOperators: string[];
  activityDesignObj: any;
};

const ParameterCascader = ({
  paramFields,
  availableOperators,
  activityDesignObj,
  paramFormElements,
}: Props) => {
  const labels = useSelector(selectMultipleExtIdLabels)(
    Object.keys(activityDesignObj).map((extId) => ({
      field: 'types',
      extId,
    })),
  );

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
