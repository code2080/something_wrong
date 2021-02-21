import React, { useState } from 'react';
import { Button, Input, Radio } from 'antd';
import { useDispatch } from 'react-redux';

// ACTIONS
import { updateActivityGroup, assignActivityToGroup, deleteActivityGroup } from '../../../../Redux/ActivityGroup/activityGroup.actions';

// TYPES
import { TActivityGroup } from "../../../../Types/ActivityGroup.type"

type Props = {
  activityGroup: TActivityGroup,
  activityId: string,
  isSelected: boolean,
};

enum EModes {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
};

const ActivityGroupListItem = ({ activityGroup, activityId, isSelected }: Props) => {
  const dispatch = useDispatch();
  /**
   * STATE
   */
  const [mode, setMode] = useState(EModes.VIEW);
  const [newGroupName, setNewGroupName] = useState(activityGroup.name);

  /**
   * EVENT HANDLERS
   */
  const onDeleteActivityGroup = () => {
    setMode(EModes.VIEW);
    dispatch(deleteActivityGroup(activityGroup.formId, activityGroup._id));
  }

  const onUpdateActivityGroup = () => {
    dispatch(updateActivityGroup(activityGroup.formId, activityGroup._id, newGroupName));
    setMode(EModes.VIEW);
  }

  const onStartEditMode = () => {
    setNewGroupName(activityGroup.name);
    setMode(EModes.EDIT);
  }

  const onResetMode = () => {
    setNewGroupName(activityGroup.name);
    setMode(EModes.VIEW);
  }

  const onAssignActivityToGroup = () => {
    dispatch(assignActivityToGroup(activityGroup.formId, activityGroup._id, activityId));
    setMode(EModes.VIEW);
  }

  return (
    <div className="acitivity-group--list-item">
      <Radio checked={isSelected} onChange={onAssignActivityToGroup} />
      {mode === EModes.VIEW && (
        <React.Fragment>
          <div className="activity-group--name">
            {activityGroup.name}
          </div>
          <div className="activity-group--btns">
            <Button size="small" icon="edit" onClick={onStartEditMode} />
            <Button className="danger" size="small" icon="delete" onClick={onDeleteActivityGroup} />
          </div>
        </React.Fragment>
      )}
      {mode === EModes.EDIT && (
        <React.Fragment>
          <div className="activity-group--name">
            <Input size="small" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
          </div>
          <div className="activity-group--btns">
            <Button className="danger" size="small" icon="close" onClick={onResetMode} />
            <Button className="success" size="small" icon="check" onClick={onUpdateActivityGroup} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ActivityGroupListItem;