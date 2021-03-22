import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

// ACTIONS
import { setBreadcrumbs } from '../../../Redux/GlobalUI/globalUI.actions';

// COMPONENTS
import BaseSection from '../../../Components/Sections/BaseSection';
import FormInstanceToolbar from '../../../Components/FormInstanceToolbar/FormInstanceToolbar';
import { selectForm } from '../../../Redux/Forms/forms.selectors';
import { selectFormInstance } from '../../../Redux/FormSubmissions/formSubmissions.selectors.ts';
import { selectActivitiesForFormInstanceId } from '../../../Redux/Activities/activities.selectors';
// SELECTORS
import { getExtIdPropsPayload } from '../../../Redux/Integration/integration.selectors';
import { selectFormInstanceObjectRequests } from '../../../Redux/ObjectRequests/ObjectRequests.selectors';

// STYLES
import './submissions.detail.page.scss';

// HOOKS
import { useFetchLabelsFromExtIds } from '../../../Hooks/TECoreApiHooks';

const SubmissionsDetailPage = ({ formInstanceId }) => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const form = useSelector(selectForm)(formId);
  const formInstance = useSelector(selectFormInstance)(formId, formInstanceId);
  const activities = useSelector(selectActivitiesForFormInstanceId)(
    formId,
    formInstanceId,
  );
  const objectRequests = useSelector(
    selectFormInstanceObjectRequests(formInstance),
  );

  // Effect to update breadcrumbs
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { path: '/forms', label: 'Forms' },
        { path: `/forms/${formInstance.formId}`, label: form.name },
        {
          path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}`,
          label: `Submission from ${formInstance.submitter}`,
        },
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to get all TE values into redux state
  const payload = useMemo(
    () =>
      getExtIdPropsPayload({
        sections: form.sections,
        objectRequests: objectRequests,
        submissionValues: formInstance.values,
        activities,
      }),
    [form.sections, objectRequests, formInstance.values, activities],
  );
  useFetchLabelsFromExtIds(payload);

  // State var to hold active tab
  const baseSections = form.sections.map((section) => (
    <BaseSection
      section={section}
      key={section._id}
      formId={formId}
      formInstanceId={formInstanceId}
    />
  ));

  return (
    <div className='form-instance--wrapper'>
      <FormInstanceToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
      />
      {baseSections}
    </div>
  );
};

SubmissionsDetailPage.propTypes = {
  formInstanceId: PropTypes.string.isRequired,
};

export default SubmissionsDetailPage;
