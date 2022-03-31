/* eslint-disable react/prop-types */
import { Tooltip } from 'antd';
import { ReactNode } from 'react';

// STYLES
import './index.scss';

// TYPES
type Props = {
  value: string;
  onSelect: (value: string) => void;
  options: {
    value: string;
    label: string | ReactNode;
    tooltip?: string;
    disabled?: boolean;
  }[];
};
const ToolbarRadioGroup: React.FC<Props> = ({ value, onSelect, options }) => {
  return (
    <div className='toolbar-radio-group--wrapper'>
      {options.map((el) => {
        const isSelected = value === el.value;
        const isDisabled = !!el.disabled;

        const onClick = () => {
          if (isDisabled) {
            return;
          }

          onSelect(el.value);
        };

        return (
          <Tooltip title={el.tooltip} key={el.value}>
            <div
              className={`
               ${isSelected && 'selected'}
               ${
                 isDisabled
                   ? 'ant-radio-button-wrapper-disabled'
                   : 'toolbar-radio-group--item'
               }`}
              onClick={onClick}
            >
              {el.label}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ToolbarRadioGroup;
