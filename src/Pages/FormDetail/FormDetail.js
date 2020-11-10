import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

// ACTIONS
import { fetchFormSubmissions, toggleFormInstanceStarringStatus } from '../../Redux/FormSubmissions/formSubmissions.actions';
import { fetchMappings } from '../../Redux/ActivityDesigner/activityDesigner.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../Redux/Activities/activities.actions';
import { fetchDataForDataSource } from '../../Redux/Integration/integration.actions';
import { loadFilter } from '../../Redux/Filters/filters.actions';

// SELECTORS
import { selectSubmissions } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';
import { selectFilter } from '../../Redux/Filters/filters.selectors';
import { getExtIdPropsPayload } from '../../Redux/Integration/integration.selectors';

// COMPONENTS
import { withTECoreAPI } from '../../Components/TECoreAPI';
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import FormToolbar from '../../Components/FormToolbar/FormToolbar';
import FormSubmissionFilterBar from '../../Components/FormSubmissionFilters/FormSubmissionFilterBar';
import FilterModal from '../../Components/FormSubmissionFilters/FilterModal';
import FormInfo from '../../Components/Sections/FormInfo';
import { Icon } from 'antd';

// HELPERS
import { extractSubmissionColumns, extractSubmissionData } from '../../Utils/forms.helpers';

// CONSTANTS
import { tableColumns } from '../../Components/TableColumns';
import { tableViews } from '../../Constants/tableViews.constants';
import { FormSubmissionFilterInterface } from '../../Models/FormSubmissionFilter.interface';
import { useFetchLabelsFromExtIds } from '../../Hooks/TECoreApiHooks';
import { initialState as initialPayload } from '../../Redux/TE/te.helpers';
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';
import { themeColors } from '../../Constants/themeColors.constants';

