import { useParams } from 'react-router-dom';

// COMPONENTS
import SSPResourceWrapper from 'Components/SSP/Components/Wrapper';
import JobsTable from 'Components/Tables/Jobs';

// REDUX
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import { fetchJobsForForm, initializeSSPStateProps } from 'Redux/Jobs';

// TYPES
import { ISSPQueryObject } from 'Types/SSP.type';

const JobsPage = () => {
  const { formId } = useParams<{ formId: string }>();

  return (
    <SSPResourceWrapper
      name={`${formId}__FORM_DETAIL_JOBS`}
      selectorFn={selectSSPState('jobs')}
      fetchFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        fetchJobsForForm(formId as string, partialQuery)
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
