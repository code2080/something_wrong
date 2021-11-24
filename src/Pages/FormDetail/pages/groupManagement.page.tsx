import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _, { filter } from 'lodash';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { Modal, Popover } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';

// COMPONENTS
import GroupManagementToolbar from '../../../Components/GroupManagementToolbar';
import { SchedulingColumns } from '../../../Components/ActivitiesTableColumns/SchedulingColumns/SchedulingColumns';
import { StaticColumns } from '../../../Components/ActivitiesTableColumns/StaticColumns/StaticColumns';
import StatusLabel from '../../../Components/StatusLabel/StatusLabel';
import SortableTableCell from '../../../Components/DynamicTable/SortableTableCell';

// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
  selectActivitiesInTable,
} from '../../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import {
  makeSelectActivitiesForForm,
  makeSelectFilteredActivityIdsForForm,
} from '../../../Redux/Activities/activities.selectors';

// HELPERS

// HOOKS
import useActivityScheduling from '../../../Hooks/activityScheduling';
import { getExtIdsFromActivities } from '../../../Utils/ActivityValues/helpers';
import {
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
  makeSelectPaginationParamsForForm,
  selectSelectedActivities,
} from '../../../Redux/GlobalUI/globalUI.selectors';
import { TActivity } from '../../../Types/Activity.type';
import ActivityTable from './ActivityTable';
import { useActivitiesWatcher } from 'Hooks/useActivities';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';
import GroupAllocationDesigner from 'Components/GroupAllocationDesigner';