const applyScopedObjectFilters = (el, objs, filters) => {
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

const filterForOwn = (el, userId) => (el.teCoreProps.assignedTo || []).includes(userId);

const loadingSelector = createLoadingSelector(['FETCH_SUBMISSIONS_FOR_FORM']);
const savingSelector = createLoadingSelector(['SET_SCHEDULING_PROGRESS']);

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  const form = state.forms[formId];
  const submissions = selectSubmissions(state, formId);
  const scopedObjectIds = form.objectScope ? _.uniq(submissions.map(el => el.scopedObject)) : [];
  const scopedObjects = form.objectScope && state.integration.objects[form.objectScope]
    ? _.keyBy(scopedObjectIds.map(id => state.integration.objects[form.objectScope][id]), 'te_extid')
    : {};

  return {
    userId: _.get(state, 'auth.user.id', null),
    filters: selectFilter(state)(formId, FormSubmissionFilterInterface),
    isLoadingSubmissions: loadingSelector(state),
    isSaving: savingSelector(state),
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
  toggleFormInstanceStarringStatus,
  loadFilter,
};

const traversedClassList = element => {
  if(!element) return [];
  let currentNode = element;
  const classes = [];
  do {
    classes.push(...currentNode.classList);
    currentNode = currentNode.parentNode;
  } while (currentNode.parentNode);
  return classes;
}

const FormPage = ({
  userId,
  formId,
  filters,
  form,
  teCoreAPI,
  submissions,
  scopedObjects,
  isLoadingSubmissions,
  isSaving,
  fetchFormSubmissions,
  fetchActivitiesForForm,
  setBreadcrumbs,
  fetchMappings,
  fetchDataForDataSource,
  toggleFormInstanceStarringStatus,
  loadFilter,
  history,
}) => {
  // Show scoped object filters
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFormInfo, setShowFormInfo] = useState(false);

  useEffect(() => {
    fetchFormSubmissions(formId);
    fetchMappings(formId);
    fetchActivitiesForForm(formId);
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formId}`, label: form.name }
    ]);
    loadFilter({ filterId: formId });
    teCoreAPI[teCoreCallnames.SET_FORM_TYPE]({ formType: form.formType });
    form.reservationmode && teCoreAPI[teCoreCallnames.SET_RESERVATION_MODE]({ mode: form.reservationmode, callback: ({res}) => {} });
  }, [formId]);

  // Fetch scoped objects
  useEffect(() => {
    form.objectScope && fetchDataForDataSource(form.objectScope);
  }, [form.objectScope]);


  const payload = useMemo(() => {
    const sections = form.sections;
    const submissionValues = submissions.reduce((acc, submission) => ({
        ...acc,
        ...submission.values
      }), {});
    const teValues = _.isEmpty(submissionValues)
      ? initialPayload
      : getExtIdPropsPayload({ sections, submissionValues, objectScope: form.objectScope });
    const scopedObjectExtids = submissions.map(s => s.scopedObject)

    return {
      ...teValues,
      objects: [
        ...teValues.objects,
        ...scopedObjectExtids
      ],
    }
  }, [submissions, form]);

  // Effect to get all TE values into redux state
  useFetchLabelsFromExtIds(payload);

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

  const handleClickMore = () => setShowFormInfo(!showFormInfo);

  const columns = useMemo(() => _.compact([
    tableColumns.formSubmission.ASSIGNMENT,
    tableColumns.formSubmission.NAME,
    tableColumns.formSubmission.SUBMISSION_DATE,
    tableColumns.formSubmission.SCOPED_OBJECT,
    tableColumns.formSubmission.ACCEPTANCE_STATUS,
    tableColumns.formSubmission.SCHEDULING_PROGRESS,
    form.objectScope ? tableColumns.formSubmission.SCHEDULE_LINK : null,
    ..._cols,
    {
      ...tableColumns.formSubmission.IS_STARRED,
      render: (isStarred, item) => (
        <Icon
          style={{ fontSize: '0.9rem', color: themeColors.jungleGreen }}
          type="star"
          theme={isStarred ? 'filled' : 'outlined'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isSaving) {
              toggleFormInstanceStarringStatus({
                formInstanceId: item._id,
                isStarred,
              });
            }
          }}
        />
      )
    },
    tableColumns.formSubmission.ACTION_BUTTON
  ]), [_cols, isSaving]);

  const filteredDatasource = useMemo(() => {
    const { freeTextFilter, scopedObject } = filters;
    // Normalized free text filter
    const query = freeTextFilter.toString().toLowerCase();

    // Filter data source by iterating over each of the visible columns and determine if one of them contains the query
    return _dataSource
      .filter(el => filters.onlyOwn ? filterForOwn(el, userId) : true)
      .filter(
        el => Object.keys(scopedObject)
          .filter(key => scopedObject[key].length > 0)
          .length > 0
          ? applyScopedObjectFilters(el, scopedObjects, scopedObject)
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
      .sort((a, b) => {
        return a.index - b.index;
      })
  }, [userId, filters, _dataSource, columns]);
  return (
    <div className="form--wrapper">
      <FormToolbar formId={formId} onClickMore={handleClickMore} />
      {showFormInfo && <FormInfo formId={formId} />}
      <FormSubmissionFilterBar
        formId={formId}
        togglePropsFilter={() => setShowFilterModal(!showFilterModal)}
        isPropsFilterVisible={showFilterModal}
      />
      <FilterModal
        formId={formId}
        objectScope={form.objectScope}
        isVisible={showFilterModal}
        contentFilters={_cols}
        onClose={() => setShowFilterModal(false)}
      />
      <DynamicTable
        columns={columns}
        dataSource={filteredDatasource}
        rowKey="_id"
        onRow={formInstance => ({
          onClick: (e) => {
            traversedClassList(e.target).includes('ant-table-column-has-actions') && formInstance && formInstance.formId && formInstance._id && history.push(`/forms/${formInstance.formId}/form-instances/${formInstance._id}`);
          }
        })}
        isLoading={isLoadingSubmissions}
        showFilter={false}
        datasourceId={tableViews.SUBMISSION_OVERVIEW}
      />
    </div>
  );
};

FormPage.propTypes = {
  userId: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  form: PropTypes.object,
  filters: PropTypes.object,
  submissions: PropTypes.array,
  scopedObjects: PropTypes.object,
  isLoadingSubmissions: PropTypes.bool,
  fetchFormSubmissions: PropTypes.func.isRequired,
  fetchActivitiesForForm: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  fetchMappings: PropTypes.func.isRequired,
  fetchDataForDataSource: PropTypes.func.isRequired,
  loadFilter: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

FormPage.defaultProps = {
  form: {},
  submissions: [],
  isLoadingSubmissions: false,
  scopedObjects: {},
};

export default withRouter(withTECoreAPI(connect(mapStateToProps, mapActionsToProps)(FormPage)));
