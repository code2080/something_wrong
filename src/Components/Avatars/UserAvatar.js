import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// ACTIONS
import { fetchUser } from '../../Redux/Users/users.actions';

// STYLES
import './Avatar.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => ({
  user: state.users[ownProps.ownerId],
});

const mapActionsToProps = {
  fetchUser,
};

const UserAvatar = ({ user }) => {
  return (
    <div className='avatar--wrapper'>
      <div className='avatar--circle'>
        {user.initials}
      </div>
      {user.name}
    </div>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.object,
};

UserAvatar.defaultProps = {
  user: {},
};

export default connect(mapStateToProps, mapActionsToProps)(UserAvatar);
