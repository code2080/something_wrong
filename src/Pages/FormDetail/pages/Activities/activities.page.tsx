import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import ActivitiesToolbar from 'Components/ActivitiesToolbar';
import ActivityTable from 'Components/ActivityTable';
import {
  PrimaryObjectColumn,
  RowActionsColumn,
  SchedulingStatusSingleColumn,
  TagColumn,
  WeekPatternUIDColumn,
} from 'Components/TableColumnsShared';
import WeekPatternTable from 'Components/WeekPatternTable';

// REDUX
import { fetchTagsForForm } from 'Redux/Tags';
import { selectFormAllowedGroupings } from 'Redux/Forms';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// TYPES
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import TagGroupTable from 'Components/TagGroupTable';
import { selectRunningJobId } from 'Redux/Jobs';
import SchedulingProgressOverlay from 'Components/SchedulingProgressOverlay';

const ActivitiesPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const { groupBy } = useSSP();

  /**
   * SELECTORS
   */
  const { WEEK_PATTERN: hasWeekPattern } = useSelector(
    selectFormAllowedGroupings(formId),
  );
  const runningJobId = useSelector(selectRunningJobId);

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
      <SchedulingProgressOverlay isScheduling={!!runningJobId}>
        {groupBy === EActivityGroupings.FLAT && (
          <ActivityTable
            preCustomColumns={[
              RowActionsColumn,
              PrimaryObjectColumn,
              ...(hasWeekPattern ? [WeekPatternUIDColumn] : []),
              TagColumn,
              SchedulingStatusSingleColumn,
            ]}
          />
        )}
        {groupBy === EActivityGroupings.WEEK_PATTERN && <WeekPatternTable />}
        {groupBy === EActivityGroupings.TAG && <TagGroupTable />}
      </SchedulingProgressOverlay>
    </>
  );
};

export default ActivitiesPage;
