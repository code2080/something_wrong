import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Form, Icon } from 'antd';
import moment from 'moment';
import _ from 'lodash';

// COMPONENTS
import StatusLabel from '../../../StatusLabel/StatusLabel';

// STYLES
import './ActivityStatusCol.scss';

// CONSTANTS
import { activityStatusProps, activityStatuses } from '../../../../Constants/activityStatuses.constants';
import { DATE_TIME_FORMAT } from '../../../../Constants/common.constants';

const PopoverContent = ({ activity }) => (
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
          {activity.schedulingTimestamp ? moment.utc(activity.schedulingTimestamp).format(DATE_TIME_FORMAT) : 'N/A'}
        </div>
      </Form.Item>
    </Form>
  </div>
);

const StatusText = ({ activity }) => {
  switch (activity.activityStatus) {
    case activityStatuses.SCHEDULED:
      return (
        <span>
          <Icon type="check" />&nbsp;ID:&nbsp;{activity.reservationId || 'N/A'}
        </span>
      );
    default:
      return activityStatusProps[activity.activityStatus].label
  }
};

const ActivityStatusCol = ({ activity }) => {
  return (
    <Popover
      title="Scheduling information"
      content={<PopoverContent activity={activity} />}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <StatusLabel color={activityStatusProps[activity.activityStatus].color}>
        <StatusText activity={activity} />
      </StatusLabel>
    </Popover>
  );
};

PopoverContent.propTypes = {
  activity: PropTypes.object.isRequired,
};

StatusText.propTypes = {
  activity: PropTypes.object.isRequired,
};

ActivityStatusCol.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityStatusCol;
