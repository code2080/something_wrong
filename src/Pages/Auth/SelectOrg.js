import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Select } from 'antd';

// CONSTANTS
const mapStateToProps = (state) => ({
  organizations: state.auth.availableOrgs,
});

const SelectOrg = ({ organizations, onSelectOrg }) => (
  <Form.Item label='Select your organization:'>
    <Select
      value={undefined}
      placeholder='Select your organization...'
      onChange={onSelectOrg}
      showSearch
      filterOption={(input, option) =>
        option.props.children.toLowerCase().includes(input.toLowerCase())
      }
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      style={{ minWidth: '100%' }}
    >
      {(organizations || []).map((org) => (
        <Select.Option key={org._id} value={org._id}>
          {org.name}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
);

SelectOrg.propTypes = {
  organizations: PropTypes.array,
  onSelectOrg: PropTypes.func.isRequired,
};

SelectOrg.defaultProps = {
  organizations: [],
};

export default connect(mapStateToProps, null)(SelectOrg);
