import PropTypes from 'prop-types';
import { Progress, Tooltip } from 'antd';

// CONSTANTS
import { formInstanceStatusTypes } from '../../../Constants/formInstanceStatuses.constants';

// STYLES
import './ResponseTracker.scss';

// PROPS
type Props = {
  responses: any[],
};

const renderTooltip = (submissions: number, declined: number, totalCount: number): string => {
  return totalCount > 0
    ? `${submissions} submitted, ${declined} rejected, out of ${totalCount} forms sent or created`
    : 'Form has not been assigned to any recipients'
};

const renderTitle = (submissions: number, declined: number, totalCount: number): string => `${submissions}/${declined}/${totalCount}`;

const ResponseTracker = ({ responses }: Props) => {
  const submissions = responses[formInstanceStatusTypes.SUBMITTED] || 0;
  const declined = responses[formInstanceStatusTypes.DECLINED] || 0;
  const totalCount = Object.values(responses).reduce((tot, value) => tot + value) - declined;

  return (
    <div className="response-tracker--wrapper">
      <Tooltip
        title={renderTooltip(submissions, declined, totalCount)}
        getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
      >
        <Progress
          success={{ percent: ((submissions - declined) / totalCount) * 100 }}
          percent={(submissions / totalCount) * 100}
          size='small'
          strokeColor='red'
          format={() => renderTitle(submissions, declined, totalCount)}
          style={{ width: ''}}
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
