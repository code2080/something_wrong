import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon, Avatar } from 'antd';
import _ from 'lodash';

// STYLES
//import './FormInstanceAssignment.scss';

const User = ({ isSelf, user, onToggleUser, isAssigned }) => {
  return (
    <List.Item className={`assignment__popover--item ${isAssigned ? `assigned-user` : `user`} ${isSelf ? 'is-self' : ''}`} onClick={isAssigned ? null : onToggleUser} >
      <Avatar className="assignment__popover__item__avatar">{user.initials}</Avatar>
      <div className="assignment__popover__item__name">{user.name}</div>
      {isAssigned && (
        <div className="assignment__popover__item__remove" onClick={onToggleUser}>
          <Icon type="close-circle" />
        </div>
      )}
    </List.Item>
  );
};

User.propTypes = {
  isSelf: PropTypes.bool,
  onToggleUser: PropTypes.func,
  user: PropTypes.object.isRequired,
  isAssigned: PropTypes.bool
};

User.defaultProps = {
  isAssigned: false,
  onToggleUser: _.noop(),
  isAssigned: _.noop(),
  isSelf: false
};

const ManageAssigneesList = ({
  users,
  selfUID,
  isAssigned,
  onToggleUser
}) => {
  return (
    <List
      className='assignment__popover--list'
      header={isAssigned ? 'Assigned users' : 'Assign users'}
      dataSource={users}
      rowKey={user => user._id}
      size={'small'}
      locale={{
        emptyText: isAssigned ? 'No users assigned' : 'No users found',
      }}
      pagination={(users.length > 10 || !isAssigned) && {
        size: "small",
        defaultPageSize: 10,
        total: users.length,
      }}
      renderItem={user =>
        (
            <User
              isSelf={selfUID === user._id}
              onToggleUser={() => onToggleUser(user._id)}
              user={user}
              isAssigned={isAssigned}
            />
        )
      }
    />
  )
};

ManageAssigneesList.propTypes = {
  users: PropTypes.array,
  selfUID: PropTypes.string,
  isAssigned: PropTypes.bool,
  onToggleUser: PropTypes.func
};

ManageAssigneesList.defaultProps = {
  users: [],
  selfUID: null,
  isAssigned: false,
  onToggleUser: _.noop()
};

export default ManageAssigneesList;