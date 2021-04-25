import React from 'react';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectLabelField } from '../../Redux/Integration/integration.selectors';
import { selectObjectRequestById } from '../../Redux/ObjectRequests/ObjectRequestsNew.selectors';

// COMPONENTS
import {
  objectRequestTypeToText,
  RequestType,
} from '../../Constants/ObjectRequest.constants';

// STYLES
import './DatasourceReadonly.scss';

interface Props {
  value: string;
}
const DatasourceReadonly = ({ value }: Props) => {
  const foundObjectRequest = useSelector(selectObjectRequestById(value));
  const labeledField: string = useSelector(
    selectLabelField(foundObjectRequest?.datasource),
  );

  if (!foundObjectRequest) {
    return <div className='datasource--readonly'>{value}</div>;
  }

  return (
    <div className='datasource--readonly'>
      <span
        style={{
          color:
            foundObjectRequest.type === RequestType.MISSING_OBJECT
              ? 'red'
              : 'green',
        }}
      >
        {objectRequestTypeToText[foundObjectRequest.type]}
        &nbsp;
      </span>
      {foundObjectRequest.objectRequest[labeledField] || value}
    </div>
  );
};

export default DatasourceReadonly;
