import React from 'react';
import { Menu, Icon } from 'antd';

import { objectRequestTypeToText } from '../../Constants/ObjectRequest.constants';

const ObjectRequestStatus = status => <Icon type="question" style={{ color: 'rgba(255,0,0, 0.8)' }} />

export const ObjectRequestValue = ({ request }) => <React.Fragment>
  <ObjectRequestStatus status='shouldBeRequest.status' />
  <span>{request.objectExtId}</span>
  <span>{objectRequestTypeToText[request.type]}</span>
</React.Fragment>

// Iplement 
export const objectRequestDropdownMenu = ({ onClick}) => <Menu
    getPopupContainer={() => document.getElementById('te-prefs-lib')}
    onClick={onClick}
    >
      <Menu.Item key='accept'><Icon type="check" size='small' style={{ color: 'rgb(0,255,0)' }} /> Accept</Menu.Item>
      <Menu.Item key='decline'><Icon type="close" size='small' style={{ color: 'rgb(255,0,0)' }} /> Decline</Menu.Item>
      <Menu.Item key='replace'><Icon type="swap" size='small' style={{ color: 'rgb(0,0,0)' }} /> Replace</Menu.Item>
      <Menu.Item key='search'><Icon type="search" size='small' style={{ color: 'rgb(0,0,0)' }} /> Search</Menu.Item>
    </Menu>