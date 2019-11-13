import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// ACTIONS
import { fetchFormSubmissions } from '../Redux/FormSubmissions/formSubmissions.actions';
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';

// COMPONENTS
import DynamicTable from '../Components/DynamicTable/DynamicTableHOC';

// HELPERS
import { getSubmissionColumns } from '../Utils/getSubmissionColumns';
import { getSubmissionData } from '../Utils/getSubmissionData';

// CONSTANTS
import { staticCols } from '../Constants/staticFormSubmissionColumns.constants';

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  return {
    formId,
    form: state.forms[formId],
    submissions: Object.keys(state.submissions[formId] || [])
      .map(key => state.submissions[formId][key]),
  };
};

const mapActionsToProps = {
  fetchFormSubmissions,
  setBreadcrumbs,
};

const FormPage = ({ formId, form, submissions, fetchFormSubmissions, setBreadcrumbs }) => {
  useEffect(() => {
    fetchFormSubmissions(formId);
  }, []);

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
      <DynamicTable
        columns={[staticCols.NAME, staticCols.SUBMISSION_DATE, staticCols.SCOPED_OBJECT, ..._cols, staticCols.ACTION_BUTTON]}
        dataSource={_dataSource}
        rowKey="_id"
      />
    </div>
  );
};

FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
  form: PropTypes.object,
  submissions: PropTypes.array,
  fetchFormSubmissions: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
};

FormPage.defaultProps = {
  form: {},
  submissions: [],
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(FormPage));
