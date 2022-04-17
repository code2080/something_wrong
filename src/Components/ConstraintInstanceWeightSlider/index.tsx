import { Slider } from "antd";

// TYPES
import { TConstraintInstance } from "Types/ConstraintProfile.type"

// TYPES
type Props = {
  instance: TConstraintInstance;
  onChange: (patch: Partial<TConstraintInstance>) => void; 
};

const ConstraintInstanceWeightSlider = ({ instance, onChange }: Props) => {
  const onUpdateSliderValue = (val: number) => {
    onChange({ isActive: true, isHardConstraint: false, weight: val });
  };

  return (
    <div style={{ width: '300px' }}>
      <Slider
        getTooltipPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
        marks={{
          1: '1',
          5: '5',
          10: '10',
        }}
        min={1}
        max={10}
        step={1}
        value={instance.weight || 5}
        onChange={onUpdateSliderValue}
        style={{ marginBottom: '18px' }}
        disabled={!instance.isActive || instance.isHardConstraint}
      />
    </div>
  );
};

export default ConstraintInstanceWeightSlider;