import _ from 'lodash';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import {
  makeSelectPaginationParamsForForm,
  makeSelectSortOrderForActivities,
  makeSelectSortParamsForActivities,
  selectSelectedActivities,
} from 'Redux/GlobalUI/globalUI.selectors';
import { selectActivitiesForForm } from 'Redux/DEPR_Activities/activities.selectors';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';

// COMPONNETS
import { JointTeachingColumn } from 'Components/DEPR_ActivitiesTableColumns/JointTeachingTableColumns/JointTeachingColumns';
import { TActivity } from 'Types/Activity/Activity.type';

// CONSTANTS
import { SorterResult } from 'antd/lib/table/interface';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { FETCH_ACTIVITIES_FOR_FORM } from 'Redux/DEPR_Activities/activities.actionTypes';
// ACTIONS
import {
  setActivitySorting,
  resetActivitySorting,
} from 'Redux/GlobalUI/globalUI.actions';
// import { useActivitiesWatcher } from 'Hooks/useActivities';
import { useParams } from 'react-router-dom';
import ActivityTable from 'Components/ActivityTable';
import SSPResourceWrapper from 'Components/SSP/Components/Wrapper';
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import {
  fetchActivitiesForForm,
  initializeSSPStateProps,
  fetchActivityFilterLookupMapForForm,
} from 'Redux/Activities';
import { ISSPQueryObject } from 'Types/SSP.type';
import {
  RowActionsColumn,
  TagColumn,
  SchedulingStatusColumn,
  SubmitterColumn,
  jointTeachingObjectColumn,
  primaryObjectColumn,
} from 'Components/ActivityTable/Columns';

interface Props {}
//todo: maybe remove this component and put everything in its parrent
const UnmatchedActivitiesTable = ({}: Props) => {
  const columns = [
    jointTeachingObjectColumn,
    primaryObjectColumn,
    TagColumn,
    SchedulingStatusColumn,
  ];

  return <ActivityTable preCustomColumns={columns} />;
};

export default UnmatchedActivitiesTable;
