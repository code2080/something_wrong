import React from 'react';
import { Menu, Icon } from 'antd';

const ObjectRequestDropdownMenu = ({ onClickCallback }) => 
<Menu
    getPopupContainer={() => document.getElementById('te-prefs-lib')}
    onClick={onClickCallback}
    >
      <Menu.Item key='accept'><Icon type="check" size='small' style={{ color: 'rgb(0,255,0)' }} />Accept</Menu.Item>
      <Menu.Item key='decline'><Icon type="close" size='small' style={{ color: 'rgb(255,0,0)' }} />Decline</Menu.Item>
      <Menu.Item key='replace'><Icon type="swap" size='small' style={{ color: 'rgb(0,0,0)' }} />Replace</Menu.Item>
      <Menu.Item key='search'><Icon type="search" size='small' style={{ color: 'rgb(0,0,0)' }} /> Search</Menu.Item>
      <Menu.Item key='teststyles'>Why style here?</Menu.Item>
    </Menu>

export default ObjectRequestDropdownMenu;