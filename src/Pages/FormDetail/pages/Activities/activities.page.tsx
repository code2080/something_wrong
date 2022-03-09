import { useParams } from 'react-router-dom';

// COMPONENTS
import SSPResourceWrapper from 'Components/SSP/Components/Wrapper';
import ActivitiesToolbar from 'Components/ActivitiesToolbar';
import ActivityTable from 'Components/ActivityTable';
import {
  RowActionsColumn,
  SchedulingStatusColumn,
  SubmitterColumn,
  TagColumn,
} from 'Components/ActivityTable/Columns';

// REDUX
import {
  fetchActivitiesForForm,
  fetchActivityFilterLookupMapForForm,
  initializeSSPStateProps,
} from 'Redux/ActivitiesSlice';
import { selectSSPState } from 'Components/SSP/Utils/selectors';

// TYPES
import { ISSPQueryObject } from 'Types/SSP.type';

const ActivitiesPage = () => {
  const { formId } = useParams<{ formId: string }>();

  return (
    <>
      <SSPResourceWrapper
        name='ACTIVITIES_TAB'
        selectorFn={selectSSPState('activitiesNew')}
        fetchFn={(partialQuery?: Partial<ISSPQueryObject>) =>
          fetchActivitiesForForm(formId, partialQuery)
        }
        initSSPStateFn={(partialQuery?: Partial<ISSPQueryObject>) =>
          initializeSSPStateProps(partialQuery)
        }
        fetchFilterLookupsFn={() => fetchActivityFilterLookupMapForForm(formId)}
      >
        <ActivitiesToolbar />
        <ActivityTable
          preCustomColumns={[
            RowActionsColumn,
            TagColumn,
            SchedulingStatusColumn,
          ]}
          postCustomColumns={[SubmitterColumn]}
        />
      </SSPResourceWrapper>
    </>
  );
};

export default ActivitiesPage;
