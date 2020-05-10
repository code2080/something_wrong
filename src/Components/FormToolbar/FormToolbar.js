import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';

// COMPONENTS
import UserAvatar from '../Avatars/UserAvatar';

// STYLES
import '../../Styles/Toolbar.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => ({
  form: state.forms[ownProps.formId],
});

const FormToolbar = ({ form }) => (
  <React.Fragment>
    <div className="toolbar--wrapper">
      <div className="toolbar--section-flex">
        <span className="label">By:</span>
        <UserAvatar ownerId={form.ownerId} />
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Name:</span>
        <span className="value">{form.name}</span>
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Description:</span>
        <span className="value">{form.description}</span>
      </div>
    </div>
  </React.Fragment>
);

FormToolbar.propTypes = {
  form: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(FormToolbar);
