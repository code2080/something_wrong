import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

// COMPONENTS
import { withTECoreAPI } from '../../Components/TECoreAPI';
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';

// ACTIONS
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
import { initialState as initialPayload } from '../../Redux/TE/te.helpers';


const loadingSelector = createLoadingSelector(['FETCH_FORMS']);
const mapStateToProps = state => ({
  isLoading: loadingSelector(state),
  forms: selectAllForms(state),
  user: state.auth.user,
});

const mapActionsToProps = {
  fetchForms,
  fetchUsers,
  fetchObjectRequests,
  setBreadcrumbs,
  fetchMapping,
};

const FormList = ({
  forms,
  user,
  isLoading,
  fetchForms,
  fetchUsers,
  fetchMapping,
  fetchObjectRequests,
  teCoreAPI,
  setBreadcrumbs,
  history
}) => {

  const objectScopes = useMemo(() => ({
    ...initialPayload,
    types: _.uniq(forms.reduce((objScopes, form) =>
      form.objectScope
        ? [...objScopes, form.objectScope] :
        objScopes
      , [])
    )
  }), [forms]);

  useFetchLabelsFromExtIds(teCoreAPI, objectScopes);

  useEffect(() => {
    fetchForms();
    setBreadcrumbs([{ path: '/forms', label: 'Forms' }]);
  }, []);

  useEffect(() => {
    if (user && user.organizationId) {
      fetchMapping();
      fetchUsers(user.organizationId);
    }
  }, [user]);

  useEffect(() => {
    fetchObjectRequests();
  }, []);

  return (
    <div className="form-list--wrapper">
      <DynamicTable
        columns={[
          tableColumns.form.NAME,
          tableColumns.form.DESCRIPTION,
          tableColumns.form.OWNER,
          tableColumns.form.DUE_DATE,
          tableColumns.form.OBJECT_SCOPE,
          tableColumns.form.FORM_STATUS,
          tableColumns.form.RESPONSE_TRACKER,
        ]}
        dataSource={forms}
        rowKey="_id"
        isLoading={isLoading}
        onRow={form => ({
          onClick: () => history.push(`/forms/${form._id}`)
        })}
        pagination={false}
        datasourceId={tableViews.FORM_OVERVIEW}
      />
    </div>
  );
};

FormList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  forms: PropTypes.array,
  user: PropTypes.object,
  fetchForms: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  fetchObjectRequests: PropTypes.func.isRequired,
  fetchMapping: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormList.defaultProps = {
  forms: [],
  user: null,
};

export default withRouter(
  withTECoreAPI(connect(mapStateToProps, mapActionsToProps)(FormList))
);
