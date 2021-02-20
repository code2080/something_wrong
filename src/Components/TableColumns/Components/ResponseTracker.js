import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Tooltip } from 'antd';

// CONSTANTS
import { formInstanceStatusTypes } from '../../../Constants/formInstanceStatuses.constants';

const ResponseTracker = ({ responses }) => {
  const submissions = responses[formInstanceStatusTypes.SUBMITTED] || 0;
  const declined = responses[formInstanceStatusTypes.DECLINED] || 0;
  const totalCount = Object.values(responses).reduce((tot, value) => tot + value) - declined;
  return (
    <div style={{ marginRight: '8px' }}>
      <Tooltip
        title={
          totalCount > 0
            ? `${submissions} submitted, ${declined} rejected, out of ${totalCount} forms sent or created`
            : 'Form has not been assigned to any recipients'
        }
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <Progress
          successPercent={((submissions - declined) / totalCount) * 100}
          percent={(submissions / totalCount) * 100}
          size='small'
          strokeColor='red'
          format={() => `${submissions}/${declined}/${totalCount}`}
        />
      </Tooltip>
    </div>
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
