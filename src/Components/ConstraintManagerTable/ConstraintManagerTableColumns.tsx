import isEmpty from 'lodash/isEmpty';
import { Switch, InputNumber } from 'antd';
import type { TConstraint } from '../../Types/Constraint.type';
import type { TConstraintInstance } from '../../Types/ConstraintConfiguration.type';
import ParameterCascader from './Components/ParameterCascader';

const getPropFromConstraint = (constraintId, prop, allConstraints) => {
  const constraint = allConstraints.find(
    (el) => el.constraintId === constraintId,
  );
  if (!constraint || !constraint[prop]) return 'N/A';
  return constraint[prop];
};

const renderConstraintParameters = (
  paramFields,
  paramElements,
  allConstraints: TConstraint[],
  constraintId: string,
  activityDesignObj,
  oldParameters,
  oldOperator: string,
  onUpdateValue,
) => {
  const operators = getPropFromConstraint(
    constraintId,
    'allowedOperators',
    allConstraints,
  );

  const parameters = getPropFromConstraint(
    constraintId,
    'parameters',
    allConstraints,
  );

  return !isEmpty(parameters) ? (
    <ParameterCascader
      constraintId={constraintId}
      paramFields={paramFields}
      paramFormElements={paramElements}
      availableOperators={operators}
      activityDesignObj={activityDesignObj}
      oldParameters={oldParameters}
      operator={oldOperator}
      onUpdate={onUpdateValue}
    />
  ) : null;
};
const constraintManagerTableColumns = (
  onUpdateValue: (constraintId: string, field: string, value: boolean) => void,
  allConstraints: TConstraint[],
  paramFields,
  paramElements,
  activityDesignObj,
) => [
  {
    title: 'Active',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive: boolean, constraintInstance: TConstraintInstance) => (
      <Switch
        checked={isActive}
        size='small'
        onChange={(checked) =>
          onUpdateValue(constraintInstance.constraintId, 'isActive', checked)
        }
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'constraintId',
    key: 'name',
    render: (constraintId) =>
      getPropFromConstraint(constraintId, 'name', allConstraints),
  },
  /* {
    title: 'Description',
    dataIndex: 'constraintId',
    key: 'description',
    render: (constraintId) =>
      getPropFromConstraint(constraintId, 'description', allConstraints),
  }, */
  {
    title: 'Parameters',
    dataIndex: 'constraintId',
    key: 'parameters',
    render: (constraintId: string, constraintInstance: TConstraintInstance) =>
      renderConstraintParameters(
        paramFields,
        paramElements,
        allConstraints,
        constraintId,
        activityDesignObj,
        constraintInstance.parameters,
        constraintInstance.operator,
        onUpdateValue,
      ),
  },
  {
    title: 'Hard Constraint',
    dataIndex: undefined,
    key: 'isHardConstraint',
    render: (hardConstraint, ci) => {
      return hardConstraint.weight !== null ? (
        <Switch
          checked={hardConstraint.isHardConstraint}
          size='small'
          onChange={(checked) =>
            onUpdateValue(ci.constraintId, 'isHardConstraint', checked)
          }
        />
      ) : null;
    },
  },
  {
    title: 'Weight',
    dataIndex: undefined,
    key: 'weight',
    // eslint-disable-next-line react/prop-types
    render: ({ constraintId, weight, isHardConstraint }) => {
      return weight !== null ? (
        <InputNumber
          min={1}
          max={100}
          value={weight}
          disabled={isHardConstraint}
          size='small'
          onChange={(val) => onUpdateValue(constraintId, 'weight', val)}
        />
      ) : null;
    },
  },
];

export default constraintManagerTableColumns;
