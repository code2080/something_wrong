import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import ObjectRequestDropdown from './ObjectRequestDropdown';
import ObjectRequestLabel from '../ObjectRequestValue';
import { DownOutlined } from '@ant-design/icons';

const DatasourceObjectRequest = ({ request, readonly }) => {
  if (!request) return null;
  return (
    <ObjectRequestDropdown request={request} readonly={readonly}>
      <div className='element__datasource--wrapper'>
        <div className='element__datasource--inner'>
          <ObjectRequestLabel request={request} />
          &nbsp;
          <DownOutlined style={{ fontSize: '10px' }} />
        </div>
      </div>
    </ObjectRequestDropdown>
  );
};

DatasourceObjectRequest.propTypes = {
  request: PropTypes.object.isRequired,
  readonly: PropTypes.bool,
};
DatasourceObjectRequest.defaultProps = {
  readonly: false,
};

export default DatasourceObjectRequest;
