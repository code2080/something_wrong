import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

// COMPONENTS
import { ConfirmLeavingPageContext } from '../../Hooks/ConfirmLeavingPageContext';

// STYLES
import './index.scss';

const renderTabBar = (props, DefaultTabBar) => (
  <DefaultTabBar {...props} className={`${props.className} teantd-tabbar`} />
);


const TEAntdTabBar = ({ defaultActiveKey, activeKey, onChange, children }) => {
  const { isModified, triggerConfirm } = useContext(ConfirmLeavingPageContext);
  
  const handleOnChange = (key) => {
    if (isModified) {
      triggerConfirm(() => onChange(key));
    } else {
      onChange(key);
    }
  }

  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      onChange={handleOnChange}
      renderTabBar={renderTabBar}
      animated={false}
    >
      {children}
    </Tabs>
  );
};

TEAntdTabBar.propTypes = {
  defaultActiveKey: PropTypes.string,
  activeKey: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default TEAntdTabBar;
