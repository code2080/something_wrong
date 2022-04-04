import { Slider } from "antd";
import { useMemo } from "react";
import { TConstraintInstance } from "Types/ConstraintProfile.type"

// TYPES
type Props = {
  instance: TConstraintInstance;
  onChange: (patch: Partial<TConstraintInstance>) => void; 
};

const ConstraintInstanceWeightSlider = ({ instance, onChange }: Props) => {
  const onUpdateSliderValue = (val: number) => {
    if (val === 0) return onChange({ isActive: false, isHardConstraint: false, weight: 1 });
    if (val === 11) return onChange({ isActive: true, isHardConstraint: true, weight: 10 });
    return onChange({ isActive: true, isHardConstraint: false, weight: val });
  };

  const sliderValue = useMemo(() => {
    if (!instance.isActive) return 0;
    if (instance.isHardConstraint) return 11;
    if (!instance.weight) return 5;
    return instance.weight;
  }, [instance]);

  return (
    <div style={{ width: '300px' }}>
      <Slider
        getTooltipPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
        marks={{
          0: 'Off',
          1: '1',
          5: '5',
          10: '10',
          11: 'Hard'
        }}
        min={0}
        max={11}
        step={1}
        value={sliderValue}
        onChange={onUpdateSliderValue}
        style={{ marginBottom: '18px' }}
      />
    </div>
  );
};

export default ConstraintInstanceWeightSlider;