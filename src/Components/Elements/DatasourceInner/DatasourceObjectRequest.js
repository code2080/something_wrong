import PropTypes from 'prop-types';

// COMPONENTS
import { DownOutlined } from '@ant-design/icons';
import ObjectRequestLabel from '../ObjectRequestValue';
import ObjectRequestDropdown from './ObjectRequestDropdown';

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
