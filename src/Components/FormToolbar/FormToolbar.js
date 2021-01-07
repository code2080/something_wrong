import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// COMPONENTS
import UserLabel from './UserLabel';

// STYLES
import '../../Styles/Toolbar.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => ({
  form: state.forms[ownProps.formId],
});

const FormToolbar = ({ form, onClickMore }) => (
  <React.Fragment>
    <div className="toolbar--wrapper">
      <div className="toolbar--section-flex">
        <span className="label">By:</span>
        <UserLabel ownerId={form.ownerId} />
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Name:</span>
        <span className="value">{form.name}</span>
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Description:</span>
        <span className="value">{form.description}</span>
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Form type:</span>
        <span className="value">{form.formType.toLowerCase()}</span>
      </div>
      <div className="toolbar--section-flex">
        <a onClick={() => onClickMore()}>Form info...</a>
      </div>

    </div>
  </React.Fragment>
);

FormToolbar.propTypes = {
  form: PropTypes.object.isRequired,
  onClickMore: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, null)(FormToolbar);
