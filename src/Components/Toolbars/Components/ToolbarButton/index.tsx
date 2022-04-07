/* eslint-disable react/prop-types */
import { Button } from 'antd';

// STYLES
import './index.scss';

// TYPES
type Props = {
  [x: string]: any;
};

const ToolbarButton: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <Button
      {...rest}
      size='small'
      type='default'
      className={`toolbar-button--wrapper ${
        rest.className ? rest.className : ''
      }`}
    >
      {children}
    </Button>
  );
};

export default ToolbarButton;
