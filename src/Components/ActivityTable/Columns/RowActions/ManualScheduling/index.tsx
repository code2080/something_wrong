import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { SelectOutlined } from '@ant-design/icons';

// COMPONENTS
import { useTECoreAPI } from '../../../../../Hooks/TECoreApiHooks';

// REDUX
import { makeSelectFormInstance } from '../../../../../Redux/FormSubmissions/formSubmissions.selectors';
import { selectFormInstanceObjectRequests } from '../../../../../Redux/ObjectRequests/ObjectRequests.selectors';
import { selectTECorePayloadForActivity } from '../../../../../Redux/Activities/activities.selectors';
import { updateActivities } from '../../../../../Redux/Activities/activities.actions';
import { ObjectRequest } from '../../../../../Redux/ObjectRequests/ObjectRequests.types';

// TYPES
import { TActivity } from '../../../../../Types/Activity.type';
import { EActivityStatus } from '../../../../../Types/ActivityStatus.enum';

type Props = {
  activity: TActivity;
};

const ManualScheduling = ({ activity }: Props) => {
  const teCoreAPI = useTECoreAPI();
  const dispatch = useDispatch();
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, {
      formId: activity.formId,
      formInstanceId: activity.formInstanceId,
    }),
  );
  const formInstanceRequests: ObjectRequest[] = useSelector(
    selectFormInstanceObjectRequests(formInstance),
  );
  const teCorePayload = useSelector(selectTECorePayloadForActivity)(
    activity.formId,
    activity.formInstanceId,
    activity._id,
    formInstanceRequests,
  );

  const handleManuallyScheduledActivities = (reservationIds: string[]) => {
    const updatedActivity = {
      ...activity,
      activityStatus: EActivityStatus.SCHEDULED,
      reservationId: reservationIds[0] || undefined,
      schedulingTimestamp: moment.utc(),
    };

    dispatch(
      updateActivities(updatedActivity.formId, updatedActivity.formInstanceId, [
        updatedActivity,
      ]),
    );
  };

  const onManualScheduling = () => {
    if (teCorePayload)
      teCoreAPI.requestManuallyScheduleActivity({
        reservationData: teCorePayload,
        callback: handleManuallyScheduledActivities,
      });
  };

  return (
    <div
      className={`scheduling-actions--button ${
        activity.activityStatus === EActivityStatus.INACTIVE && 'disabled'
      }`}
      onClick={() =>
        activity.activityStatus === EActivityStatus.INACTIVE &&
        onManualScheduling()
      }
    >
      <SelectOutlined />
    </div>
  );
};

export default ManualScheduling;
