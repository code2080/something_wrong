import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Popover, Input, Button } from 'antd';

// ACTIONS
import { toggleUserForFormInstance } from '../../../Redux/FormSubmissions/formSubmissions.actions';

// STYLES
import './FormInstanceAssignment.scss';

const AssignedUser = ({ isSelf, assignedUser, onRemoveUser }) => {
  return (
    <div className={`assignment__popover--item assigned-user ${isSelf ? 'is-self' : ''}`}>
      <div className="assignment__popover__item__avatar">{assignedUser.initials}</div>
      <div className="assignment__popover__item__name">{assignedUser.name}</div>
      <div className="assignment__popover__item__remove" onClick={onRemoveUser}>
        <Icon type="close-circle" />
      </div>
    </div>
  );
};

AssignedUser.propTypes = {
  isSelf: PropTypes.bool.isRequired,
  assignedUser: PropTypes.object.isRequired,
  onRemoveUser: PropTypes.func.isRequired,
};

const User = ({ isSelf, user, onAddUser }) => {
  return (
    <div className={`assignment__popover--item user ${isSelf ? 'is-self' : ''}`} onClick={onAddUser} >
      <div className="assignment__popover__item__avatar">{user.initials}</div>
      <div className="assignment__popover__item__name">{user.name}</div>
    </div>
  );
};

User.propTypes = {
  isSelf: PropTypes.bool.isRequired,
  onAddUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapActionsToProps = {
  toggleUserForFormInstance,
};

const AssignmentPopoverVanilla = ({ selfUID, assignedTo, users, formInstanceId, toggleUserForFormInstance }) => {
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(
    () => {
      const normalizedQuery = query.toLowerCase();
      const _users = Object.keys(users).map(uId => users[uId]);
      const filteredUsers = (_users || [])
        .filter(u => assignedTo.indexOf(u._id) === -1)
        .filter(u => !query || `${u.firstName.toLowerCase()} ${u.lastName.toLowerCase()}`.indexOf(normalizedQuery) > -1)
      const selfUIDIdx = filteredUsers.findIndex(el => el._id === selfUID);
      if (selfUIDIdx > -1)
        return [ filteredUsers[selfUIDIdx], ...filteredUsers.slice(0, selfUIDIdx), ...filteredUsers.slice(selfUIDIdx + 1) ];
      return filteredUsers;
    },
    [assignedTo, users, query]
  );

  const assignedUsers = useMemo(
    () => {
      const _users = assignedTo
        .filter(uid => users[uid])
        .map(uid => users[uid]);
      const selfUIDIdx = _users.findIndex(el => el._id === selfUID);
      if (selfUIDIdx > -1)
        return [ _users[selfUIDIdx], ..._users.slice(0, selfUIDIdx), ..._users.slice(selfUIDIdx + 1) ];
      return _users;
    },
    [assignedTo, users]
  );

  return (
    <div className="assignment--popover">
      <Input
        size="small"
        placeholder="Find users"
        suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.45)' }} />}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="assignment__popover--list">
        <div className="assignment__popover--header">Assigned users</div>
        {!assignedUsers.length && (
          <div className="assignment__popover--item empty">No users assigned</div>
        )}
        {assignedUsers.length > 0 && assignedUsers.map(user =>
          <AssignedUser
            isSelf={selfUID === user._id}
            onRemoveUser={() => toggleUserForFormInstance({ formInstanceId, userId: user._id })}
            assignedUser={user}
            key={user._id}
          />
        )}
      </div>
      <div className="assignment__popover--list">
        <div className="assignment__popover--header">Add users</div>
        {!filteredUsers.length && (
          <div className="assignment__popover--item empty">No users found</div>
        )}
        {filteredUsers.length > 0 && filteredUsers.slice(0, Math.min(filteredUsers.length, 5)).map(
          user => (
            <User
              isSelf={selfUID === user._id}
              user={user}
              key={user._id}
              onAddUser={() => toggleUserForFormInstance({ formInstanceId, userId: user._id })}
            />
          )
        )}
        {filteredUsers.length > 5 && (
          <div className="assignment__popover--item empty">
            {`+ ${filteredUsers.length - 5} more users`}
          </div>
        )}
      </div>
    </div>
  );
};

