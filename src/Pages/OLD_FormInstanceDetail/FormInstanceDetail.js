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

<<<<<<< HEAD:src/Pages/OLD_FormInstanceDetail/FormInstanceDetail.js
=======
  // Effect to fetch all manual schedulings
  useEffect(() => {
    fetchManualSchedulingsForFormInstance({ formInstanceId: formInstance._id });
  }, []);

  // Effect to fetch activities
  useEffect(() => {
    fetchActivitiesForFormInstance(formInstance.formId, formInstance._id);
  }, []);

  const handleClickMore = () => setShowFormInfo(!showFormInfo);

>>>>>>> development:src/Pages/FormInstanceDetail/FormInstanceDetail.js
  // Effect to get all TE values into redux state
  const payload = useMemo(() => getExtIdPropsPayload({ sections, objectRequests: objectRequests, submissionValues: formInstance.values, activities }), [formInstance, sections, activities]);
  useFetchLabelsFromExtIds(payload);

  // State var to hold active tab
  const baseSections = sections.map(section => <BaseSection section={section} key={section._id} />);
<<<<<<< HEAD:src/Pages/OLD_FormInstanceDetail/FormInstanceDetail.js

  return (
    <div className="form-instance--wrapper">
=======
  const tabPanes = [
    <Tabs.TabPane tab='Overview' key='OVERVIEW'>
      {baseSections}
    </Tabs.TabPane>,
    !_.isEmpty(objectRequests) &&
    <Tabs.TabPane tab='Object requests' key='OBJECT_REQUESTS' >
      <ObjectRequestOverview formInstanceId={formInstance._id} requests={objectRequests} />
    </Tabs.TabPane>,
    hasAssistedSchedulingPermissions() &&
    <Tabs.TabPane tab='Activities' key='ACTIVITIES'>
      <ActivitiesOverview formId={formInstance.formId} formInstanceId={formInstance._id} />
    </Tabs.TabPane>,
  ].filter(_.identity);

  const renderTabBar = ({ className, ...restProps }, DefaultTabBar) => (
    <DefaultTabBar {...restProps} className={`${className} form-instance--tabs`} />
  );

  return (
    <div className='form-instance--wrapper'>
      <SpotlightMask spotlightPositionInfo={externalActionRef} />
>>>>>>> development:src/Pages/FormInstanceDetail/FormInstanceDetail.js
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
<<<<<<< HEAD:src/Pages/OLD_FormInstanceDetail/FormInstanceDetail.js
  activities: PropTypes.array,
=======
  fetchManualSchedulingsForFormInstance: PropTypes.func.isRequired,
  fetchActivitiesForFormInstance: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired,
>>>>>>> development:src/Pages/FormInstanceDetail/FormInstanceDetail.js
};

FormInstancePage.defaultProps = {
  sections: [],
};

export default connect(mapStateToProps, mapActionsToProps)(FormInstancePage);
