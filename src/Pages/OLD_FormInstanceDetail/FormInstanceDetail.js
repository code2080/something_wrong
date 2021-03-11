import React, { useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// ACTIONS
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchManualSchedulingsForFormInstance } from '../../Redux/ManualSchedulings/manualSchedulings.actions';
import { fetchActivitiesForFormInstance } from '../../Redux/Activities/activities.actions';

// COMPONENTS
import BaseSection from '../../Components/Sections/BaseSection';
import FormInstanceToolbar from '../../Components/FormInstanceToolbar/FormInstanceToolbar';

// SELECTORS
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';
import { selectFormInstanceObjectRequests } from '../../Redux/ObjectRequests/ObjectRequests.selectors';
import { hasPermission } from '../../Redux/Auth/auth.selectors';

// CONSTANTS
import { AEBETA_PERMISSION } from '../../Constants/permissions.constants';

// STYLES
import './FormInstanceDetail.scss';

// HOOKS
import { useFetchLabelsFromExtIds } from '../../Hooks/TECoreApiHooks';

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } } } = ownProps;
  return {
    formName: state.forms[formId].name,
    formInstance: state.submissions[formId][formInstanceId],
    sections: state.forms[formId].sections,
    activities: state.activities[formId][formInstanceId]
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  fetchManualSchedulingsForFormInstance,
  fetchActivitiesForFormInstance,
};

const FormInstancePage = ({
  formInstance,
  formName,
  sections,
  setBreadcrumbs,
  activities,
}) => {
  const objectRequests = useSelector(selectFormInstanceObjectRequests(formInstance));

  // Effect to update breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formInstance.formId}`, label: formName },
      { path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}`, label: `Submission from ${formInstance.submitter}` }
    ]);
  }, []);

  // Effect to get all TE values into redux state
  const payload = useMemo(() => getExtIdPropsPayload({ sections, objectRequests: objectRequests, submissionValues: formInstance.values, activities }), [formInstance, sections, activities]);
  useFetchLabelsFromExtIds(payload);

  // State var to hold active tab
  const baseSections = sections.map(section => <BaseSection section={section} key={section._id} />);

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

FormInstancePage.propTypes = {
  formInstance: PropTypes.object.isRequired,
  sections: PropTypes.array,
  formName: PropTypes.string.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  activities: PropTypes.array,
};

FormInstancePage.defaultProps = {
  sections: [],
};

export default connect(mapStateToProps, mapActionsToProps)(FormInstancePage);
