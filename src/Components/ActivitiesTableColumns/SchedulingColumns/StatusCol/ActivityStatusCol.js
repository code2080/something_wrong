import PropTypes from 'prop-types';
import { Popover, Form } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { CheckOutlined } from '@ant-design/icons';

// COMPONENTS
import StatusLabel from '../../../StatusLabel/StatusLabel';

// STYLES
import './ActivityStatusCol.scss';

// CONSTANTS
import {
  activityStatusProps,
  activityStatuses,
} from '../../../../Constants/activityStatuses.constants';
import { DATE_TIME_FORMAT } from '../../../../Constants/common.constants';
import { useState } from 'react';
import EditableText from '../../../EditableText/EditableText';
import { useDispatch } from 'react-redux';
import { updateActivity } from '../../../../Redux/Activities/activities.actions';

const PopoverContent = ({ activity, onUpdate }) => {
  const [reservationId, setReservationId] = useState(activity.reservationId);

  const onUpdateReservationId = value => {
    setReservationId(value);
    onUpdate({
      ...activity,
      reservationId: value
    });
  }

  return (
    <div className='activity-col--popover'>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label='Status'>
          <StatusLabel color={activityStatusProps[activity.activityStatus].color}>
            {activityStatusProps[activity.activityStatus].label}
          </StatusLabel>
        </Form.Item>
        {activity.activityStatus === activityStatuses.FAILED && (
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
            {activity.schedulingTimestamp
              ? moment.utc(activity.schedulingTimestamp).format(DATE_TIME_FORMAT)
              : 'N/A'}
          </div>
        </Form.Item>
        <Form.Item label='ID'>
          <EditableText value={reservationId} onChange={onUpdateReservationId} placeholder="N/A" />
        </Form.Item>
      </Form>
    </div>
  );
}

const StatusText = ({ activity }) => {
  switch (activity.activityStatus) {
    case activityStatuses.SCHEDULED:
      return (
        <span>
          <CheckOutlined />
          &nbsp;ID:&nbsp;{activity.reservationId || 'N/A'}
        </span>
      );
    default:
      return activityStatusProps[activity.activityStatus].label;
  }
};

const ActivityStatusCol = ({ activity }) => {
  const dispatch = useDispatch();
  const onUpdate = updatedActivity => {
    dispatch(updateActivity(updatedActivity));
  };

  return (
    <div className='activity-status-column'>
      <Popover
        title='Scheduling information'
        content={<PopoverContent activity={activity} onUpdate={onUpdate} />}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <StatusLabel color={activityStatusProps[activity.activityStatus].color}>
          <StatusText activity={activity} />
        </StatusLabel>
      </Popover>
    </div>
  );
};

PopoverContent.propTypes = {
  activity: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
};

StatusText.propTypes = {
  activity: PropTypes.object.isRequired,
};

ActivityStatusCol.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityStatusCol;
