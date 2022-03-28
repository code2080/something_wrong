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
import SSPResourceWrapper from 'Components/SSP/Components/Wrapper';

// REDUX
import { fetchTagsForForm } from 'Redux/Tags';
import { fetchActivitiesForForm, fetchActivityFilterLookupMapForForm, initializeSSPStateProps } from 'Redux/Activities';
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import { selectFormHasWeekPatternEnabled } from 'Redux/Forms';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// TYPES
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { ISSPQueryObject } from 'Types/SSP.type';

const ActivitiesPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const { groupBy } = useSSP();

  /**
   * SELECTORS
   */
  const hasWeekPattern = useSelector(selectFormHasWeekPatternEnabled(formId));

  /**
   * EFFECTS
   */
  useEffect(() => {
    // Need to make sure some secondary resources are loaded
    dispatch(fetchTagsForForm(formId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SSPResourceWrapper
      name={`${formId}__FORM_DETAIL_ACTIVITIES`}
      selectorFn={selectSSPState('activities')}
      fetchFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        fetchActivitiesForForm(formId, partialQuery)
      }
      initSSPStateFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        initializeSSPStateProps(partialQuery)
      }
      fetchFilterLookupsFn={() => fetchActivityFilterLookupMapForForm(formId)}
    >
      <ActivitiesToolbar />
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
    </SSPResourceWrapper>
  );
};

export default ActivitiesPage;
