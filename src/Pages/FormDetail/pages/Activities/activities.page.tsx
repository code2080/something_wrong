import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// COMPONENTS
import ActivitiesToolbar from 'Components/ActivitiesToolbar';
import ActivityTable from 'Components/ActivityTable';
import {
  RowActionsColumn,
  SchedulingStatusColumn,
  SubmitterColumn,
  TagColumn,
} from 'Components/ActivityTable/Columns';
import WeekPatternTable from 'Components/WeekPatternTable';

// REDUX
import { fetchTagsForForm } from 'Redux/Tags';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// TYPES
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';

const ActivitiesPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const { groupBy } = useSSP();

  /**
   * EFFECTS
   */
  useEffect(() => {
    // Need to make sure some secondary resources are loaded
    dispatch(fetchTagsForForm(formId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ActivitiesToolbar />
      {groupBy === EActivityGroupings.FLAT && (
        <ActivityTable
          preCustomColumns={[RowActionsColumn, TagColumn, SchedulingStatusColumn]}
          postCustomColumns={[SubmitterColumn]}
        />
      )}
      {groupBy === EActivityGroupings.WEEK_PATTERN && (
        <WeekPatternTable />
      )}
    </>
  );
};

export default ActivitiesPage;
