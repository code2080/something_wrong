import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

// ACTIONS
import { fetchFormSubmissions } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../Redux/Activities/activities.actions';
import { fetchDataForDataSource } from '../../Redux/Integration/integration.actions';

// SELECTORS
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import FormToolbar from '../../Components/FormToolbar/FormToolbar';
import FormSubmissionFilterBar from '../../Components/FormSubmissionFilters/FormSubmissionFilterBar';
import ScopedObjectFilters from '../../Components/FormSubmissionFilters/ScopedObjectFilters';

// HELPERS
import { extractSubmissionColumns, extractSubmissionData } from '../../Utils/forms.helpers';

// CONSTANTS
import { tableColumns } from '../../Components/TableColumns';

const filterForProps = (el, objs, filters) => {
  const { scopedObject } = el;
  if (!scopedObject) return false;
  const obj = objs[el.scopedObject];
  if (!obj) return false;
  const filterKeys = Object.keys(filters)
    .filter(key => filters[key].length > 0);
  return filterKeys.some(key => {
    if (!obj[key]) return false;
    const nC = obj[key].toString().toLowerCase();
    const nVal = filters[key].toString().toLowerCase();
    return nC.indexOf(nVal) > -1;
  })
};

const loadingSelector = createLoadingSelector(['FETCH_SUBMISSIONS_FOR_FORM']);
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  const form = state.forms[formId];
  const submissions = Object.keys(state.submissions[formId] || []).map(
    key => state.submissions[formId][key]
  );

  const scopedObjectIds = form.objectScope ? _.uniq(submissions.map(el => el.scopedObject)) : [];
  const scopedObjects = form.objectScope && state.integration.objects[form.objectScope]
    ? _.keyBy(scopedObjectIds.map(id => state.integration.objects[form.objectScope][id]), 'te_extid')
    : {};

  return {
    isLoadingSubmissions: loadingSelector(state),
    formId,
    form,
    submissions,
    scopedObjects,
  };
};

const mapActionsToProps = {
  fetchFormSubmissions,
  fetchMappings,
  fetchActivitiesForForm,
  setBreadcrumbs,
  fetchDataForDataSource,
};

const FormPage = ({
  formId,
  form,
  submissions,
  scopedObjects,
  isLoadingSubmissions,
  fetchFormSubmissions,
  fetchActivitiesForForm,
  setBreadcrumbs,
  fetchMappings,
  fetchDataForDataSource,
  history,
}) => {
  // Filter state
  const [freeTextFilter, setFreeTextFilter] = useState('');
  const [scopedObjectFilters, setScopedObjectFilters] = useState({});

  // Show scoped object filters
  const [showScopedObjectFilters, setShowScopedObjectFilters] = useState(false);

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
  // Fetch scoped objects
  useEffect(() => {
    if (form.objectScope)
      fetchDataForDataSource(form.objectScope);
  }, []);

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name }
    ]);
  }, []);

  const _cols = useMemo(() => extractSubmissionColumns(form), [form]);
  const _elementTableData = useMemo(() => extractSubmissionData(submissions, _cols), [submissions, _cols]);
  const _dataSource = useMemo(() =>
    submissions.map(submission => {
      if (!_elementTableData[submission._id]) return submission;
      return {
        ...submission,
        ..._elementTableData[submission._id],
      };
    }),
  [submissions, _elementTableData]);
  const columns = useMemo(() => [
    tableColumns.formSubmission.ASSIGNMENT,
    tableColumns.formSubmission.NAME,
    tableColumns.formSubmission.SUBMISSION_DATE,
    tableColumns.formSubmission.SCOPED_OBJECT,
    tableColumns.formSubmission.ACCEPTANCE_STATUS,
    tableColumns.formSubmission.SCHEDULING_PROGRESS,
    ..._cols,
    tableColumns.formSubmission.ACTION_BUTTON
  ], [_cols]);

  const filteredDatasource = useMemo(() => {
    // Normalized free text filter
    const query = freeTextFilter.toString().toLowerCase();

    // Filter data source by iterating over each of the visible columns and determine if one of them contains the query
    return _dataSource
      .filter(
        el => Object.keys(scopedObjectFilters)
          .filter(key => scopedObjectFilters[key].length > 0)
          .length > 0
          ? filterForProps(el, scopedObjects, scopedObjectFilters)
          : true
      )
      .filter(
        el =>
          query.length >= 3
            ? columns.some(
              col => {
                if (!el[col.dataIndex]) return false;
                return el[col.dataIndex]
                  .toString()
                  .toLowerCase()
                  .indexOf(query) > -1
              })
            : true
      )
  }, [freeTextFilter, _dataSource, columns, scopedObjectFilters]);

  return (
    <div className="form--wrapper">
      <FormToolbar formId={formId} />
      <FormSubmissionFilterBar
        freeTextFilter={freeTextFilter}
        onFreeTextFilterChange={setFreeTextFilter}
        togglePropsFilter={() => setShowScopedObjectFilters(!showScopedObjectFilters)}
        isPropsFilterVisible={showScopedObjectFilters}
      />
      {showScopedObjectFilters && form.objectScope && (
        <ScopedObjectFilters
          scopedObjectFilters={scopedObjectFilters}
          onFiltersChange={setScopedObjectFilters}
          objectScope={form.objectScope}
        />
      )}
      <DynamicTable
        columns={columns}
        dataSource={filteredDatasource}
        rowKey="_id"
        onRow={formInstance => ({
          onClick: e => {
            if (
              e &&
              e.target &&
              e.target.className &&
              e.target.className.length &&
              e.target.className.indexOf('ant-table-column-has-actions') > -1
            )
              history.push(`/forms/${formInstance.formId}/form-instances/${formInstance._id}`);
          }
        })}
        isLoading={isLoadingSubmissions}
        showFilter={false}
      />
    </div>
  );
};

FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
  form: PropTypes.object,
  submissions: PropTypes.array,
  scopedObjects: PropTypes.object,
  isLoadingSubmissions: PropTypes.bool,
  fetchFormSubmissions: PropTypes.func.isRequired,
  fetchActivitiesForForm: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  fetchMappings: PropTypes.func.isRequired,
  fetchDataForDataSource: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

FormPage.defaultProps = {
  form: {},
  submissions: [],
  isLoadingSubmissions: false,
  scopedObjects: {},
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(FormPage));
