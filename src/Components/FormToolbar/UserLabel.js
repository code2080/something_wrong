import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// ACTIONS
import { fetchUser } from '../../Redux/Users/users.actions';

// CONSTANTS
const mapStateToProps = (state, ownProps) => ({
  user: state.users[ownProps.ownerId],
});

const mapActionsToProps = {
  fetchUser,
};

const UserLabel = ({ user, ownerId, fetchUser }) => {
  useEffect(() => {
    fetchUser(ownerId);
  }, []);

  return (
    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
      {user.name}
    </div>
  );
};

UserLabel.propTypes = {
  user: PropTypes.object,
  ownerId: PropTypes.string.isRequired,
  fetchUser: PropTypes.func.isRequired,
};

UserLabel.defaultProps = {
  user: {},
};

export default connect(mapStateToProps, mapActionsToProps)(UserLabel);
