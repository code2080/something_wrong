import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

// COMPONENTS
import ConfirmLeaveTabModal from '../../Components/ConfirmLeaveTabModal/ConfirmLeaveTabModal';

// STYLES
import './index.scss';

const renderTabBar = (props, DefaultTabBar) => (
  <DefaultTabBar {...props} className={`${props.className} teantd-tabbar`} />
);

export const TabContext = React.createContext();

const TEAntdTabBar = ({ defaultActiveKey, activeKey, onChange, children }) => {
  const [isOpen, setOpen] = useState(false);
  const [callback, setCallBack] = useState();

  const handleSave = () => {
    setOpen(false);
    callback();
  };

  const triggerConfirm = (callback) => {
    setOpen(true);
    setCallBack(() => () => callback());
  };

  const handleCancel = () => setOpen(false);

  return (
    <TabContext.Provider value={{ triggerConfirm }}>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        activeKey={activeKey}
        onChange={onChange}
        renderTabBar={renderTabBar}
        animated={false}
      >
        {children}
        <ConfirmLeaveTabModal
          handleSave={handleSave}
          handleCancel={handleCancel}
          isOpen={isOpen}
        />
      </Tabs>
    </TabContext.Provider>
  );
};

TEAntdTabBar.propTypes = {
  defaultActiveKey: PropTypes.string,
  activeKey: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default TEAntdTabBar;
