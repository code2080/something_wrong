import { SetStateAction, useState } from 'react';
import { Button, Popover } from 'antd';
import { selectExtIdLabel } from 'Redux/TE/te.selectors';
import { useSelector } from 'react-redux';

type Props = {
  hoverContent?: string;
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
  const extIdLabel = useSelector(selectExtIdLabel)('objects', hoverContent);

  const handleHoverChange = (visible: SetStateAction<boolean>) => {
    setHovered(visible);
    setClicked(false);
  };

  const handleClickChange = (visible: SetStateAction<boolean>) => {
    setClicked(visible);
    setHovered(false);
  };
  const origStyle = style;
  hovered || clicked
    ? (style = {
        border: 'none',
        background: 'none',
        color: '#40a9ff',
        height: '24px',
        marginLeft: '0.4rem',
      })
    : (style = origStyle);
  return (
    <Popover
      content={extIdLabel}
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
