import { useState } from 'react';
import { Button, Input, Radio } from 'antd';
import { useDispatch } from 'react-redux';
import {
  CloseOutlined,
  DeleteOutlined,
  CheckOutlined,
  EditOutlined,
} from '@ant-design/icons';

// ACTIONS
import {
  updateActivityTag,
  assignActivityToTag,
  deleteActivityTag,
} from '../../../../Redux/DEPR_ActivityTag/activityTag.actions';

// TYPES
import { TActivityTag } from '../../../../Types/ActivityTag.type';

type Props = {
  activityTag: TActivityTag;
  activityIds: string[];
  isSelected: boolean;
};

enum EModes {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

const ActivityTagListItem = ({
  activityTag,
  activityIds,
  isSelected,
}: Props) => {
  const dispatch = useDispatch();
  /**
   * STATE
   */
  const [mode, setMode] = useState(EModes.VIEW);
  const [newTagName, setNewTagName] = useState(activityTag.name);

  /**
   * EVENT HANDLERS
   */
  const onDeleteActivityTag = () => {
    setMode(EModes.VIEW);
    dispatch(deleteActivityTag(activityTag.formId, activityTag._id));
  };

  const onUpdateActivityTag = () => {
    dispatch(
      updateActivityTag(activityTag.formId, activityTag._id, newTagName),
    );
    setMode(EModes.VIEW);
  };

  const onStartEditMode = () => {
    setNewTagName(activityTag.name);
    setMode(EModes.EDIT);
  };

  const onResetMode = () => {
    setNewTagName(activityTag.name);
    setMode(EModes.VIEW);
  };

  const onAssignActivityToTag = () => {
    dispatch(
      assignActivityToTag(activityTag.formId, activityTag._id, activityIds),
    );
    setMode(EModes.VIEW);
  };

  return (
    <div className='acitivity-tag--list-item'>
      <Radio checked={isSelected} onChange={onAssignActivityToTag} />
      {mode === EModes.VIEW && (
        <>
          <div className='activity-tag--name' onClick={onAssignActivityToTag}>
            {activityTag.name}
          </div>
          <div className='activity-tag--btns'>
            <Button
              size='small'
              icon={<EditOutlined />}
              onClick={onStartEditMode}
            />
            <Button
              size='small'
              danger
              icon={<DeleteOutlined />}
              onClick={onDeleteActivityTag}
            />
          </div>
        </>
      )}
      {mode === EModes.EDIT && (
        <>
          <div className='activity-tag--name'>
            <Input
              size='small'
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
          </div>
          <div className='activity-tag--btns'>
            <Button
              className='danger'
              size='small'
              icon={<CloseOutlined />}
              onClick={onResetMode}
            />
            <Button
              className='success'
              size='small'
              icon={<CheckOutlined />}
              onClick={onUpdateActivityTag}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityTagListItem;
