import _ from 'lodash';
import PropTypes from 'prop-types';

// COMPONENTS
import DatasourceFilterInner from './DatasourceFilterInner';
import DatasourceObjectInner from './DatasourceObjectInner';

const DatasourceEmptyInner = () => (
  <div className='element__datasource--inner--empty'>N/A</div>
);

const DatasourceInner = ({ elType, labels, payload, menu }) => {
  if (elType === 'EMPTY' || _.isEmpty(labels)) return <DatasourceEmptyInner />;
  if (elType === 'OBJECT')
    return <DatasourceObjectInner labels={_.flatMap(labels)} menu={menu} />;
  if (elType === 'FILTER')
    return (
      <DatasourceFilterInner labels={labels} payload={payload} menu={menu} />
    );
  return null;
};

DatasourceInner.propTypes = {
  elType: PropTypes.string.isRequired,
  labels: PropTypes.object,
  payload: PropTypes.array,
  menu: PropTypes.object,
};

DatasourceInner.defaultProps = {
  labels: {},
  payload: [],
};

export default DatasourceInner;
