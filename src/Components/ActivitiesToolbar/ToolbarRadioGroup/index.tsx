/* eslint-disable react/prop-types */
import { Tooltip } from "antd";
import { ReactNode } from "react";

// STYLES
import './index.scss';

// TYPES
type Props = {
  value: string;
  onSelect: (value: string) => void;
  options: { value: string, label: string | ReactNode, tooltip?: string }[];
}
const ToolbarRadioGroup: React.FC<Props> = ({ value, onSelect, options }) => {
  return (
    <div className="toolbar-radio-group--wrapper">
      {options.map((el) => (
        <Tooltip title={el.tooltip || undefined} key={el.value}>
          <div className={`toolbar-radio-group--item ${value === el.value && 'selected'}`} onClick={() => onSelect(el.value)}>{el.label}</div>
        </Tooltip>
      ))}
    </div>
  );
};

export default ToolbarRadioGroup;