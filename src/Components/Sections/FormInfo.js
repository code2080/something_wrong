import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Table } from 'antd';

import './FormInfo.scss';

// COMPONENTS
import OwnerCol from '../TableColumns/Components/OwnerCol';
import ObjectScopeCol from '../TableColumns/Components/ObjectScopeCol';

// SELECTORS
import { selectForm } from '../../Redux/Forms/forms.selectors';
import DateTime from '../Common/DateTime';

// Include these fields?
//     assigners = [],
//     excludedObjects = [],
//     status,
//     responses,
//     responseCount,

const formToFieldInfo = form => {
  const formFieldMapping = [{
    key: 'name',
    label: 'Name',
    formatValueFn: value => value,
  }, {
    key: 'description',
    label: 'Description',
    formatValueFn: value => value,
  }, {
    key: 'ownerId',
    label: 'By',
    formatValueFn: value => <OwnerCol ownerId={value} />,
  }, {
    key: 'createdAt',
    label: 'Created',
    formatValueFn: value => <DateTime value={value} />,
  }, {
    key: 'updatedAt',
    label: 'Updated',
      formatValueFn: value => <DateTime value={value} />,
  }, {
    key: 'dueDate',
    label: 'Due',
      formatValueFn: value => <DateTime value={value} />,
  }, {
    key: 'allowLateResponses',
    label: 'Allow late responses',
    formatValueFn: value => value ? 'Yes' : 'No',
  }, {
    key: 'formPeriod',
    label: 'Form period',
    formatValueFn: value => <b><DateTime value={[value.startDate, value.endDate]} /></b>,
  }, {
    key: 'objectScope',
    label: 'Primary object',
    formatValueFn: value => <ObjectScopeCol objectScope={value} />,
  }, {
    key: 'reservationMode',
    label: 'Reservation mode',
    formatValueFn: value => value,
  }, {
    key: 'allowLinkSharing',
    label: 'Public link',
    formatValueFn: value => value ? 'Yes' : 'No',
  }];
  return formFieldMapping.map(({ key, label, formatValueFn }) => ({
    label: label,
    value: formatValueFn(form[key])
  }));
};

const FormInfo = ({ formId }) => {
  const form = useSelector(selectForm(formId));
  const formInfoFields = formToFieldInfo(form);

  const formInfoFieldData = formInfoFields.reduce((rows, { label: field, value }) =>
    !_.isEmpty(value) ? [...rows, { key: field, field, value }] : rows
    , []);

  return (
    <div className={'formInfo--wrapper'}>
      <Table
        dataSource={formInfoFieldData}
        bordered
        pagination={{
          size: 'small',
          hideOnSinglePage: true,
          defaultPageSize: 20,
        }}
        showHeader={false}
      >
        <Table.Column
          title='Field'
          dataIndex='field'
          key='field'
          width='125px'
          render={field => <b>{field}:</b>}
        />
        <Table.Column
          title='Value'
          dataIndex='value'
          key='value'
        />
      </Table>
    </div>
  );
};

export default FormInfo;