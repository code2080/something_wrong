import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Form } from 'antd';
import moment from 'moment';
import _ from 'lodash';

// COMPONENTS
import StatusLabel from '../../StatusLabel/StatusLabel';

// STYLES
import './ActivityStatusCol.scss';

// CONSTANTS
import { activityStatusProps, activityStatuses } from '../../../Constants/activityStatuses.constants';

const ActivityStatusCol = ({ activity }) => {
  const content = (
    <div className="activity-col--popover">
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="Status">
          <StatusLabel color={activityStatusProps[activity.activityStatus].color}>
            {activityStatusProps[activity.activityStatus].label}
          </StatusLabel>
        </Form.Item>
        {activity.activityStatus === activityStatuses.FAILED && (
          <Form.Item label="Error">
            {`${_.get(activity, 'errorDetails.message', '')} (${_.get(activity, 'errorDetails.code', '')})`}
          </Form.Item>
        )}
        <Form.Item label="Time">
          <div className="ant-form-text">
            {activity.schedulingTimestamp ? moment.utc(activity.schedulingTimestamp).format('YYYY-MM-DD HH:mm') : 'N/A'}
          </div>
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <Popover
      title="Scheduling information"
      content={content}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <StatusLabel color={activityStatusProps[activity.activityStatus].color}>
        {activityStatusProps[activity.activityStatus].label}
      </StatusLabel>
    </Popover>
  );
};

ActivityStatusCol.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityStatusCol;
