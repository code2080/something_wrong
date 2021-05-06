import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import DynamicTable from '../../../Components/DynamicTable/DynamicTableHOC';
import FormSubmissionFilterBar from '../../../Components/FormSubmissionFilters/FormSubmissionFilterBar';
import FilterModal from '../../../Components/FormSubmissionFilters/FilterModal';

// HOOKS
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';

// SELECTORS
import { makeSelectForm } from '../../../Redux/Forms/forms.selectors';
import { selectFilter } from '../../../Redux/Filters/filters.selectors';
import { makeSelectSubmissions } from '../../../Redux/FormSubmissions/formSubmissions.selectors.ts';
import { selectAuthedUserId } from '../../../Redux/Auth/auth.selectors';

// ACTIONS
import {
  setBreadcrumbs,
  setFormDetailTab,
} from '../../../Redux/GlobalUI/globalUI.actions';

// HELPERS
import {
  extractSubmissionColumns,
  extractSubmissionData,
  applyScopedObjectFilters,
  filterFormInstancesOnAuthedUser,
  parseTECoreGetObjectsReturn,
  traversedClassList,
} from '../../../Utils/forms.helpers';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
import { tableColumns } from '../../../Components/TableColumns';
import { formatElementValue } from '../../../Utils/elements.helpers';
import { teCoreCallnames } from '../../../Constants/teCoreActions.constants';
import { tableViews } from '../../../Constants/tableViews.constants';
import { FormSubmissionFilterInterface } from '../../../Models/FormSubmissionFilter.interface';

const loadingSelector = createLoadingSelector(['FETCH_SUBMISSIONS_FOR_FORM']);
const savingSelector = createLoadingSelector(['SET_SCHEDULING_PROGRESS']);

const SubmissionsOverviewPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();

  /**
   * SELECTORS
   */
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector((state) => selectForm(state, formId));
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) => selectSubmissions(state, formId));
  const isLoading = useSelector(loadingSelector);
  const isSaving = useSelector(savingSelector);
  const filters = useSelector(selectFilter)(
    `${formId}_SUBMISSIONS`,
    FormSubmissionFilterInterface,
  );
  const userId = useSelector(selectAuthedUserId);

  /**
   * STATE
   */
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [scopedObjects, setScopedObjects] = useState([]);

  /**
   * MEMOIZED VALUES
   */
  const scopedObjectIds = useMemo(
    () =>
      form.objectScope ? _.uniq(submissions.map((el) => el.scopedObject)) : [],
    [form, submissions],
  );

  /**
   * EFFECTS
   */
  useEffect(() => {
    if (scopedObjectIds && scopedObjectIds.length > 0)
      teCoreAPI[teCoreCallnames.GET_OBJECTS_BY_EXTID]({
        extids: scopedObjectIds,
        callback: (results) =>
          setScopedObjects(parseTECoreGetObjectsReturn(results)),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedObjectIds]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { path: '/forms', label: 'Forms' },
        { path: `/forms/${formId}`, label: form.name },
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _cols = useMemo(() => extractSubmissionColumns(form), [form]);
  const _elementTableData = useMemo(
    () => extractSubmissionData(submissions, _cols),
    [submissions, _cols],
  );
  const _dataSource = useMemo(
    () =>
      submissions.map((submission) => {
        if (!_elementTableData[submission._id]) return submission;
        return {
          ...submission,
          ..._elementTableData[submission._id],
        };
      }),
    [submissions, _elementTableData],
  );

  const columns = useMemo(
    () =>
      _.compact([
        tableColumns.formSubmission.ASSIGNMENT,
        tableColumns.formSubmission.NAME,
        tableColumns.formSubmission.SUBMISSION_DATE,
        tableColumns.formSubmission.IS_STARRED(dispatch, isSaving),
        tableColumns.formSubmission.SCOPED_OBJECT,
        tableColumns.formSubmission.ACCEPTANCE_STATUS,
        tableColumns.formSubmission.SCHEDULING_PROGRESS,
        form.objectScope ? tableColumns.formSubmission.SCHEDULE_LINK : null,
        ..._cols,
        tableColumns.formSubmission.ACTION_BUTTON,
        // eslint-disable-next-line react-hooks/exhaustive-deps
      ]),
    [dispatch, isSaving, form.objectScope, _cols],
  );

  const filteredDatasource = useMemo(() => {
    const { freeTextFilter, scopedObject } = filters;
    // Normalized free text filter
    const query = freeTextFilter.toString().toLowerCase();

    // Filter data source by iterating over each of the visible columns and determine if one of them contains the query
    return _dataSource
      .filter((el) =>
        filters.onlyOwn ? filterFormInstancesOnAuthedUser(el, userId) : true,
      )
      .filter((el) => !filters.onlyStarred || el.teCoreProps.isStarred)
      .filter((el) =>
        Object.keys(scopedObject).filter((key) => scopedObject[key].length > 0)
          .length > 0
          ? applyScopedObjectFilters(el, scopedObjects, scopedObject)
          : true,
      )
      .filter((el) =>
        query.length >= 3
          ? columns.some((col) => {
              if (!el[col.dataIndex]) return false;
              const formattedValue = formatElementValue(el[col.dataIndex]);
              return (
                formattedValue.toString().toLowerCase().indexOf(query) > -1
              );
            })
          : true,
      )
      .sort((a, b) => {
        return a.index - b.index;
      });
  }, [filters, _dataSource, userId, scopedObjects, columns]);

  return (
    <>
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
        rowKey='_id'
        onRow={(formInstance) => ({
          onClick: (e) => {
            const list = traversedClassList(e.target);
            const hasFormInstance =
              formInstance && formInstance.formId && formInstance._id;
            list.includes('ant-table-cell') &&
              hasFormInstance &&
              dispatch(setFormDetailTab('SUBMISSIONS', formInstance._id));
          },
        })}
        isLoading={isLoading}
        showFilter={false}
        datasourceId={tableViews.SUBMISSION_OVERVIEW}
        resizable
      />
    </>
  );
};

export default SubmissionsOverviewPage;
