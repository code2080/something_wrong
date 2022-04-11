import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import ActivitiesToolbar from 'Components/Toolbars/Activities';
import ActivityTable from 'Components/ActivityTable';
import {
  PrimaryObjectColumn,
  RowActionsColumn,
  SchedulingStatusSingleColumn,
  TagColumn,
  TrackColumn,
  WeekPatternUIDColumn,
} from 'Components/TableColumnsShared';
import WeekPatternTable from 'Components/Tables/WeekPattern';

// REDUX
import { fetchTagsForForm } from 'Redux/Tags';
import { selectFormAllowedGroupings } from 'Redux/Forms';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// TYPES
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import TagGroupTable from 'Components/Tables/TagGroup';
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
    selectFormAllowedGroupings(formId as string),
  );
  const runningJobId = useSelector(selectRunningJobId);

  /**
   * EFFECTS
   */
  useEffect(() => {
    // Need to make sure some secondary resources are loaded
    dispatch(fetchTagsForForm(formId as string));

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
              TrackColumn,
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
