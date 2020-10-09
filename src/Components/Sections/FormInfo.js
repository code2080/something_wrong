import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Descriptions } from 'antd';

import './FormInfo.scss';

// COMPONENTS
import OwnerCol from '../TableColumns/Components/OwnerCol';
import ObjectScopeCol from '../TableColumns/Components/ObjectScopeCol';

// SELECTORS
import { selectForm } from '../../Redux/Forms/forms.selectors';

// Include these fields?
//     assigners = [],
//     excludedObjects = [],
//     status,
//     responses,
//     responseCount,

const formToFieldInfo = form => {
  const formatDate = (date, withTime = false) => moment(date).format(`MMM Do YY${withTime ? ', H:mm' : ''}`);
  const formFieldMapping = [{
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
    formatValueFn: value => formatDate(value),
  }, {
    key: 'updatedAt',
    label: 'Updated',
    formatValueFn: value => formatDate(value),
  }, {
    key: 'dueDate',
    label: 'Due',
    formatValueFn: value => formatDate(value),
  }, {
    key: 'allowLateResponses',
    label: 'Allow late responses',
    formatValueFn: value => value ? 'Yes' : 'No',
  }, {
    key: 'formPeriod',
    label: 'Form period',
    formatValueFn: value => `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`,
  }, {
    key: 'objectScope',
    label: 'Object scope',
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
  const formInfoFieldItems = formInfoFields.map((fieldInfo) => {
    return fieldInfo.value && <Descriptions.Item label={fieldInfo.label} key={fieldInfo.label} >{fieldInfo.value}</Descriptions.Item>
  });
  return (
    <div className={'formInfo--wrapper'}>
      <Descriptions title={form.name} bordered size={'small'} >
        {formInfoFieldItems}
      </Descriptions>
    </div>
  );
};

export default FormInfo;