import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { SelectOutlined } from '@ant-design/icons';

// COMPONENTS
import { useTECoreAPI } from '../../../../Hooks/TECoreApiHooks';

// REDUX
import {
  batchOperationStatus,
  selectTECPayloadForActivity,
} from 'Redux/Activities';

// TYPES
import { TActivity } from '../../../../Types/Activity/Activity.type';
import { EActivityStatus } from '../../../../Types/Activity/ActivityStatus.enum';
import { EActivityBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';
import classNames from 'classnames';

type Props = {
  activity: TActivity;
};

const ManualScheduling = ({ activity }: Props) => {
  const teCoreAPI = useTECoreAPI();
  const dispatch = useDispatch();

  const teCorePayload = useSelector(selectTECPayloadForActivity(activity._id));

  const handleManualScheduling = () => {
    const { activityStatus, reservationId } = activity;
    if (activityStatus === EActivityStatus.INACTIVE) return;

    if (activityStatus === EActivityStatus.SCHEDULED && reservationId) {
      teCoreAPI.selectReservation({ reservationId });
    } else if (teCorePayload) {
      teCoreAPI.requestManuallyScheduleActivity({
        reservationData: teCorePayload,
        callback: (reservationIds: string[]) => {
          dispatch(
            batchOperationStatus(activity.formId, {
              type: EActivityBatchOperation.STATUS,
              data: [
                {
                  _id: activity._id,
                  activityStatus: EActivityStatus.SCHEDULED,
                  reservationId: reservationIds?.[0] || undefined,
                  schedulingTimestamp: moment.utc(),
                },
              ],
            }),
          );
        },
      });
    }
  };

  return (
    <div
      className={classNames('scheduling-actions--button', {
        disabled: activity.activityStatus === EActivityStatus.INACTIVE,
      })}
      onClick={() => handleManualScheduling()}
    >
      <SelectOutlined />
    </div>
  );
};

export default ManualScheduling;
