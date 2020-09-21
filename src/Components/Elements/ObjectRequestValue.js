import React from 'react';
import { useSelector } from 'react-redux';
import { Menu } from 'antd';
import _ from 'lodash';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

// CONSTANTS
import {
  objectRequestTypeToText,
  requestStatusToIcon,
  RequestStatus,
  objectRequestActions,
  objectRequestActionIcon,
  objectRequestActionLabels,
} from '../../Constants/objectRequest.constants';

const ObjectRequestStatusIcon = ({ status }) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];

const ObjectRequestLabel = ({ request }) => {
  // TODO: Make sure the labels are fetched while loading submission, and on return from core.
  const extIdLabel = useSelector(state => selectExtIdLabel(state)('objects', request.replacementObjectExtI || request.objectExtId));
  // TODO: implement core api call to get selected primary field of type. In the meanwhile just use first field listed in obj req
  const firstFieldLabel = _.head(Object.values(request));
  return extIdLabel || firstFieldLabel || 'N/A';
}
const ObjectRequestType = ({ type }) => objectRequestTypeToText[type] || 'N/A';

export const ObjectRequestValue = ({ request }) => <React.Fragment>
  <ObjectRequestStatusIcon status={request.status} />
  <ObjectRequestLabel request={request.objectRequest} />
  <ObjectRequestType type={request.type} />
</React.Fragment>

// Iplement 
export const objectRequestDropdownMenu = ({ onClick }) => <Menu
  getPopupContainer={() => document.getElementById('te-prefs-lib')}
  onClick={onClick}
>
  {/* TODO: style this properly */}
  <span style={{ paddingLeft: '0.8rem', cursor:'default' }}>Execute request...</span>
  <Menu.Divider />
  {_.flatMap(objectRequestActions).map(action =>
    <Menu.Item key={action} >
      {objectRequestActionIcon[action]} {objectRequestActionLabels[action]}
    </Menu.Item>
  )}
</Menu>