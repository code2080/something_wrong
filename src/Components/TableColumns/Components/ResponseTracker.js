import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Tooltip } from 'antd';

// CONSTANTS
import { formInstanceStatusTypes } from '../../../Constants/formInstanceStatuses.constants';

const ResponseTracker = ({ responses }) => {
  const total = responses[formInstanceStatusTypes.SENT] || 0;
  const drafts = responses[formInstanceStatusTypes.DRAFT] || 0;
  const submissions = responses[formInstanceStatusTypes.SUBMITTED] || 0;
  return (
    <Tooltip
      title={
        total
          ? `${submissions} submitted and ${drafts} saved as drafts of ${total} forms sent`
          : 'Form has not been assigned to any recipients'
      }
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <Progress
        percent={total ? (drafts / total) * 100 : 0}
        successPercent={total ? (submissions / total) * 100 : 0}
        size="small"
        format={() => 
          total ? `${submissions}/${total}` : `${submissions}`
        }
      />
    </Tooltip>
  );
};

ResponseTracker.propTypes = {
  responses: PropTypes.object,
};

ResponseTracker.defaultProps = {
  responses: {
    [formInstanceStatusTypes.SENT]: 0,
    [formInstanceStatusTypes.DRAFT]: 0,
    [formInstanceStatusTypes.SUBMITTED]: 0,
  },
};

export default ResponseTracker;
