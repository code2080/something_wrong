import React from 'react';
import { useSelector } from 'react-redux';
import { Menu, Modal, Table } from 'antd';
import _ from 'lodash';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';
import { selectLabelField } from '../../Redux/Integration/integration.selectors';

// CONSTANTS
import {
  objectRequestTypeToText,
  requestStatusToIcon,
  RequestStatus,
  RequestType,
  objectRequestTypeToPlainText,
} from '../../Constants/objectRequest.constants';

import {
  objectRequestActions,
  objectRequestActionIcon,
  objectRequestActionLabels,
  objectRequestActionCondition,
  objectRequestOnClick,
} from '../../Constants/objectRequestActions.constants';

const ObjectRequestStatusIcon = ({ status }) => requestStatusToIcon[status] || requestStatusToIcon[RequestStatus.PENDING];

export const ObjectRequestLabel = ({ request }) => {
  const labelField = useSelector(selectLabelField(request.datasource));
  const extIdLabel = useSelector(state => selectExtIdLabel(state)('objects', request.replacementObjectExtId || request.objectExtId));
  const firstFieldLabel = request.objectRequest[labelField] || _.head(Object.values(request.objectRequest));
  return extIdLabel || firstFieldLabel || 'N/A';
}
const ObjectRequestType = ({ type }) => <span className={`requestType`} style={{ color: type === RequestType.MISSING_OBJECT ? 'red' : 'green' }} >{objectRequestTypeToText[type] || 'N/A'}</span>;

const capitalizeString = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const ObjectRequestModal = ({onClose, visible, request}) => {
  const fieldDatasource = Object.entries(request.objectRequest || {}).map(([field, value]) => ({
    key: field,
    field: field,
    value: value,
  }));
  const objectTypeLabel = useSelector(state => selectExtIdLabel(state)('types', request.datasource));
  const objectLabel = useSelector(state => selectExtIdLabel(state)('objects', request.objectExtId));
  return <Modal
    className='object_request'
    title={'Object request details'}
    visible={visible}
    getContainer={() => document.getElementById('te-prefs-lib')}
    closable={true}
    footer={null}
    maskClosable={true}
    onCancel={onClose}
    onOk={onClose}
    width={320}
  >
    <b>Reguest type:</b> <ObjectRequestType type={request.type} /> {objectRequestTypeToPlainText[request.type]}<br />
    <b>Status:</b> <ObjectRequestStatusIcon status={request.status} />{capitalizeString(request.status || RequestStatus.PENDING)}<br />
    <b>Object type:</b> {objectTypeLabel}
    {!_.isEmpty(objectLabel) && <React.Fragment><b>Object:</b> objectLabel<br /></React.Fragment>}
    <br /><br />
    <b>Request content:</b><br />
    <Table bordered dataSource={fieldDatasource} pagination={{ hideOnSinglePage: true }}>
      <Table.Column title='Field' dataIndex='field' key='field' render={field => <b>{field}:</b>} />
      <Table.Column title='Value' dataIndex='value' key='value' />
    </Table>
  </Modal>
};

ObjectRequestModal.defaultProps = {
  visible: false,
  request: null,
};

export const ObjectRequestValue = ({ request }) => (
  <div className={'object_request'}>
    <ObjectRequestStatusIcon status={request.status} />
    <ObjectRequestLabel request={request} />
    <ObjectRequestType type={request.type} />
  </div>
);

// This is a function instead of a component because antd styling didn't apply properly when it was a component
export const objectRequestDropdownMenu = ({ dispatch, teCoreAPI, coreCallback, request, spotlightRef, showDetails }) => <Menu
  getPopupContainer={() => document.getElementById('te-prefs-lib')}
  onClick={objectRequestOnClick( {dispatch, teCoreAPI, coreCallback, request, spotlightRef, showDetails})}
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