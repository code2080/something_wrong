import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// COMPONENTS
import ObjectRequestDropdown from './ObjectRequestDropdown';
import ObjectRequestValue from '../ObjectRequestValue';

// SELECTORS
import { selectObjectRequestsByValues } from '../../../Redux/ObjectRequests/ObjectRequests.selectors';

const DatasourceObjectInner = ({ labels, menu }) => {
  const foundObjReqs = useSelector(selectObjectRequestsByValues(labels));

  return labels.map(label => {
    const objReq = foundObjReqs.find(req => req._id === label);
    return objReq
      ? <ObjectRequestDropdown request={objReq} key={objReq._id}>
        <div className='element__datasource--inner' >
          <ObjectRequestValue request={objReq} />
          <DownOutlined />
        </div>
      </ObjectRequestDropdown>
      : <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={menu}
        key={label}
      >
        <div className='dd-trigger element__datasource--inner' >
          {label || 'N/A'}
          <DownOutlined />
        </div>
      </Dropdown>;
  });
};

DatasourceObjectInner.propTypes = {
  labels: PropTypes.array,
  menu: PropTypes.object.isRequired
};

DatasourceObjectInner.defaultProps = {
  labels: [],
};

export default DatasourceObjectInner;
