import {
  RowActionsColumn,
  TagColumn,
  SchedulingStatusColumn,
  SubmitterColumn,
} from 'Components/ActivityTable/Columns';
import ActivityTable from '../ActivityTable';
import JointTeachingGroupsTable from './JointTeachingGroupsTable';

const MatchedActivities = () => {
  return (
    <ActivityTable
      preCustomColumns={[RowActionsColumn, TagColumn, SchedulingStatusColumn]}
      postCustomColumns={[SubmitterColumn]}
    />
  );

  //todo: remove
  return (
    <div>
      <JointTeachingGroupsTable />
    </div>
  );
};

export default MatchedActivities;
