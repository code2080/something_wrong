/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Tooltip, Popover, Button } from 'antd';

// TYPES
type Props = {
  tooltipTitle: string;
  disabled?: boolean;
  buttonStyle?: any;
  buttonClassName?: string;
  buttonIcon: React.ReactNode;
};

const TooltipAndPopoverWrapper: React.FC<Props> = ({
  tooltipTitle,
  disabled,
  buttonStyle,
  buttonIcon,
  buttonClassName,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const onHover = () => {
    if (disabled) return;
    setIsHovered(!isHovered && !isClicked);
  };

  const onClick = () => {
    if (disabled) return;
    setIsClicked(!isClicked);
    setIsHovered(false);
  };

  return (
    <Tooltip title={tooltipTitle} visible={isHovered} onVisibleChange={onHover}>
      <Popover
        content={children}
        trigger='click'
        visible={isClicked}
        onVisibleChange={onClick}
      >
        <Button
          disabled={disabled}
          style={buttonStyle || {}}
          icon={buttonIcon}
          className={buttonClassName || ''}
        ></Button>
      </Popover>
    </Tooltip>
  );
};

export default TooltipAndPopoverWrapper;
