import { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MinusSquareOutlined, CheckSquareOutlined } from '@ant-design/icons';

// REDUX
import { batchOperationStatus } from 'Redux/Activities';

// HOOKS
import { useTECoreAPI } from 'Hooks/TECoreApiHooks';

// STYLES
import './index.scss';

// TYPES
import { EActivityStatus } from 'Types/Activity/ActivityStatus.enum';
import { TActivity } from 'Types/Activity/Activity.type';
import { EActivityBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';

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

  /**
   * STATE
   */
  const [showInvertedState, setShowInvertedState] = useState(false);

  /**
   * EVENT HANDLERS
   */
  const onMouseEnter = () => {
    if (activity.activityStatus !== EActivityStatus.INACTIVE) setShowInvertedState(true);
  };

  const onMouseLeave = () => {
    if (activity.activityStatus !== EActivityStatus.INACTIVE) setShowInvertedState(false);
  };

  const onUpdateSchedulingStatus = () => {
    dispatch(batchOperationStatus(formId, { type: EActivityBatchOperation.STATUS, data: [{ _id: activity._id, activityStatus: EActivityStatus.SCHEDULED }] }));
  };

  const onUnscheduleActivity = () => {
    const batchOp = { type: EActivityBatchOperation.STATUS, data: [{ _id: activity._id, activityStatus: EActivityStatus.NOT_SCHEDULED }]};
    if (activity.reservationId) {
      teCoreAPI.deleteReservations({
        activities: [activity],
        callback: () => dispatch(batchOperationStatus(formId, batchOp)),
      });
    } else {
      dispatch(batchOperationStatus(formId, batchOp))
    }
  };

  const derivedSchedulingStatus = getClassNameForSchedulingStatus(
    activity.activityStatus,
    showInvertedState,
  );

  const icon = derivedSchedulingStatus !== EActivityStatus.SCHEDULED ? <MinusSquareOutlined /> : <CheckSquareOutlined />

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`scheduling-checkbox--wrapper ${derivedSchedulingStatus} ${activity.activityStatus === EActivityStatus.INACTIVE ? 'disabled' : ''}`}
    >
      {activity.activityStatus !== EActivityStatus.SCHEDULED && (
        <Button
          size='small'
          icon={icon}
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
          getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLInputElement}
          trigger={'click'}
        >
          <Button
            size='small'
            icon={icon}
            className={derivedSchedulingStatus}
          />
        </Popconfirm>
      )}
    </div>
  );
};

export default SchedulingCheckbox;
