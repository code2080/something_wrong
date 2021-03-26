import PropTypes from 'prop-types';

// CONSTANTS
import { themeColors } from '../../Constants/themeColors.constants';

const MappingStatus = ({ status }) => {
  return (
    <div className='mapping-status--wrapper' style={{ marginRight: '0.4rem' }}>
      <span className='label'>Status:&nbsp;</span>
      {!status && (
        <span style={{ color: themeColors.bittersweet }}>Invalid</span>
      )}
      {status && <span style={{ color: themeColors.jungleGreen }}>Valid</span>}
    </div>
  );
};

MappingStatus.propTypes = {
  status: PropTypes.bool.isRequired,
};

export default MappingStatus;
