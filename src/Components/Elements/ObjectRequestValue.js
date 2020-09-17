import React from 'react';
import { Menu, Icon } from 'antd';
import _ from 'lodash';

import { objectRequestTypeToText, requestStatusToIcon, RequestStatus } from '../../Constants/ObjectRequest.constants';

const ObjectRequestStatusIcon = ({status}) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];
const ObjectRequestLabel = ({request}) => _.head(Object.values(request)) || 'N/A';
const ObjectRequestType = ({type}) => objectRequestTypeToText[type] || 'N/A';

export const ObjectRequestValue = ({ request }) => <React.Fragment>
  <ObjectRequestStatusIcon status={request.status} /> 
  <ObjectRequestLabel request={request.objectRequest} /> 
  <ObjectRequestType type={request.type} />
</React.Fragment>

// Iplement 
export const objectRequestDropdownMenu = ({ onClick}) => <Menu
    getPopupContainer={() => document.getElementById('te-prefs-lib')}
    onClick={onClick}
    >
      <Menu.Item key='accept'>{requestStatusToIcon[RequestStatus.ACCEPTED]} Accept</Menu.Item>
      <Menu.Item key='decline'>{requestStatusToIcon[RequestStatus.DECLINED]} Decline</Menu.Item>
      <Menu.Item key='replace'>{requestStatusToIcon[RequestStatus.REPLACED]} Replace</Menu.Item>
      <Menu.Item key='search'><Icon type="search" size='small' style={{ color: 'rgb(0,0,0)' }} /> Search</Menu.Item>
    </Menu>