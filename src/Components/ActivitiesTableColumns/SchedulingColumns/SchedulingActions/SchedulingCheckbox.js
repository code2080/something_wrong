import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Popover, Input, Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// ACTIONS
import { setSchedulingStatusOfActivities } from '../../../../Redux/Activities/activities.actions';

// CONSTANTS
import { activityStatuses } from '../../../../Constants/activityStatuses.constants';

// STYLES
import './SchedulingCheckbox.scss';

const getClassNameForSchedulingStatus = (activityStatus, showInvertedState) => {
  if (showInvertedState) {
    if (activityStatus === activityStatuses.SCHEDULED) return activityStatuses.NOT_SCHEDULED;
    return activityStatuses.SCHEDULED;
  } else {
    return activityStatus !== activityStatuses.SCHEDULED ? activityStatuses.NOT_SCHEDULED : activityStatuses.SCHEDULED;
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
          onChange={e => setReservationId(e.target.value)}
        />
      </Form.Item>
      <div className='popover-scheduled--buttons'>
        <Button type='default' size='small' disabled={!reservationId} onClick={() => onConfirm(reservationId)}>Use reservation id</Button>
        <Button type='default' size='small' onClick={() => onConfirm(null)}>No reservation id</Button>
        <Button type='danger' size='small' onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

MarkAsScheduledPopover.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const SchedulingCheckboxButton = ({ schedulingStatus }) => (
  <Button
    size='small'
    icon={schedulingStatus !== activityStatuses.SCHEDULED ? 'minus-square' : 'check-square'}
    className={schedulingStatus}
  />
);

SchedulingCheckboxButton.propTypes = {
  schedulingStatus: PropTypes.string.isRequired,
};

const SchedulingCheckbox = ({ activity }) => {
  const dispatch = useDispatch();
  const { formId } = useParams();

  const [showInvertedState, setShowInvertedState] = useState(false);
  const [showConfirmSchedulingPopover, setShowConfirmSchedulingPopover] = useState(false);
  const onUpdateSchedulingStatus = (reservationId) => {
    dispatch(setSchedulingStatusOfActivities(formId, [
      {
        activityId: activity._id,
        activityStatus: activityStatuses.SCHEDULED,
        errorDetails: null,
        reservationId: reservationId || null,
      }
    ]));
  };

  const onUnscheduleActivity = () => {
    dispatch(setSchedulingStatusOfActivities(formId, [
      {
        activityId: activity._id,
        activityStatus: activityStatuses.NOT_SCHEDULED,
        errorDetails: null,
        reservationId: null,
      }
    ]));
  };

  const derivedSchedulingStatus = getClassNameForSchedulingStatus(activity.activityStatus, showInvertedState);

  return (
    <div
      onMouseEnter={() => setShowInvertedState(true)}
      onMouseLeave={() => setShowInvertedState(false)}
      className={`scheduling-checkbox--wrapper ${derivedSchedulingStatus}`}
    >
      {activity.activityStatus !== activityStatuses.SCHEDULED && (
        <Popover
          content={(
            <MarkAsScheduledPopover
              onConfirm={onUpdateSchedulingStatus}
              onCancel={() => setShowConfirmSchedulingPopover(false)}
            />
          )}
          title='Mark as scheduled'
          visible={showConfirmSchedulingPopover}
          onVisibleChange={visible => setShowConfirmSchedulingPopover(visible)}
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
          trigger={'click'}
        >
          <Button
            size='small'
            icon={derivedSchedulingStatus !== activityStatuses.SCHEDULED ? 'minus-square' : 'check-square'}
            className={derivedSchedulingStatus}
          />
        </Popover>
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
            icon={derivedSchedulingStatus !== activityStatuses.SCHEDULED ? 'minus-square' : 'check-square'}
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
