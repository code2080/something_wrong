import React from 'react';
import { useSelector } from 'react-redux';
import { Menu, Modal } from 'antd';
import _ from 'lodash';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';
import { selectLabelField } from '../../Redux/Integration/integration.selectors';

// CONSTANTS
import {
  objectRequestTypeToText,
  requestStatusToIcon,
  RequestStatus,
  RequestType
} from '../../Constants/objectRequest.constants';

import {
  objectRequestActions,
  objectRequestActionIcon,
  objectRequestActionLabels,
  objectRequestActionCondition,
  objectRequestOnClick,
} from '../../Constants/objectRequestActions.constants';

const ObjectRequestStatusIcon = ({ status }) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];

const ObjectRequestLabel = ({ request }) => {
  const labelField = useSelector(selectLabelField(request.datasource));
  const extIdLabel = useSelector(state => selectExtIdLabel(state)('objects', request.replacementObjectExtId || request.objectExtId));
  const firstFieldLabel = request.objectRequest[labelField] || _.head(Object.values(request.objectRequest));
  return extIdLabel || firstFieldLabel || 'N/A';
}
const ObjectRequestType = ({ type }) => <span className={`requestType ${type === RequestType.MISSING_OBJECT && 'missingObject'}`} >{objectRequestTypeToText[type] || 'N/A'}</span>;

export const ObjectRequestModal = ({onClose, visible, request}) => {
  return <Modal
    title={`${request.type} request`}
    visible={visible}
    getContainer={() => document.getElementById('te-prefs-lib')}
    closable={true}
    footer={null}
    maskClosable={true}
    onCancel={onClose}
    onOk={onClose}
  >
    <h1>Hello world!</h1>
  </Modal>
}

ObjectRequestModal.defaultProps = {
  visible: false,
  request: null,
}

export const ObjectRequestValue = ({ request }) => (
  <div className={'object_request'}>
    <ObjectRequestStatusIcon status={request.status} />
    <ObjectRequestLabel request={request} />
    <ObjectRequestType type={request.type} />
  </div>
);

// This is a function instead of a component because antd styling didn't apply properly when it was a component
export const objectRequestDropdownMenu = ({ dispatch, teCoreAPI, coreCallback, request, showDetails}) => <Menu
  getPopupContainer={() => document.getElementById('te-prefs-lib')}
  onClick={objectRequestOnClick( {dispatch, teCoreAPI, request, coreCallback, showDetails})}
>
  {/* TODO: fix this inline styling? */}
  <span style={{ padding: '5px 12px', cursor:'default' }}>Execute request...</span>
  <Menu.Divider />
  {_.flatMap(objectRequestActions).reduce((items, action) =>
    objectRequestActionCondition(request)[action]
    ? [...items, <Menu.Item key={action} >
        {objectRequestActionIcon[action]} {objectRequestActionLabels[action]}
      </Menu.Item>
    ]
    : items
  , [])}
</Menu>