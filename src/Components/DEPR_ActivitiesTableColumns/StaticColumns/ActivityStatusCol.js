import PropTypes from 'prop-types';
import { Popover, Form } from 'antd';
import _ from 'lodash';

// COMPONENTS
import StatusLabel from '../../StatusLabel';

// STYLES
import './ActivityStatusCol.scss';

// CONSTANTS
import { EActivityStatus } from '../../../Types/ActivityStatus.enum';
import { activityStatusProps } from '../../../Constants/activityStatuses.constants';
import { DATE_TIME_FORMAT } from '../../../Constants/common.constants';

const ActivityStatusCol = ({ activity }) => {
  const content = (
    <div className='activity-col--popover'>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label='Status'>
          <StatusLabel
            color={
              activityStatusProps[activity.activityStatus]?.color ?? 'default'
            }
          >
            {activityStatusProps[activity.activityStatus]?.label ??
              activity.activityStatus}
          </StatusLabel>
        </Form.Item>
        {activity.activityStatus === EActivityStatus.FAILED && (
          <Form.Item label='Error'>
            {`${_.get(activity, 'errorDetails.message', '')} (${_.get(
              activity,
              'errorDetails.code',
              '',
            )})`}
          </Form.Item>
        )}
        <Form.Item label='Time'>
          <div className='ant-form-text'>
            {activity.schedulingTimestamp?.local().format(DATE_TIME_FORMAT) ??
              'N/A'}
          </div>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <Popover
      title='Scheduling information'
      content={content}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <StatusLabel
        color={activityStatusProps[activity.activityStatus]?.color ?? 'default'}
      >
        {activityStatusProps[activity.activityStatus]?.label ??
          activity.activityStatus}
      </StatusLabel>
    </Popover>
  );
};

ActivityStatusCol.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityStatusCol;
