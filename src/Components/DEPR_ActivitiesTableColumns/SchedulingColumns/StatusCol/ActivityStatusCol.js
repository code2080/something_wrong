import { useState } from 'react';
import PropTypes from 'prop-types';
import { Popover, Form } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import EditableText from '../../../EditableText/EditableText';
import { CheckOutlined } from '@ant-design/icons';
import StatusLabel from '../../../StatusLabel';

// STYLES
import './ActivityStatusCol.scss';

// CONSTANTS
import { activityStatusProps } from 'Constants/activityStatuses.constants';
import { DATE_TIME_FORMAT } from 'Constants/common.constants';
import { EActivityStatus } from 'Types/ActivityStatus.enum';

// ACTIONS
import { updateActivity } from 'Redux/DEPR_Activities/activities.actions';

// SELECTORS
import { selectActivityStatus } from 'Redux/DEPR_Activities/activities.selectors';

const PopoverContent = ({ activity, activityStatus, onUpdate }) => {
  const [reservationId, setReservationId] = useState(activity.reservationId);

  const onUpdateReservationId = (value) => {
    setReservationId(value);
    onUpdate({
      ...activity,
      reservationId: value,
    });
  };

  return (
    <div className='activity-col--popover'>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label='Status'>
          <StatusLabel
            color={activityStatusProps[activityStatus]?.color ?? 'default'}
          >
            {activityStatusProps[activityStatus]?.label ?? activityStatus}
          </StatusLabel>
        </Form.Item>
        {activityStatus === EActivityStatus.FAILED && (
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
              ? moment
                  .utc(activity.schedulingTimestamp)
                  .format(DATE_TIME_FORMAT)
              : 'N/A'}
          </div>
        </Form.Item>
        {activityStatus === EActivityStatus.SCHEDULED && (
          <Form.Item label='ID'>
            <EditableText
              value={reservationId}
              onChange={onUpdateReservationId}
              placeholder='N/A'
            />
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

const StatusText = ({ activity, activityStatus }) => {
  switch (activityStatus) {
    case EActivityStatus.SCHEDULED:
      return (
        <span>
          <CheckOutlined />
          &nbsp;ID:&nbsp;{activity.reservationId || 'N/A'}
        </span>
      );
    default:
      return activityStatusProps[activityStatus]?.label ?? activityStatus;
  }
};

const ActivityStatusCol = ({ activity }) => {
  const dispatch = useDispatch();
  const onUpdate = (updatedActivity) => {
    dispatch(updateActivity(updatedActivity));
  };
  const activityStatus = useSelector(selectActivityStatus(activity));

  return (
    <div className='activity-status-column'>
      <Popover
        title='Scheduling information'
        content={
          <PopoverContent
            activityStatus={activityStatus}
            activity={activity}
            onUpdate={onUpdate}
          />
        }
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <StatusLabel
          color={activityStatusProps[activityStatus]?.color ?? 'default'}
        >
          <StatusText activity={activity} activityStatus={activityStatus} />
        </StatusLabel>
      </Popover>
    </div>
  );
};

PopoverContent.propTypes = {
  activity: PropTypes.object.isRequired,
  activityStatus: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};

StatusText.propTypes = {
  activity: PropTypes.object.isRequired,
  activityStatus: PropTypes.string.isRequired,
};

ActivityStatusCol.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityStatusCol;
