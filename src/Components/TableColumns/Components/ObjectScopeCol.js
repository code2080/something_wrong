// import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

const mapStateToProps = (state, { objectScope }) => ({
  label: _.get(state, `integration.mappedObjectTypes.${objectScope}.applicationObjectTypeLabel`, null),
});

const ObjectScopeCol = ({ objectScope, label }) => label || objectScope || 'N/A';

ObjectScopeCol.propTypes = {
  objectScope: PropTypes.string,
  label: PropTypes.string,
};

ObjectScopeCol.defaultProps = {
  objectScope: null,
  label: null,
};

export default connect(mapStateToProps, null)(ObjectScopeCol);
