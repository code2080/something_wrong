import { useParams } from 'react-router-dom';

// COMPONENTS
import SSPResourceWrapper from 'Components/SSP/Components/Wrapper';
import JobsTable from 'Components/JobsTable';

// REDUX
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import { fetchJobsForForm, initializeSSPStateProps } from 'Redux/Jobs';

// TYPES
import { ISSPQueryObject } from 'Types/SSP.type';

const JobsPage = () => {
  const { formId } = useParams<{ formId: string }>();

  return (
    <SSPResourceWrapper
      name={`${formId}__FORM_DETAIL_ACTIVITIES`}
      selectorFn={selectSSPState('jobs')}
      fetchFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        fetchJobsForForm(formId, partialQuery)
      }
      initSSPStateFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        initializeSSPStateProps(partialQuery)
      }
    >
      <JobsTable />
    </SSPResourceWrapper>
  );
};

export default JobsPage;
