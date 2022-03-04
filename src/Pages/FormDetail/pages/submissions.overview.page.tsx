/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import DynamicTable from '../../../Components/DynamicTable/DynamicTableHOC';
import FormSubmissionFilterBar from '../../../Components/FormSubmissionFilters/FormSubmissionFilterBar';
import FilterModal from '../../../Components/FormSubmissionFilters/FilterModal';

// HOOKS
import {
  useFetchLabelsFromExtIds,
  useTECoreAPI,
} from '../../../Hooks/TECoreApiHooks';

// SELECTORS
import { selectFormById } from '../../../Redux/Forms/forms.selectors';
import { selectFilterValueForSubmissions } from '../../../Redux/Filters/filters.selectors';
import { selectAuthedUserId } from '../../../Redux/Auth/auth.selectors';
import { getExtIdPropsPayload } from '../../../Redux/Integration/integration.selectors';

// ACTIONS
import { setFormDetailTab } from '../../../Redux/GlobalUI/globalUI.actions';

// HELPERS
import {
  extractSubmissionColumns,
  extractSubmissionData,
  traversedClassList,
} from '../../../Utils/forms.helpers';
import { createLoadingSelector } from '../../../Redux/APIStatus/apiStatus.selectors';
import {
  toOrderDirection,
  usePaginationAndSorting,
} from 'Hooks/usePaginationAndSorting';

