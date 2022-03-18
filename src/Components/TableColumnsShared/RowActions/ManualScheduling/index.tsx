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

type Props = {
  activity: TActivity;
};

const ManualScheduling = ({ activity }: Props) => {
  const teCoreAPI = useTECoreAPI();
  const dispatch = useDispatch();

  const teCorePayload = useSelector(selectTECPayloadForActivity(activity._id));

  const onManualScheduling = () => {
    if (teCorePayload && activity.activityStatus !== EActivityStatus.INACTIVE) {
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
                  reservationId: reservationIds[0] || undefined,
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
      className={`scheduling-actions--button ${
        activity.activityStatus === EActivityStatus.INACTIVE && 'disabled'
      }`}
      onClick={() => onManualScheduling()}
    >
      <SelectOutlined />
    </div>
  );
};

export default ManualScheduling;
