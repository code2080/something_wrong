import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

const mapStateToProps = (state, { objectExtId }) => ({
  label: selectExtIdLabel(state)('objects', objectExtId)
});

/**
 * @todo should use redux to get extId props (label) for the object
 */
const ScopedObject = ({ label }) => (
  <div className='scoped-object--wrapper'>
    { label || 'Not scoped'}
  </div>
);

ScopedObject.propTypes = {
  label: PropTypes.string,
  // objectExtId: PropTypes.string.isRequired
};

export default connect(mapStateToProps, null)(ScopedObject);
