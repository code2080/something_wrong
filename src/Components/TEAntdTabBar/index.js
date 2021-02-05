/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

// STYLES
import './index.scss';

const renderTabBar = (props, DefaultTabBar) => (
  <DefaultTabBar {...props} className={`${props.className} teantd-tabbar`} />
);

const TEAntdTabBar = ({ defaultActiveKey, children }) => {
  return (
    <Tabs defaultActiveKey={defaultActiveKey} renderTabBar={renderTabBar} animated={false} >
      {children}
    </Tabs>
  );
};

TEAntdTabBar.propTypes = {
  defaultActiveKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default TEAntdTabBar;
