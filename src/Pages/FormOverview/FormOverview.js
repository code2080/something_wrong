import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';

// ACTIONS
import { fetchForms } from '../../Redux/Forms/forms.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
import { tableColumns } from '../../Components/TableColumns';

const loadingSelector = createLoadingSelector(['FETCH_FORMS']);
const mapStateToProps = state => ({
  isLoading: loadingSelector(state),
  forms: (Object.keys(state.forms) || [])
    .map(key => state.forms[key])
    .sort((a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf())
});

const mapActionsToProps = {
  fetchForms,
  setBreadcrumbs
};

const FormList = ({
  forms,
  isLoading,
  fetchForms,
  setBreadcrumbs,
  history
}) => {
  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    setBreadcrumbs([{ path: '/forms', label: 'Forms' }]);
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
      />
    </div>
  );
};

FormList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  forms: PropTypes.array,
  fetchForms: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

FormList.defaultProps = {
  forms: []
};

export default withRouter(
  connect(mapStateToProps, mapActionsToProps)(FormList)
);
