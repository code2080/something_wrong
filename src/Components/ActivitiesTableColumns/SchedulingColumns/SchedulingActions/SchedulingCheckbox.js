import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MinusSquareOutlined, CheckSquareOutlined } from '@ant-design/icons';

// ACTIONS
import { setSchedulingStatusOfActivities } from '../../../../Redux/Activities/activities.actions';

// CONSTANTS
import { activityStatuses } from '../../../../Constants/activityStatuses.constants';

// STYLES
import './SchedulingCheckbox.scss';

const getClassNameForSchedulingStatus = (activityStatus, showInvertedState) => {
  if (showInvertedState) {
    if (activityStatus === activityStatuses.SCHEDULED)
      return activityStatuses.NOT_SCHEDULED;
    return activityStatuses.SCHEDULED;
  } else {
    return activityStatus !== activityStatuses.SCHEDULED
      ? activityStatuses.NOT_SCHEDULED
      : activityStatuses.SCHEDULED;
  }
};

const MarkAsScheduledPopover = ({ onConfirm, onCancel }) => {
  const [reservationId, setReservationId] = useState(undefined);
  return (
    <div className='popover-scheduled--wrapper'>
      <Form.Item title='Add a reservation id to the scheduling status:'>
        <Input
          placeholder='Enter the reservation id here'
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
        />
      </Form.Item>
      <div className='popover-scheduled--buttons'>
        <Button
          type='default'
          size='small'
          disabled={!reservationId}
          onClick={() => onConfirm(reservationId)}
        >
          Use reservation id
        </Button>
        <Button type='default' size='small' onClick={() => onConfirm(null)}>
          No reservation id
        </Button>
        <Button type='danger' size='small' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

MarkAsScheduledPopover.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const SchedulingCheckbox = ({ activity }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();

  const [showInvertedState, setShowInvertedState] = useState(false);
  const onUpdateSchedulingStatus = () => {
    dispatch(
      setSchedulingStatusOfActivities(formId, [
        {
          activityId: activity._id,
          activityStatus: activityStatuses.SCHEDULED,
          errorDetails: null,
          reservationId: null,
        },
      ]),
    );
  };

  const onUnscheduleActivity = () => {
    dispatch(
      setSchedulingStatusOfActivities(formId, [
        {
          activityId: activity._id,
          activityStatus: activityStatuses.NOT_SCHEDULED,
          errorDetails: null,
          reservationId: null,
        },
      ]),
    );
  };

  const derivedSchedulingStatus = getClassNameForSchedulingStatus(
    activity.activityStatus,
    showInvertedState,
  );

  return (
    <div
      onMouseEnter={() => setShowInvertedState(true)}
      onMouseLeave={() => setShowInvertedState(false)}
      className={`scheduling-checkbox--wrapper ${derivedSchedulingStatus}`}
    >
      {activity.activityStatus !== activityStatuses.SCHEDULED && (
        <Button
          size='small'
          icon={
            derivedSchedulingStatus !== activityStatuses.SCHEDULED ? (
              <MinusSquareOutlined />
            ) : (
              <CheckSquareOutlined />
            )
          }
          onClick={onUpdateSchedulingStatus}
          className={derivedSchedulingStatus}
        />
      )}
      {activity.activityStatus === activityStatuses.SCHEDULED && (
        <Popconfirm
          title='Are you sure you want to unschedule this activity?'
          onConfirm={onUnscheduleActivity}
          okText='Yes'
          cancelText='No'
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
          trigger={'click'}
        >
          <Button
            size='small'
            icon={
              derivedSchedulingStatus !== activityStatuses.SCHEDULED ? (
                <MinusSquareOutlined />
              ) : (
                <CheckSquareOutlined />
              )
            }
            className={derivedSchedulingStatus}
          />
        </Popconfirm>
      )}
    </div>
  );
};

SchedulingCheckbox.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default SchedulingCheckbox;
