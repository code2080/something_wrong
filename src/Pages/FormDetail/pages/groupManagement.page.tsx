import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal, Popover } from 'antd';

// COMPONENTS
import GroupManagementToolbar from '../../../Components/GroupManagementToolbar';

// ACTIONS
import { selectActivitiesInTable } from '../../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import {
  makeSelectActivitiesForForm,
  makeSelectFilteredActivityIdsForForm,
} from '../../../Redux/Activities/activities.selectors';

// HELPERS

// HOOKS
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';

import { getExtIdsFromActivities } from '../../../Utils/ActivityValues/helpers';
import { selectSelectedActivities } from '../../../Redux/GlobalUI/globalUI.selectors';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';
import GroupAllocationDesigner from 'Components/GroupAllocationDesigner';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import GroupManagementTable from 'Components/GroupManagement/GroupManagementTable';
import { makeSelectForm } from 'Redux/Forms/forms.selectors';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

const GroupManagementPage = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const selectForm = useMemo(() => makeSelectForm(), []);

  /**
   * SELECTORS
   */
  const selectedRowKeys = useSelector(
    selectSelectedActivities(ACTIVITIES_TABLE),
  );
  const form = useSelector((state) => selectForm(state, formId));
  const design = useSelector(selectDesignForForm)(formId);

  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );

  const submissions = useSelector((state) =>
    makeSelectSubmissions()(state, formId),
  );

  console.log('submissions', submissions);

  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId, ACTIVITIES_TABLE),
  );

  useEffect(() => {
    getExtIdsFromActivities(Object.values(activities).flat());
  }, [activities]);

  /**
   * HOOKS
   */
  const selectFilteredActivityIdsForForm = useMemo(
    () => makeSelectFilteredActivityIdsForForm(),
    [],
  );

  const filteredActivityIds = useSelector((state) =>
    selectFilteredActivityIdsForForm(state, formId),
  );

  /*
   * EVENT HANDLERS
   */
  const handleSelectAll = () => {
    dispatch(selectActivitiesInTable(ACTIVITIES_TABLE, filteredActivityIds));
  };

  const onDeselectAll = () => {
    dispatch(selectActivitiesInTable(ACTIVITIES_TABLE, []));
  };

  const onAllocateActivities = async (activityIds: string[]) => {
    console.log(activityIds, filteredActivityIds, activities);
    // Get full activities - by filtering activities for the selected activityIds?
    // const fullActivities = activities.filter(activitty => activityIds.indexOf(activity.id) !== -1);
    // Find the object types on the activities (so we know what can be selected in the GUI)
    // const typesOnActivities = getObjectTypesPresentOnActivities(activities);
    // Find the "relatable" types. How do we find them? Configuration? Do we need another Core API call?
    // Display GUI allowing the user to set up a chain of allocations
    // Run allocation chain
    // *   Filter out activity objects of the selected type (which may have been assigned by an earlier allocation)
    // *   Call Core to get related objects for the objects - getRelatedGroups (think we can do this once per type for all activities)
    // const allocationTypes = await teCoreAPI.getRelatedGroups(objectExtIds, typeExtId)
    // *   Assign related objects to the activities
    // *   Check the number of tracks on the activity
    // *   Divide the objects among the tracks (an activity with no tracks gets all objects)
    // *   activities.forEach(activity => {
    // *    if(!activity.tracks) {
    // *      addObjectsToActivity(activity, objects);
    // *    } else {
    // *      splitObjectsAmongTracks(activity, objects);
    // *    }
    // *   });
    // *   Repeat for each allocation in the chain
    // *   Note that a later step is allowed to be for a type assigned in an earlier step, so the type may not be present on the activities initially
    // Persist allocation results?
    // Present allocation results
    onDeselectAll();
  };

  // TODO What happens when you deallocate? How do we know what to remove?
  const onDeallocateActivities = async (activityIds: string[]) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') || document.body,
      title: 'Deallocate activities',
      content: 'Are you sure you want to deallocate these activities?',
      onOk: async () => {
        // await handleDeleteActivities(activityIds);
        onDeselectAll();
      },
    });
  };

  /**
   * STATE VARS
   */

  const [availableTypes, setAvailableTypes] = useState([]);

  const teCoreAPI = useTECoreAPI();
  useEffect(() => {
    async function execTypes() {
      const _availableTypes = await teCoreAPI.getAllocationTypes();
      setAvailableTypes(
        _availableTypes instanceof Object ? _availableTypes.subtypes : [],
      );
      console.log('_availableTypes', _availableTypes);
    }
    execTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GroupManagementTable
      form={form}
      submissions={submissions}
      design={design}
    />
  );
};
export default GroupManagementPage;
