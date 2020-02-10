import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// ACTIONS
import { fetchFormSubmissions } from '../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../Redux/Mapping/mappings.actions';
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';
import { fetchReservationsForForm } from '../Redux/Reservations/reservations.actions';

// SELECTORS
import { createLoadingSelector } from '../Redux/APIStatus/apiStatus.selectors';

// COMPONENTS
import DynamicTable from '../Components/DynamicTable/DynamicTableHOC';
import FormToolbar from '../Components/Toolbars/FormToolbar';

// HELPERS
import { getSubmissionColumns } from '../Utils/getSubmissionColumns';
import { getSubmissionData } from '../Utils/getSubmissionData';

// CONSTANTS
import { staticCols } from '../Constants/staticFormSubmissionColumns.constants';

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
  fetchReservationsForForm,
  setBreadcrumbs,
};

<<<<<<< HEAD
const FormPage = ({ formId, form, submissions, fetchFormSubmissions, setBreadcrumbs, history }) => {
=======
const FormPage = ({
  formId,
  form,
  submissions,
  isLoadingSubmissions,
  fetchFormSubmissions,
  fetchReservationsForForm,
  setBreadcrumbs,
  fetchMappings
}) => {
  // Fetch submissions
>>>>>>> feature/automaticScheduling
  useEffect(() => {
    fetchFormSubmissions(formId);
  }, []);
  // Fetch mappings
  useEffect(() => {
    fetchMappings(formId);
  }, []);
  // Fetch reservations
  useEffect(() => {
    fetchReservationsForForm(formId);
  }, []);
  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name }
    ]);
  }, []);

  const _cols = getSubmissionColumns(form);
  const _elementTableData = getSubmissionData(submissions, _cols);
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
        columns={[staticCols.NAME, staticCols.SUBMISSION_DATE, staticCols.SCOPED_OBJECT, staticCols.ACCEPTANCE_STATUS, staticCols.ACCEPTANCE_COMMENT, staticCols.SCHEDULING_PROGRESS, ..._cols, staticCols.ACTION_BUTTON]}
        dataSource={_dataSource}
        onRow={formInstance => ({
          onClick: (event) => {
            //console.log(event.target.nodeName);
            if (event.target.type === "button" || event.target.nodeName === "LI") {
              return;
            }
            history.push(`/forms/${formInstance.formId}/${formInstance._id}`)}
        })}
        rowKey="_id"
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
  fetchReservationsForForm: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
<<<<<<< HEAD
  history: PropTypes.object.isRequired,
=======
  fetchMappings: PropTypes.func.isRequired,
>>>>>>> feature/automaticScheduling
};

FormPage.defaultProps = {
  form: {},
  submissions: [],
  isLoadingSubmissions: false,
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(FormPage));
