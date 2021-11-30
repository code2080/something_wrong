import { useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';

// ACTIONS
import {
  fetchIntegrationSettings,
  fetchOrg,
} from '../../Redux/Auth/auth.actions';
import { fetchForms } from '../../Redux/Forms/forms.actions';
import { fetchObjectRequests } from '../../Redux/ObjectRequests/ObjectRequests.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchUsers } from '../../Redux/Users/users.actions';
import { fetchMapping } from '../../Redux/Integration/integration.actions';

// SELECTORS
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
import { tableColumns } from '../../Components/TableColumns';
import { tableViews } from '../../Constants/tableViews.constants';
import { selectAllForms } from '../../Redux/Forms/forms.selectors';
import { useFetchLabelsFromExtIds } from '../../Hooks/TECoreApiHooks';
import { fetchElements } from '../../Redux/Elements/elements.actions';
import { formStatus } from '../../Constants/formStatuses.constants';

const loadingSelector = createLoadingSelector(['FETCH_FORMS']);
const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  user: state.auth.user,
});

const mapActionsToProps = {
  fetchForms,
  fetchElements,
  fetchUsers,
  fetchObjectRequests,
  setBreadcrumbs,
  fetchMapping,
  fetchOrg,
  fetchIntegrationSettings,
};

const FormList = ({
  user,
  isLoading,
  fetchForms,
  fetchElements,
  fetchUsers,
  fetchMapping,
  fetchOrg,
  fetchIntegrationSettings,
  fetchObjectRequests,
  setBreadcrumbs,
  history,
}) => {
  const forms = useSelector(selectAllForms);

  const filteredForms = useMemo(() => {
    return forms.filter((form) => form.status !== formStatus.DRAFT);
  }, [forms]);

  const objectScopes = useMemo(
    () => ({
      types: _.uniq(
        filteredForms.reduce(
          (objScopes, form) =>
            form.objectScope ? [...objScopes, form.objectScope] : objScopes,
          [],
        ),
      ),
    }),
    [filteredForms],
  );

  useFetchLabelsFromExtIds(objectScopes);

  useEffect(() => {
    fetchForms();
    fetchOrg();
    fetchElements();
    setBreadcrumbs([{ path: '/forms', label: 'Forms' }]);
    fetchObjectRequests();
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
        isLoading={isLoading}
        onRow={(form) => ({
          onClick: () => history.push(`/forms/${form._id}`),
        })}
        pagination={false}
        datasourceId={tableViews.FORM_OVERVIEW}
        resizable
      />
    </div>
  );
};

FormList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  fetchForms: PropTypes.func.isRequired,
  fetchElements: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  fetchObjectRequests: PropTypes.func.isRequired,
  fetchMapping: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  fetchOrg: PropTypes.func.isRequired,
  fetchIntegrationSettings: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

FormList.defaultProps = {
  forms: [],
  user: null,
};

export default withRouter(
  connect(mapStateToProps, mapActionsToProps)(FormList),
);
