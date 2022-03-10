import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

// ACTIONS
import {
  setBreadcrumbs,
  setFormDetailTab,
} from '../../../Redux/GlobalUI/globalUI.actions';

// COMPONENTS
import BaseSection from '../../../Components/Sections/BaseSection';
import FormInstanceToolbar from '../../../Components/FormInstanceToolbar/FormInstanceToolbar';

// SELECTORS
import { makeSelectForm } from '../../../Redux/Forms/forms.selectors';
import { makeSelectFormInstance } from '../../../Redux/FormSubmissions/formSubmissions.selectors.ts';
import { selectActivitiesForFormInstanceId } from '../../../Redux/DEPR_Activities/activities.selectors';
import { getExtIdPropsPayload } from '../../../Redux/Integration/integration.selectors';
import { selectFormObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';

// STYLES
import './submissions.detail.page.scss';

// HOOKS
import { useFetchLabelsFromExtIds } from '../../../Hooks/TECoreApiHooks';

// TYPES
import { EFormDetailTabs } from '../../../Types/FormDetailTabs.enum';

const SubmissionsDetailPage = ({ formInstanceId }) => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector((state) => selectForm(state, formId));
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, { formId, formInstanceId }),
  );
  const activities = useSelector(selectActivitiesForFormInstanceId)(
    formId,
    formInstanceId,
  );
  const objectRequests = useSelector(selectFormObjectRequest(formId));

  // Effect to update breadcrumbs
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { path: '/forms', label: 'Forms' },
        {
          path: `/forms/${formInstance.formId}`,
          label: form.name,
          onClick: () => {
            dispatch(setFormDetailTab(EFormDetailTabs.SUBMISSIONS, null));
          },
        },
        {
          path: `/forms/${formInstance.formId}`,
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
    // TODO: memoize and readd dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form],
  );
  useFetchLabelsFromExtIds(payload);
  const baseSections = form.sections.map((section) => (
    <BaseSection
      section={section}
      key={section._id}
      formId={formId}
      formInstanceId={formInstanceId}
      objectRequests={objectRequests}
    />
  ));

  return (
    <div className='form-instance--wrapper'>
      <FormInstanceToolbar
        formId={formInstance.formId}
        formInstanceId={formInstance._id}
        objectRequests={objectRequests}
      />
      {baseSections}
    </div>
  );
};

SubmissionsDetailPage.propTypes = {
  formInstanceId: PropTypes.string.isRequired,
};

export default SubmissionsDetailPage;
