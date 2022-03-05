/* eslint-disable react/prop-types */
// STYLES
import { Divider, Space } from 'antd';
import './index.scss';

// TYPES
type Props = {
  label: string;
}

const ToolbarGroup: React.FC<Props> = ({ label, children }) => {
  return (
    <div className="toolbar-group--wrapper">
      <div className="toolbar-group--header">
        {label}:  
      </div> 
      <div className="toolbar-group--buttons">
        <Space direction='horizontal' size='small'>{children}</Space>
      </div>
      <Divider type='vertical' />
    </div>
  );
};

export default ToolbarGroup;