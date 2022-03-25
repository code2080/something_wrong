import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import { tableColumns } from '../../Components/TableColumns';

// REDUX
import {
  fetchIntegrationSettings,
  fetchOrg,
} from '../../Redux/Auth/auth.actions';
import { fetchForms, formsLoading, formsSelector } from '../../Redux/Forms';
import { fetchObjectRequests } from '../../Redux/ObjectRequests/ObjectRequests.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchUsers } from '../../Redux/Users/users.actions';
import { fetchMapping } from '../../Redux/Integration/integration.actions';
import { selectAuthedUser } from '../../Redux/Auth/auth.selectors';
import { fetchElements } from '../../Redux/Elements/elements.actions';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';
import { useFetchLabelsFromExtIds } from '../../Hooks/TECoreApiHooks';
import { getAllObjectScopesOnForms } from 'Utils/forms.helpers';

// TYPES
import { TForm } from 'Types/Form.type';
import { EFormStatus } from 'Types/Form/FormStatus.enum';
import moment from 'moment';

const FormList = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  /**
   * SELECTORS
   */
  const forms = useSelector(formsSelector);
  const isLoadingForms = useSelector(formsLoading);
  const user = useSelector(selectAuthedUser);

  /**
   * MEMOIZED PROPS
   */
  const filteredForms = useMemo(
    () =>
      (forms as any[])
        .filter(
          (e) => ![EFormStatus.DRAFT, EFormStatus.ARCHIVED].includes(e.status),
        )
        .sort(
          (a, b) =>
            moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
        ),
    [forms],
  );
  const objectScopes = useMemo(
    () => getAllObjectScopesOnForms(filteredForms),
    [filteredForms],
  );
  useFetchLabelsFromExtIds(objectScopes);

  /**
   * EFFECTS
   */
  useEffect(() => {
    dispatch(fetchForms());
    dispatch(fetchOrg());
    dispatch(fetchElements());
    dispatch(setBreadcrumbs([{ path: '/forms', label: 'Forms' }]));
    dispatch(fetchObjectRequests());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user.organizationId) {
      fetchMapping();
      fetchUsers(user.organizationId);
      fetchIntegrationSettings(user.organizationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className='form-list--wrapper'>
      <DynamicTable
        columns={[
          tableColumns.form.CREATEDAT,
          tableColumns.form.TYPE,
          tableColumns.form.NAME,
          tableColumns.form.DESCRIPTION,
          tableColumns.form.OWNER,
          tableColumns.form.DUE_DATE,
          tableColumns.form.OBJECT_SCOPE,
          tableColumns.form.FORM_STATUS,
          tableColumns.form.RESPONSE_TRACKER,
        ]}
        dataSource={filteredForms}
        rowKey='_id'
        isLoading={isLoadingForms}
        onRow={(form: TForm) => ({
          onClick: () => history.push(`/forms/${form._id}`),
        })}
        pagination={false}
        datasourceId={tableViews.FORM_OVERVIEW}
        resizable
      />
    </div>
  );
};

export default FormList;
