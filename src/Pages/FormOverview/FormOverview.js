import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';

// ACTIONS
import { fetchProfile } from '../../Redux/Auth/auth.actions';
import { fetchForms } from '../../Redux/Forms/forms.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import { fetchUsers } from '../../Redux/Users/users.actions';
import { fetchMapping } from '../../Redux/Integration/integration.actions';

// SELECTORS
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
import { tableColumns } from '../../Components/TableColumns';
import { formStatus } from '../../Constants/formStatuses.constants';

const loadingSelector = createLoadingSelector(['FETCH_FORMS']);
const mapStateToProps = state => ({
  isLoading: loadingSelector(state),
  forms: (Object.keys(state.forms) || [])
    .map(key => state.forms[key])
    .filter(form => form.status !== formStatus.ARCHIVED)
    .sort((a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf()),
  user: state.auth.user,
});

const mapActionsToProps = {
  fetchForms,
  fetchProfile,
  fetchUsers,
  setBreadcrumbs,
  fetchMapping,
};

const FormList = ({
  forms,
  user,
  isLoading,
  fetchForms,
  fetchProfile,
  fetchUsers,
  fetchMapping,
  setBreadcrumbs,
  history
}) => {
  useEffect(() => {
    fetchForms();
    fetchProfile();
    fetchUsers();
    setBreadcrumbs([{ path: '/forms', label: 'Forms' }]);
  }, []);

  useEffect(() => {
    if (user && user.organizationId)
      fetchMapping();
  }, [user]);

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
  fetchProfile: PropTypes.func.isRequired,
  fetchMapping: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormList.defaultProps = {
  forms: [],
  user: null,
};

export default withRouter(
  connect(mapStateToProps, mapActionsToProps)(FormList)
);