AssignmentPopoverVanilla.propTypes = {
  selfUID: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string.isRequired,
  assignedTo: PropTypes.array,
  users: PropTypes.object,
  toggleUserForFormInstance: PropTypes.func.isRequired,
};

AssignmentPopoverVanilla.defaultProps = {
  assignedTo: [],
  users: {},
};

const AssignmentPopover = connect(null, mapActionsToProps)(AssignmentPopoverVanilla);

const AssignmentPopoverTitleVanilla = ({ selfUID, formInstanceId, toggleUserForFormInstance }) => (
  <div className="assignment__popover--header">
    <span className="assignment__popover__header--title">Assign submission</span>
    <Button
      type="link"
      size="small"
      onClick={() => toggleUserForFormInstance({ formInstanceId, userId: selfUID })}
    >
      To me
    </Button>
  </div>
);

AssignmentPopoverTitleVanilla.propTypes = {
  selfUID: PropTypes.string.isRequired,
  formInstanceId: PropTypes.string.isRequired,
  toggleUserForFormInstance: PropTypes.func.isRequired,
};

const AssignmentPopoverTitle = connect(null, mapActionsToProps)(AssignmentPopoverTitleVanilla);

const EmptyAssignment = () => (
  <div className="assignment--avatar empty">
    <Icon type="user-add" />
  </div>
);

const AddlUsers = ({ n }) => (
  <div className="assignment--avatar addl">
    {`+${n}`}
  </div>
);

AddlUsers.propTypes = {
  n: PropTypes.number.isRequired,
};

const AssignedAvatar = ({ user, isSelf }) => {
  return (
    <div className={`assignment--avatar assigned ${isSelf ? 'is-self' : ''}`}>
      {user.initials}
    </div>
  );
};

AssignedAvatar.propTypes = {
  isSelf: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
  selfUID: state.auth.user.id,
});

const FormInstanceAssignment = ({ selfUID, users, assignedTo, formInstanceId }) => {
  const sortedAssignments = useMemo(() => {
    const selfUIDIdx = assignedTo.indexOf(selfUID);
    if (selfUIDIdx > -1)
      return [ assignedTo[selfUIDIdx], ...assignedTo.slice(0, selfUIDIdx), ...assignedTo.slice(selfUIDIdx + 1) ];
    return assignedTo;
  }, [assignedTo]);

  return (
    <Popover
      overlayClassName="assignment__popover--wrapper"
      content={(
        <AssignmentPopover
          assignedTo={assignedTo}
          users={users}
          formInstanceId={formInstanceId}
          selfUID={selfUID}
        />
      )}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      title={(
        <AssignmentPopoverTitle
          selfUID={selfUID}
          formInstanceId={formInstanceId}
        />
      )}
      trigger="click"
      placement="right"
    >
      <div className="assignment--wrapper">
        {!sortedAssignments.length && <EmptyAssignment />}
        {sortedAssignments && sortedAssignments[0] && users[sortedAssignments[0]] && <AssignedAvatar user={users[sortedAssignments[0]]} isSelf={sortedAssignments[0] === selfUID} />}
        {sortedAssignments && sortedAssignments[1] && users[sortedAssignments[1]] && <AssignedAvatar user={users[sortedAssignments[1]]} isSelf={sortedAssignments[1] === selfUID} />}
        {sortedAssignments && sortedAssignments[2] && sortedAssignments.length === 3 && users[sortedAssignments[2]] && <AssignedAvatar user={users[sortedAssignments[2]]} isSelf={sortedAssignments[2] === selfUID} />}
        {sortedAssignments && sortedAssignments.length > 3 && <AddlUsers n={sortedAssignments.length - 2} />}
      </div>
    </Popover>
  );
};

FormInstanceAssignment.propTypes = {
  selfUID: PropTypes.string.isRequired,
  users: PropTypes.object,
  assignedTo: PropTypes.array,
  formInstanceId: PropTypes.string.isRequired,
};

FormInstanceAssignment.defaultProps = {
  users: {},
  assignedTo: [],
};

export default connect(mapStateToProps, null)(FormInstanceAssignment);
