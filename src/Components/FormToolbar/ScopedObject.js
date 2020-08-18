import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

const mapStateToProps = (state, { objectExtId }) => ({
  label: state.te.extIdProps.objects[objectExtId]
  ? state.te.extIdProps.objects[objectExtId].label
  : null,

  objectExtId: objectExtId
});

/**
 * @todo should use redux to get extId props (label) for the object
 */
const ScopedObject = ({ label, objectExtId }) => (
  <div className="scoped-object--wrapper">
    { label || objectExtId || 'Not scoped' }
  </div>
);

ScopedObject.propTypes = {
  label: PropTypes.string,
  //objectExtId: PropTypes.string.isRequired
};

export default connect(mapStateToProps, null)(ScopedObject);
