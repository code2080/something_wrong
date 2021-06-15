import React from 'react';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectObjectRequestById } from '../../Redux/ObjectRequests/ObjectRequestsNew.selectors';

// COMPONENTS
import DatasourceObjectRequest from '../../Components/Elements/DatasourceInner/DatasourceObjectRequest';

// STYLES
import './DatasourceReadonly.scss';

interface Props {
  value: string;
}
const DatasourceReadonly = ({ value }: Props) => {
  const foundObjectRequest = useSelector(selectObjectRequestById(value));

  if (!foundObjectRequest) {
    return <div className='datasource--readonly'>{value}</div>;
  }

  return (
    <div className='datasource--readonly'>
      <DatasourceObjectRequest request={foundObjectRequest} readonly />
    </div>
  );
};

export default DatasourceReadonly;
