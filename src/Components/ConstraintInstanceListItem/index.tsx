import { List } from "antd";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";

// COMPONENTS
import ParameterCascader from "Components/ConstraintInstanceParameterCascader";
import ConstraintInstanceWeightSlider from "Components/ConstraintInstanceWeightSlider";

// REDUX
import { constraintSelector } from 'Redux/Constraints';

// STYLES
import './index.scss';

// TYPES
import { TActivityDesign } from "Types/ActivityDesign";
import { TConstraint } from "Types/Constraint.type";
import { TConstraintInstance } from "Types/ConstraintProfile.type";

type Props = {
  instance: TConstraintInstance;
  fields: any;
  elements: any;
  activityDesign: TActivityDesign;
  onChange: (updateBody: TConstraintInstance) => void;
};

const ConstraintInstanceListItem = ({ instance, fields, elements, activityDesign, onChange }: Props) => {
  /**
   * SELECTORS
   */
  const constraint: TConstraint | undefined = useSelector(constraintSelector(instance.constraintId));

  /**
   * EVENT HANDLERS
   */
  const onUpdateSingleProp = (prop: keyof TConstraintInstance, val: any) => {
    onChange({ ...instance, [prop]: val });
  }

  const onUpdateMultipleProps = (patch: Partial<TConstraintInstance>) => {
    onChange({ ...instance, ...patch });
  }

  if (!constraint) return null;

  const hasParameters = !isEmpty(constraint.parameters);
  const hasWeight = instance.weight != null;

  return (
    <List.Item
      className="constraint-instance-item--wrapper"
    >
      <List.Item.Meta
        title={constraint.name}
        description={constraint.description}
      />
      <div className={`constraint-instance-item--content ${hasParameters ? 'has-parameters' : ''} ${hasWeight ? 'has-weight' : ''}`}>
        {hasParameters && (
          <ParameterCascader
            paramFields={fields}
            paramFormElements={elements}
            availableOperators={constraint.allowedOperators}
            activityDesignObj={activityDesign.objects}
            oldParameters={instance.parameters as any}
            operator={instance.operator}
            onUpdate={onUpdateSingleProp}
          />
        )}
        {hasWeight && (
          <ConstraintInstanceWeightSlider
            instance={instance}
            onChange={onUpdateMultipleProps}
          />
        )}
      </div>
    </List.Item>
  );
};

export default ConstraintInstanceListItem;