import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import StatusLabel from '../../StatusLabel/StatusLabel';

// STYLES
import './AcceptanceStatus.scss';

// CONSTANTS
import { teCoreAcceptanceStatusProps } from '../../../Constants/teCoreProps.constants';

const AcceptanceStatus = ({ acceptanceStatus, acceptanceComment }) => {
  if (!acceptanceStatus) return 'N/A';

  return (
    <div className='acceptance-status--wrapper'>
      <StatusLabel
        color={teCoreAcceptanceStatusProps[acceptanceStatus].color}
        className='no-margin'
      >
        {teCoreAcceptanceStatusProps[acceptanceStatus].label}
      </StatusLabel>
      <div
        className='acceptance-status--comment'
      >
        {acceptanceComment}
      </div>
    </div>
  );
};

AcceptanceStatus.propTypes = {
  acceptanceStatus: PropTypes.string,
  acceptanceComment: PropTypes.string,
};

AcceptanceStatus.defaultProps = {
  acceptanceComment: '',
};

export default AcceptanceStatus;
