import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MinusSquareOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { useTECoreAPI } from '../../../../Hooks/TECoreApiHooks';

// ACTIONS
import { setSchedulingStatusOfActivities } from '../../../../Redux/DEPR_Activities/activities.actions';

// CONSTANTS

// STYLES
import './SchedulingCheckbox.scss';
import { EActivityStatus } from '../../../../Types/ActivityStatus.enum';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';

const getClassNameForSchedulingStatus = (activityStatus, showInvertedState) => {
  if (showInvertedState) {
    if (activityStatus === EActivityStatus.SCHEDULED)
      return EActivityStatus.NOT_SCHEDULED;
    return EActivityStatus.SCHEDULED;
  } else {
    return activityStatus !== EActivityStatus.SCHEDULED
      ? EActivityStatus.NOT_SCHEDULED
      : EActivityStatus.SCHEDULED;
  }
};

const MarkAsScheduledPopover = ({ onConfirm, onCancel }) => {
  const [reservationId, setReservationId] = useState<string | undefined>(
    undefined,
  );
  return (
    <div className='popover-scheduled--wrapper'>
      <Form.Item>
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
        <Button type='default' size='small' onClick={onCancel}>
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

type SchedulingCheckboxProps = {
  activity: TActivity;
};

const SchedulingCheckbox = ({ activity }: SchedulingCheckboxProps) => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const { formId } = useParams() as { formId: string };

  const [showInvertedState, setShowInvertedState] = useState(false);
  const onUpdateSchedulingStatus = () => {
    dispatch(
      setSchedulingStatusOfActivities(formId, [
        {
          activityId: activity._id,
          activityStatus: EActivityStatus.SCHEDULED,
          errorDetails: null,
          reservationId: null,
        },
      ]),
    );
  };

  const onUnscheduleActivity = () => {
    teCoreAPI.deleteReservations({
      activities: [activity],
      callback: () =>
        dispatch(
          setSchedulingStatusOfActivities(formId, [
            {
              activityId: activity._id,
              activityStatus: EActivityStatus.NOT_SCHEDULED,
              errorDetails: null,
              reservationId: null,
            },
          ]),
        ),
    });
  };

  const derivedSchedulingStatus = getClassNameForSchedulingStatus(
    activity.activityStatus,
    showInvertedState,
  );
  return (
    <div
      onMouseEnter={
        !activity.isInactive() ? () => setShowInvertedState(true) : undefined
      }
      onMouseLeave={
        !activity.isInactive() ? () => setShowInvertedState(false) : undefined
      }
      className={`scheduling-checkbox--wrapper ${derivedSchedulingStatus} ${
        activity.isInactive() ? 'disabled' : ''
      }`}
    >
      {activity.activityStatus !== EActivityStatus.SCHEDULED && (
        <Button
          size='small'
          icon={
            derivedSchedulingStatus !== EActivityStatus.SCHEDULED ? (
              <MinusSquareOutlined />
            ) : (
              <CheckSquareOutlined />
            )
          }
          disabled={activity.isInactive()}
          onClick={onUpdateSchedulingStatus}
          className={derivedSchedulingStatus}
        />
      )}
      {activity.activityStatus === EActivityStatus.SCHEDULED && (
        <Popconfirm
          title='Are you sure you want to cancel this activity?'
          onConfirm={onUnscheduleActivity}
          okText='Yes'
          cancelText='No'
          getPopupContainer={() =>
            document.getElementById('te-prefs-lib') as HTMLInputElement
          }
          trigger={'click'}
        >
          <Button
            size='small'
            icon={
              derivedSchedulingStatus !== EActivityStatus.SCHEDULED ? (
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
