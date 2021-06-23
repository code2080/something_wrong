import React, { SetStateAction, useState } from 'react';
import { Button, Popover } from 'antd';

type Props = {
  hoverContent?: string | null;
  clickContent?: any;
  icon?: any;
  style?: object;
};

const HoverAndClickPopOver = ({
  hoverContent,
  clickContent,
  icon,
  style,
}: Props) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleHoverChange = (visible: SetStateAction<boolean>) => {
    setHovered(visible);
    setClicked(false);
  };

  const handleClickChange = (visible: SetStateAction<boolean>) => {
    setClicked(visible);
    setHovered(false);
  };

  return (
    <Popover
      content={hoverContent}
      trigger='hover'
      visible={hovered}
      onVisibleChange={handleHoverChange}
    >
      <Popover
        content={clickContent}
        trigger='click'
        visible={clicked}
        onVisibleChange={handleClickChange}
      >
        <Button style={style || undefined} icon={icon}></Button>
      </Popover>
    </Popover>
  );
};

export default HoverAndClickPopOver;
