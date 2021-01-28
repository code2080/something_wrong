import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Icon, Popover, Input, Button } from 'antd';
import _ from 'lodash';

// CONSTANTS
import { ASSIGNABLE_PERMISSION_NAME } from '../../../Constants/permissions.constants'

// ACTIONS
import { toggleUserForFormInstance } from '../../../Redux/FormSubmissions/formSubmissions.actions';

// COMPONENTS
import ManageAssigneesList from './ManageAssigneesList';

// SELECTORS
import { getUsers } from '../../../Redux/Users/users.selectors';

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

const AssignedAvatars = ({ assignees, selfUID, show }) => (
  assignees.length
    ? <React.Fragment>
      {_.take(assignees, show).map(assignee => <AssignedAvatar user={assignee} isSelf={assignee._id === selfUID} key={assignee._id} />)}
      {assignees.length > show && <AddlUsers n={assignees.length - show} />}
    </React.Fragment>
    : <EmptyAssignment />
);

AssignedAvatars.propTypes = {
  assignees: PropTypes.array,
  selfUID: PropTypes.string,
  show: PropTypes.number
};

AssignedAvatars.defaultProps = {
  assignees: [],
  selfUID: '',
  show: 3
};

const AssignmentPopoverTitle = ({ onAssignSelf, isSelf }) => (
  <div className="assignment__popover--header">
    <span className="assignment__popover__header--title">Assign submission</span>
    {!isSelf && <Button
      type='link'
      size="small"
      onClick={() => onAssignSelf()}
    >
      To me
    </Button>
    }
  </div>
);

AssignmentPopoverTitle.propTypes = {
  onAssignSelf: PropTypes.func.isRequired,
  isSelf: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  selfUID: state.auth.user.id,
});

const mapActionsToProps = {
  toggleUserForFormInstance,
};

const withKeyMovedToHead = (list, key, accessor = _.identity) => {
  const keyIndex = _.indexOf(list, _.find(list, el => accessor(el) === key));
  return keyIndex > -1 ? [list[keyIndex], ...list.slice(0, keyIndex), ...list.slice(keyIndex + 1)] : [...list];
};

const FormInstanceAssignment = ({ selfUID, assignedTo, formInstanceId, toggleUserForFormInstance }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const users = useSelector(getUsers(ASSIGNABLE_PERMISSION_NAME));
  const sortedUsers = _.sortBy(_.flatMap(users), ['firstName', 'lastName']);
  const _users = withKeyMovedToHead(sortedUsers, selfUID, user => user._id);

  const assignees = useMemo(() => {
    const sortedAssignees = _.sortBy(assignedTo
      .filter(uid => _.find(_users, u => u._id === uid))
      .map(uid => _.find(_users, u => u._id === uid)),
    ['firstName', 'lastName']);

    return withKeyMovedToHead(
      sortedAssignees,
      selfUID, user => user._id)
  },
  [_users, assignedTo]
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = filterQuery.toLowerCase();
    return _users
      .filter(u => !assignedTo.includes(u._id))
      .filter(u => !normalizedQuery || `${u.firstName.toLowerCase()} ${u.lastName.toLowerCase()}`.includes(normalizedQuery))
  },
  [_users, assignedTo, filterQuery]
  );

  const userLists = [{ users: assignees, isAssigned: true }, { users: filteredUsers, isAssigned: false }];
  return (
    <Popover
      overlayClassName="assignment__popover--wrapper"
      title={(
        <AssignmentPopoverTitle
          onAssignSelf={() => toggleUserForFormInstance({ formInstanceId, userId: selfUID })}
          isSelf={!!_.find(assignees, assignee => assignee._id === selfUID)}
        />
      )}
      content={(
        <div className="assignment--popover">
          <Input
            placeholder="Find users"
            suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.45)' }} />}
            onChange={e => setFilterQuery(e.target.value)}
            size='small'
            value={filterQuery}
          />
          {userLists.map(({ users, isAssigned }, i) => (
            <ManageAssigneesList
              key={i}
              users={users}
              selfUID={selfUID}
              isAssigned={isAssigned}
              onToggleUser={userId => toggleUserForFormInstance({ formInstanceId, userId })}
            />
          ))}
        </div>
      )}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      trigger="click"
      placement="rightTop"
    >
      <div className="assignment--wrapper">
        <AssignedAvatars assignees={assignees} selfUID={selfUID} />
      </div>
    </Popover>
  );
};

FormInstanceAssignment.propTypes = {
  selfUID: PropTypes.string.isRequired,
  assignedTo: PropTypes.array,
  formInstanceId: PropTypes.string.isRequired,
  toggleUserForFormInstance: PropTypes.func.isRequired,
};

FormInstanceAssignment.defaultProps = {
  users: {},
  assignedTo: [],
};

export default connect(mapStateToProps, mapActionsToProps)(FormInstanceAssignment);
