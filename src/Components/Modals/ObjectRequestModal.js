import React from 'react';
import { useSelector } from 'react-redux';
import { Modal, Table } from 'antd';
import _ from 'lodash';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

// HELPERS
import { capitalizeString } from '../../Utils/string.helpers';

// COMPONENTS
import { ObjectRequestType, ObjectRequestStatusIcon } from '../Elements/ObjectRequestValue';
import { LabelRenderer } from '../../Utils/rendering.helpers';

// CONSTANTS
import {
  RequestStatus,
  objectRequestTypeToPlainText,
} from '../../Constants/objectRequest.constants';

const ObjectRequestModal = ({onClose, visible, request}) => {
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
      <Table.Column title='Field' dataIndex='field' key='field' render={field => <b><LabelRenderer type='fields' extId={field}/>:</b>} />
      <Table.Column title='Value' dataIndex='value' key='value' />
    </Table>
  </Modal>
};

ObjectRequestModal.defaultProps = {
  visible: false,
  request: null,
};

export default ObjectRequestModal;