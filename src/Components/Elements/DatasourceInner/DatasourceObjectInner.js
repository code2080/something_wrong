import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash'
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'antd';

import { ObjectRequestValue, objectRequestDropdownMenu } from '../ObjectRequestValue';
import { selectObjectRequestsByValues } from '../../../Redux/ObjectRequests/ObjectRequests.selectors'


const DatasourceObjectInner = ({ labels, menu }) => {
  const foundObjReqs = useSelector(selectObjectRequestsByValues(labels));
  return labels.map(label => {
    const objReq = foundObjReqs.find(req => req._id === label);
    return <Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={objReq ? objectRequestDropdownMenu({onClick: ({key}) => console.log(`Whaat key is this: ${key}?`)}) : menu}
      key={label}
    >
      <div className="dd-trigger element__datasource--inner">
        {objReq ? <ObjectRequestValue request={objReq} /> : label || 'N/A'}
        <Icon type="down" />
      </div>
    </Dropdown>
  })
};

DatasourceObjectInner.propTypes = {
  labels: PropTypes.array,
  menu: PropTypes.object.isRequired
};

DatasourceObjectInner.defaultProps = {
  labels: [],
};

export default DatasourceObjectInner;