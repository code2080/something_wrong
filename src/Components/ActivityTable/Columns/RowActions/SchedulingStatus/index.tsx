import { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MinusSquareOutlined, CheckSquareOutlined } from '@ant-design/icons';

// REDUX
import { setSchedulingStatusOfActivities } from '../../../../../Redux/Activities/activities.actions';

// HOOKS
import { useTECoreAPI } from '../../../../../Hooks/TECoreApiHooks';

// STYLES
import './index.scss';

// TYPES
import { EActivityStatus } from '../../../../../Types/ActivityStatus.enum';
import { TActivity } from '../../../../../Types/Activity.type';

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

type Props = {
  activity: TActivity;
};

const SchedulingCheckbox = ({ activity }: Props) => {
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
        activity.activityStatus !== EActivityStatus.INACTIVE
          ? () => setShowInvertedState(true)
          : undefined
      }
      onMouseLeave={
        activity.activityStatus !== EActivityStatus.INACTIVE
          ? () => setShowInvertedState(false)
          : undefined
      }
      className={`scheduling-checkbox--wrapper ${derivedSchedulingStatus} ${
        activity.activityStatus === EActivityStatus.INACTIVE ? 'disabled' : ''
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
          disabled={activity.activityStatus === EActivityStatus.INACTIVE}
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

export default SchedulingCheckbox;