const GroupManagementPage = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();

  // For refecth activities
  const [fetchingTrigger, setFetchingTrigger] = useState(0);

  /**
   * SELECTORS
   */
  const selectedRowKeys = useSelector(
    selectSelectedActivities(ACTIVITIES_TABLE),
  );

  // Select filters
  const selectedFilterValues = useSelector(
    selectSelectedFilterValues({ formId, origin: ACTIVITIES_TABLE }),
  );

  // Select sorting
  const selectActivityParamSorting = useMemo(
    () => makeSelectSortParamsForActivities(ACTIVITIES_TABLE),
    [],
  );

  const selectedSortingParams = useSelector((state) =>
    selectActivityParamSorting(state, formId),
  );

  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );

  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId, ACTIVITIES_TABLE),
  );

  const selectPaginationParamsForForm = useMemo(
    () => makeSelectPaginationParamsForForm(),
    [],
  );

  const selectedPaginationParams = useSelector((state) =>
    selectPaginationParamsForForm(state, formId, ACTIVITIES_TABLE),
  );

  const allActivities = Object.values(activities).flat();
  const keyedActivities = _.keyBy(allActivities, '_id');

  const selectActivitySortingOrder = useMemo(
    () => makeSelectSortOrderForActivities(ACTIVITIES_TABLE),
    [],
  );
  const sortOrder = useSelector((state) =>
    selectActivitySortingOrder(state, formId),
  );

  const tableDataSource = useMemo(() => {
    const sortedActivities = _.compact<TActivity>(
      sortOrder?.map((activityId) => keyedActivities?.[activityId]),
    );
    return _.isEmpty(sortedActivities) ? allActivities : sortedActivities;
  }, [allActivities, keyedActivities, sortOrder]);

  const [formType, reservationMode] = useSelector((state: any) => {
    const form = state.forms[formId];
    return [form.formType, form.reservationMode];
  });

  useEffect(() => {
    getExtIdsFromActivities(Object.values(activities).flat());
  }, [activities]);

  /**
   * HOOKS
   */
  const { setCurrentPaginationParams } = useActivitiesWatcher({
    formId,
    filters: selectedFilterValues,
    sorters: selectedSortingParams,
    origin: ACTIVITIES_TABLE,
    pagination: selectedPaginationParams,
    trigger: fetchingTrigger,
  });
  const design = useSelector(selectDesignForForm)(formId);
  const selectFilteredActivityIdsForForm = useMemo(
    () => makeSelectFilteredActivityIdsForForm(),
    [],
  );

  const filteredActivityIds = useSelector((state) =>
    selectFilteredActivityIdsForForm(state, formId),
  );

  const isLoading = useSelector(
    createLoadingSelector(['FETCH_ACTIVITIES_FOR_FORM']),
  ) as boolean;

  /*
   * EVENT HANDLERS
   */
  const { handleScheduleActivities, handleDeleteActivities } =
    useActivityScheduling({
      formId,
      formType,
      reservationMode,
    });

  const handleSelectAll = () => {
    dispatch(selectActivitiesInTable(ACTIVITIES_TABLE, filteredActivityIds));
  };

  const onDeselectAll = () => {
    dispatch(selectActivitiesInTable(ACTIVITIES_TABLE, []));
  };

  const onAllocateActivities = async (activityIds: string[]) => {
    console.log(activityIds, filteredActivityIds, activities);
    // await handleScheduleActivities(activityIds);
    // Get full activities - by filtering activities for the selected activityIds?
    // Find the object types on the activities (so we know what can be selected in the GUI)
    // Find the "relatable" types. How do we find them? Configuration? Do we need another Core API call?
    // Display GUI allowing the user to set up a chain of allocations
    // Run allocation chain
    // *   Filter out activity objects of the selected type (which may have been assigned by an earlier allocation)
    // *   Call Core to get related objects for the objects - getRelatedGroups
    // *   Assign related objects to the activities
    // *   Repeat for each allocation in the chain
    // *   Note that a later step is allowed to be for a type assigned in an earlier step, so the type may not be present on the activities initially
    // Persist allocation results
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
        //await handleDeleteActivities(activityIds);
        onDeselectAll();
      },
    });
  };

  const onSortActivities = (sorter: SorterResult<object>): void => {
    if (!sorter?.columnKey) return;
    sorter?.order
      ? dispatch(
          setActivitySorting(
            formId,
            sorter.columnKey,
            sorter.order,
            ACTIVITIES_TABLE,
          ),
        )
      : dispatch(resetActivitySorting(formId, ACTIVITIES_TABLE));
  };

  return (
    <>
      <Popover>
        <GroupAllocationDesigner
          selectableTypes={['-', 'Lokal', 'Klass']}
          selectableGroupTypes={['-', 'Studentgrupp', 'Undergrupp']}
          onAllocateGroups={function (allocations): void {
            console.log(allocations);
          }}
        />
      </Popover>
      <GroupManagementToolbar
        selectedActivityIds={selectedRowKeys}
        onSelectAll={handleSelectAll}
        onDeselectAll={onDeselectAll}
        onAllocateActivities={onAllocateActivities}
        onDeallocateActivities={onDeallocateActivities}
        allActivities={filteredActivityIds}
      />
      <ActivityTable
        tableType={ACTIVITIES_TABLE}
        design={design}
        isLoading={isLoading}
        activities={tableDataSource}
        onSort={onSortActivities}
        additionalColumns={{
          pre: [
            ...SchedulingColumns(selectedRowKeys),
            {
              title: 'Group status',
              key: 'groupManagementStatus',
              dataIndex: undefined,
              width: 110,
              render: (activity: TActivity) => (
                <SortableTableCell
                  className={`activityScheduling_${activity._id}`}
                >
                  {Math.random() > 0.5 ? (
                    <StatusLabel color={'success'}>{'Allocated'}</StatusLabel>
                  ) : (
                    <StatusLabel color={'default'}>
                      {'Not allocated'}
                    </StatusLabel>
                  )}
                </SortableTableCell>
              ),
            },
          ],
          post: StaticColumns,
        }}
        paginationParams={selectedPaginationParams}
        onSetCurrentPaginationParams={setCurrentPaginationParams}
      />
    </>
  );
};
export default GroupManagementPage;
