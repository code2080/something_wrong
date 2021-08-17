import PropTypes from 'prop-types';
import { Alert, Button, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import {
  deleteActivities,
  updateActivity,
} from '../../Redux/Activities/activities.actions';
import { unlockActivityDesigner } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import { useTECoreAPI } from '../../Hooks/TECoreApiHooks';
import { useMemo, useState } from 'react';
import { makeSelectActivitiesForForm } from '../../Redux/Activities/activities.selectors';
import { EActivityStatus } from 'Types/ActivityStatus.enum';
import { resetFormFilterValues } from 'Redux/Filters/filters.actions';

const HasReservationsAlert = ({ formId }) => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const [visible, setVisible] = useState(false);
  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );
  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId),
  );
  const scheduledActivities = useMemo(
    () =>
      Object.values(activities)
        .flat()
        .filter((a) => a.reservationId && a.activityStatus !== 'NOT_SCHEDULED'),
    [activities],
  );
  const hasScheduledActivities = scheduledActivities.length > 0;

  const handleDeleteActivities = () => {
    dispatch(deleteActivities(formId));
    dispatch(unlockActivityDesigner({ formId }));
    dispatch(resetFormFilterValues({ formId }));
  };

  const handleDeleteReservations = (responses: any[] = []) => {
    // Check result parameter to see if everything went well or not
    responses.forEach((res) => {
      if (!res?.result?.details) {
        const updatedActivity = {
          ...res.activity,
          schedulingDate: null,
          activityStatus: EActivityStatus.NOT_SCHEDULED,
          reservationId: null,
        };
        dispatch(updateActivity(updatedActivity));
      }
    });
  };

  const handleConfirm = (deleteReservations) => {
    setVisible(false);
    deleteReservations &&
      teCoreAPI.deleteReservations({
        activities: scheduledActivities,
        callback: handleDeleteReservations,
      });
    handleDeleteActivities();
  };

  const onDeleteActivities = () => {
    hasScheduledActivities ? setVisible(true) : handleDeleteActivities();
  };

  return (
    <Alert
      style={{ margin: '8px' }}
      className='activity-designer--alert'
      type='warning'
      message='Editing the configuration will delete existing activities'
      description={
        <>
          <div>
            The form has already been converted to activities with the current
            design. To edit the design, you must first delete the activities.
          </div>
          <Popconfirm
            title='This action will delete all activities for this form.
            You have activities that have been scheduled. Do you also want to delete these reservations?'
            overlayStyle={{ width: '450px', wordWrap: 'break-word' }}
            okText='Yes'
            cancelText='No'
            visible={visible}
            getPopupContainer={() =>
              document.getElementById('te-prefs-lib') as HTMLElement
            }
            onConfirm={() => handleConfirm(true)}
            onCancel={() => handleConfirm(false)}
          >
            <Button size='small' type='link' onClick={onDeleteActivities}>
              Delete activities now
            </Button>
          </Popconfirm>
        </>
      }
    />
  );
};

HasReservationsAlert.propTypes = {
  formId: PropTypes.string.isRequired,
};

export default HasReservationsAlert;
