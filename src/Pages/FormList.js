import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table } from 'antd';

// ACTIONS
import { fetchForms } from '../Redux/Forms/forms.actions';
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import { createLoadingSelector } from '../Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
const loadingSelector = createLoadingSelector(['FETCH_FORMS']);
const mapStateToProps = state => ({
  isLoading: loadingSelector(state),
  forms: (Object.keys(state.forms) || []).map(key => state.forms[key])
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
      <Table
        rowKey="_id"
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
          },
          {
            title: 'Object scope',
            dataIndex: 'objectScope',
            key: 'objectScope'
          },
          {
            title: 'Responses',
            dataIndex: 'responseCount',
            render: (text, value) => value.responses.SUBMITTED
          }
        ]}
        dataSource={forms}
        onRow={form => ({
          onClick: () => history.push(`/forms/${form._id}`)
        })}
        pagination={{
          size: 'small',
          pageSize: 50
        }}
        loading={isLoading}
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
