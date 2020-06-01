// import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

const mapStateToProps = (state, { ownerId }) => ({
  name: _.get(state, `users.${ownerId}.name`, 'N/A'),
});

const OwnerCol = ({ name }) => name || 'N/A';

OwnerCol.propTypes = {
  objectScope: PropTypes.string,
  label: PropTypes.string,
};

OwnerCol.defaultProps = {
  objectScope: null,
  label: null,
};

export default connect(mapStateToProps, null)(OwnerCol);
