import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { SelectOutlined } from '@ant-design/icons';
import head from 'lodash/head';

// COMPONENTS
import { useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useTECoreAPI } from '../../../../Hooks/TECoreApiHooks';

// SELECTORS
import { makeSelectFormInstance } from '../../../../Redux/FormSubmissions/formSubmissions.selectors';
import { selectFormInstanceObjectRequests } from '../../../../Redux/ObjectRequests/ObjectRequests.selectors';
import { selectTECorePayloadForActivity } from '../../../../Redux/DEPR_Activities/activities.selectors';
import { updateActivities } from '../../../../Redux/DEPR_Activities/activities.actions';
import { TActivity } from '../../../../Types/Activity/Activity.type';
import { EActivityStatus } from '../../../../Types/Activity/ActivityStatus.enum';
import { ObjectRequest } from '../../../../Redux/ObjectRequests/ObjectRequests.types';

type SelectActivityButtonProps = {
  activity: TActivity;
};

const SelectActivityButton = ({ activity }: SelectActivityButtonProps) => {
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
      reservationId: head(reservationIds),
      schedulingTimestamp: moment.utc(),
    };

    dispatch(
      updateActivities(updatedActivity.formId, updatedActivity.formInstanceId, [
        updatedActivity,
      ]),
    );
  };

  const onRequestManuallyScheduling = () => {
    if (teCorePayload)
      teCoreAPI.requestManuallyScheduleActivity({
        reservationData: teCorePayload,
        callback: handleManuallyScheduledActivities,
      });
  };

  return (
    <div
      className={classNames('scheduling-actions--button', {
        disabled: activity.isInactive(),
      })}
      onClick={!activity.isInactive() ? onRequestManuallyScheduling : undefined}
    >
      <SelectOutlined />
    </div>
  );
};

SelectActivityButton.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default SelectActivityButton;
