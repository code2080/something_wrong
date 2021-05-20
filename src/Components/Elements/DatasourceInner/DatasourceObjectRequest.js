import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// COMPONENTS
import ObjectRequestDropdown from './ObjectRequestDropdown';
import ObjectRequestLabel from '../ObjectRequestValue';
import { DownOutlined } from '@ant-design/icons';

// CONSTANTS
import {
  objectRequestTypeToText,
  RequestStatus,
  RequestType,
} from '../../../Constants/ObjectRequest.constants';

// SELECTORS
import { selectLabelField } from '../../../Redux/Integration/integration.selectors';

const DatasourceObjectRequest = ({ request, readonly }) => {
  const labeledField = useSelector(
    selectLabelField(request && request.datasource),
  );
  if (!request) return null;

  if (request && request.status !== RequestStatus.PENDING) {
    return (
      <ObjectRequestDropdown request={request} readonly={readonly}>
        <div className="element__datasource--wrapper">
          <div className='element__datasource--inner'>
            <ObjectRequestLabel request={request} />
            &nbsp;
            <DownOutlined style={{ fontSize: '10px' }} />
          </div>
        </div>
      </ObjectRequestDropdown>
    )
  }
  return (
    <div className='datasource--readonly'>
      <span
        style={{
          color:
            request.type === RequestType.MISSING_OBJECT
              ? 'red'
              : 'green',
        }}
      >
        {objectRequestTypeToText[request.type]}
        &nbsp;
      </span>
      {request.objectRequest[labeledField] || request._id}
    </div>
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
