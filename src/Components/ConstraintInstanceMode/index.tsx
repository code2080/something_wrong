import { Radio } from "antd";

// TYPES
import { TConstraintInstance } from "Types/ConstraintProfile.type"

// TYPES
enum EMode {
  OFF = 'OFF',
  SOFT = 'SOFT',
  HARD = 'HARD',
};

type Props = {
  instance: TConstraintInstance;
  onChange: (patch: Partial<TConstraintInstance>) => void; 
};

const ConstraintInstanceMode = ({ instance, onChange }: Props) => {
  const onUpdateMode = (val: EMode) => {
    switch (val) {
      case EMode.OFF:
        onChange({ isActive: false });
        break;
      case EMode.HARD:
        onChange({ isHardConstraint: true, isActive: true });
        break;
      case EMode.SOFT:
        onChange({ isHardConstraint: false, isActive: true, weight: instance.weight || 5 });
        break;
      default:
        break;
    }
  };

  const mode: EMode = !instance.isActive ? EMode.OFF : instance.isHardConstraint ? EMode.HARD : EMode.SOFT;

  return (
    <div className="constraint-instance-mode--wrapper">
      <Radio.Group
        options={[
          { value: EMode.OFF, label: 'Off' },
          { value: EMode.SOFT, label: 'Soft' },
          { value: EMode.HARD, label: 'Hard' },
        ]}
        onChange={(e) => onUpdateMode(e.target.value)}
        value={mode}
        optionType="button"
        buttonStyle="solid"
        size="small"
      />
    </div>
  );
};

export default ConstraintInstanceMode;