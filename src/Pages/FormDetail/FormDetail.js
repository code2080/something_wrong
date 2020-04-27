import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// ACTIONS
import { fetchFormSubmissions } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../../Redux/ReservationTemplateMapping/reservationTemplateMapping.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../Redux/Activities/activities.actions';

// SELECTORS
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import FormToolbar from '../../Components/FormToolbar/FormToolbar';

// HELPERS
import { extractSubmissionColumns, extractSubmissionData } from '../../Utils/forms.helpers';

// CONSTANTS
import { tableColumns } from '../../Components/TableColumns';

const loadingSelector = createLoadingSelector(['FETCH_SUBMISSIONS_FOR_FORM']);
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  return {
    isLoadingSubmissions: loadingSelector(state),
    formId,
    form: state.forms[formId],
    submissions: Object.keys(state.submissions[formId] || [])
      .map(key => state.submissions[formId][key]),
  };
};

const mapActionsToProps = {
  fetchFormSubmissions,
  fetchMappings,
  fetchActivitiesForForm,
  setBreadcrumbs,
};

const FormPage = ({
  formId,
  form,
  submissions,
  isLoadingSubmissions,
  fetchFormSubmissions,
  fetchActivitiesForForm,
  setBreadcrumbs,
  fetchMappings,
  history,
}) => {
  // Fetch submissions
  useEffect(() => {
    fetchFormSubmissions(formId);
  }, []);
  // Fetch mappings
  useEffect(() => {
    fetchMappings(formId);
  }, []);
  // Fetch activities
  useEffect(() => {
    fetchActivitiesForForm(formId);
  }, []);
  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name }
    ]);
  }, []);

  const _cols = extractSubmissionColumns(form);
  const _elementTableData = extractSubmissionData(submissions, _cols);
  const _dataSource = submissions.map(submission => {
    if (!_elementTableData[submission._id]) return submission;
    return {
      ...submission,
      ..._elementTableData[submission._id],
    };
  });
  return (
    <div className="form--wrapper">
      <FormToolbar formId={formId} />
      <DynamicTable
        columns={[
          tableColumns.formSubmission.NAME,
          tableColumns.formSubmission.SUBMISSION_DATE,
          tableColumns.formSubmission.SCOPED_OBJECT,
          tableColumns.formSubmission.ACCEPTANCE_STATUS,
          tableColumns.formSubmission.ACCEPTANCE_COMMENT,
          tableColumns.formSubmission.SCHEDULING_PROGRESS,
          ..._cols,
          tableColumns.formSubmission.ACTION_BUTTON
        ]}
        dataSource={_dataSource}
        rowKey="_id"
        onRow={formInstance => ({
          onClick: () => history.push(`/forms/${formInstance.formId}/form-instances/${formInstance._id}`)
        })}
        isLoading={isLoadingSubmissions}
      />
    </div>
  );
};

FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
  form: PropTypes.object,
  submissions: PropTypes.array,
  isLoadingSubmissions: PropTypes.bool,
  fetchFormSubmissions: PropTypes.func.isRequired,
  fetchActivitiesForForm: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  fetchMappings: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

FormPage.defaultProps = {
  form: {},
  submissions: [],
  isLoadingSubmissions: false,
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(FormPage));
