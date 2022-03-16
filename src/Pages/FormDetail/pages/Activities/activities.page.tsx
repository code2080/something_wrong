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
} from 'Redux/Activities';
import { selectSSPState } from 'Components/SSP/Utils/selectors';

// TYPES
import { ISSPQueryObject } from 'Types/SSP.type';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTagsForForm } from 'Redux/Tags';

const ActivitiesPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

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
      <ActivityTable
        preCustomColumns={[RowActionsColumn, TagColumn, SchedulingStatusColumn]}
        postCustomColumns={[SubmitterColumn]}
      />
    </>
  );
};

export default ActivitiesPage;
