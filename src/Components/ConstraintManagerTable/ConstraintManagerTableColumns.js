/* eslint-disable react/prop-types */
import { Switch, InputNumber } from 'antd';
import ParameterCascader from './Components/ParameterCascader'

const getPropFromConstraint = (constraintId, prop, allConstraints) => {
  const constraint = allConstraints.find(
    (el) => el.constraintId === constraintId,
  );
  if (!constraint || !constraint[prop]) return 'N/A';
  return constraint[prop];
};

const renderConstraintParameters = (onGetExtIdParameter) => {

  return(
       <ParameterCascader
          getExtIdParams={onGetExtIdParameter}
       />
  )
}
const constraintManagerTableColumns = (onUpdateValue, allConstraints, onGetExtIdParameter) => [
  {
    title: 'Active',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive, ci) => (
      <Switch
        checked={isActive}
        size='small' 
        onChange={(checked) =>
          onUpdateValue(ci.constraintId, 'isActive', checked)
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
  {
    title: 'Description',
    dataIndex: 'constraintId',
    key: 'description',
    render: (constraintId) =>
      getPropFromConstraint(constraintId, 'description', allConstraints),
  },
  {
    title: 'Parameters',
    dataIndex: 'parameters',
    key: 'parameters',
    render: () => (
      renderConstraintParameters(onGetExtIdParameter)
    ),
  },
  {
    title: 'Hard Constraint',
    dataIndex: 'isHardConstraint',
    key: 'isHardConstraint',
    render: (isHardConstraint, ci) => (
      <Switch
        checked={isHardConstraint}
        size='small'
        onChange={(checked) =>
          onUpdateValue(ci.constraintId, 'isHardConstraint', checked)
        }
      />
    ),
  },
  {
    title: 'Weight',
    dataIndex: undefined,
    key: 'weight',
    render: ({ constraintId, weight, isHardConstraint }) => (
      <InputNumber
        min={1}
        max={100}
        value={weight}
        disabled={isHardConstraint}
        size='small'
        onChange={(val) => onUpdateValue(constraintId, 'weight', val)}
      />
    ),
  },
];


export default constraintManagerTableColumns;