// CONSTANTS
import { tableColumns } from '../../../Components/TableColumns';
import { teCoreCallnames } from '../../../Constants/teCoreActions.constants';
import { tableViews } from '../../../Constants/tableViews.constants';
import { selectFormObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import {
  selectFormSubmissionIds,
  selectFormSubmissions,
  selectFormSubmissionsTotal,
} from '../../../Redux/FormSubmissions/formSubmissions.selectors';
import { fetchFormSubmissions } from '../../../Redux/FormSubmissions/formSubmissions.actions';
import { convertToSubmissionsFilterQuery } from '../../../Utils/submissions.helpers';

// TYPES
import { TFormInstance } from '../../../Types/FormInstance.type';
import { TGetExtIdPropsPayload } from 'Types/TECorePayloads.type';

const loadingSelector = createLoadingSelector(['FETCH_SUBMISSIONS_FOR_FORM']);
const savingSelector = createLoadingSelector(['SET_SCHEDULING_PROGRESS']);

const SubmissionsOverviewPage = () => {
  const { formId }: { formId: string } = useParams();
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();

  /**
   * SELECTORS
   */
  const form = useSelector(selectFormById(formId));
  const submissionIds = useSelector(selectFormSubmissionIds(formId));
  const submissions: TFormInstance[] = useSelector(selectFormSubmissions(formId, submissionIds));
  const submissionsTotal = useSelector(selectFormSubmissionsTotal(formId));
  const isLoading = useSelector(loadingSelector);
  const isSaving = useSelector(savingSelector);

  const userId = useSelector(selectAuthedUserId);
  const objectRequests = useSelector(selectFormObjectRequest(formId));
  /**
   * STATE
   */
  const [showFilterModal, setShowFilterModal] = useState(false);

  /**
   * MEMOIZED VALUES
   */
  const scopedObjectIds = useMemo(
    () =>
      form?.objectScope ? _.uniq(submissions.map((el: any) => el.scopedObject)) : [],
    [form, submissionIds],
  );

  const submissionPayload: TGetExtIdPropsPayload = useMemo(() => {
    const initialPayload: TGetExtIdPropsPayload = {
      objects: submissions.flatMap(({ scopedObject }) => scopedObject) as string[],
      fields: [],
      types: [],
    };
  
    const sections = form?.sections || [];
    const submissionValues = submissions.map((submission) => submission.values);
    const teValues = _.isEmpty(submissionValues)
      ? initialPayload
      : getExtIdPropsPayload({
          sections,
          submissionValues,
          objectScope: form?.objectScope,
          activities: [],
        });
    const scopedObjectExtids = submissions.map((s) => s.scopedObject) as string[];

    return {
      ...teValues,
      objects: [...teValues.objects, ...scopedObjectExtids],
    };
  }, [form?.sections, form?.objectScope, submissionIds]);

  useFetchLabelsFromExtIds(submissionPayload);

  /**
   * EFFECTS
   */
  useEffect(() => {
    if (scopedObjectIds && scopedObjectIds.length > 0)
      teCoreAPI[teCoreCallnames.GET_OBJECTS_BY_EXTID]({
        extids: scopedObjectIds,
        callback: () => {},
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedObjectIds]);

  const _cols = useMemo(() => extractSubmissionColumns(form), [form]);
  const _elementTableData = useMemo(
    () => extractSubmissionData(submissions, _cols),
    [submissionIds, _cols],
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

  const filterQuery = useSelector(selectFilterValueForSubmissions({ formId }));
  const currentUserId = useSelector(selectAuthedUserId);

  const onFetchSubmissions = ({ current, pageSize, order, orderBy }) => {
    dispatch(
      fetchFormSubmissions(formId, {
        page: current,
        perPage: pageSize,
        order,
        orderBy,
        ...convertToSubmissionsFilterQuery(filterQuery, { userId }),
      }),
    );
  };

  const { pagination, sorting, onChange, onSortingChange } =
    usePaginationAndSorting({
      onChangeCallback: ({ current, pageSize }) => {
        onFetchSubmissions({
          current,
          pageSize,
          order: toOrderDirection(sorting.order),
          orderBy: sorting.orderBy,
        });
      },
    });

  useEffect(() => {
    const { current, pageSize } = pagination;
    const { order, orderBy } = sorting;
    onFetchSubmissions({
      current,
      pageSize,
      order: toOrderDirection(order),
      orderBy,
    });
  }, [filterQuery, currentUserId]);

  const columns = useMemo(() => {
    const allCols = _.compact([
      tableColumns.formSubmission.ASSIGNMENT,
      tableColumns.formSubmission.NAME,
      tableColumns.formSubmission.SUBMISSION_DATE,
      tableColumns.formSubmission.IS_STARRED(dispatch, isSaving),
      tableColumns.formSubmission.SCOPED_OBJECT(objectRequests),
      tableColumns.formSubmission.ACCEPTANCE_STATUS,
      tableColumns.formSubmission.SCHEDULING_PROGRESS,
      form?.objectScope ? tableColumns.formSubmission.SCHEDULE_LINK : null,
      ..._cols,
      tableColumns.formSubmission.ACTION_BUTTON,
    ]);
    return allCols.map((col) => ({
      ...col,
      // sortOrder:
      sorter: col.dataIndex ? () => 0 : undefined,
    }));
    // return allCols;
  }, [dispatch, isSaving, objectRequests, form?.objectScope, _cols, sorting]);

  return (
    <>
      <FormSubmissionFilterBar
        formId={formId}
        togglePropsFilter={() => setShowFilterModal(!showFilterModal)}
        isPropsFilterVisible={showFilterModal}
      />
      <FilterModal
        formId={formId}
        objectScope={form?.objectScope}
        isVisible={showFilterModal}
        contentFilters={_cols}
        onClose={() => setShowFilterModal(false)}
      />
      <DynamicTable
        columns={columns}
        dataSource={_dataSource}
        rowKey='_id'
        onRow={(formInstance: TFormInstance) => ({
          onClick: (e: any) => {
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
        pagination={{
          ...pagination,
          onChange,
          total: submissionsTotal,
          size: 'small'
        }}
        onChange={(_: unknown, __: unknown, sorter: any) => {
          onSortingChange(sorter.order, sorter.field);
        }}
      />
    </>
  );
};

export default SubmissionsOverviewPage;
