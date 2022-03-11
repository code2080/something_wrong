/* eslint-disable react/prop-types */
import { Popover } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// COMPONENTS
import ToolbarButton from '../ToolbarButton';
import TagSelectorComponent from 'Components/TagSelector';

// REDUX
import { batchOperationTags } from 'Redux/ActivitiesSlice';

// TYPES
import { EActivityBatchOperation } from 'Types/ActivityBatchOperations.type';

const TagSelectionButton: React.FC<{ selectedActivityIds: string[] }> = ({
  selectedActivityIds,
}) => {
  const dispatch = useDispatch();
  
  const { formId } = useParams<{ formId: string }>();

  /**
   * EVENT HANDLERS
   */
  const onBatchAssign = (tagId: string | undefined) => {
    const data = selectedActivityIds.map((id) => ({ _id: id, tagId: tagId || null }));
    dispatch(batchOperationTags(formId, { type: EActivityBatchOperation.TAGS, data }))
  }

  const button = (
    <ToolbarButton disabled={!selectedActivityIds.length}>
      <TagOutlined />
      Tag selection
    </ToolbarButton>
  );

  if (!selectedActivityIds.length) return button;

  return (
    <Popover
      title='Tag activity'
      content={<TagSelectorComponent value={undefined} onChange={onBatchAssign} />}
      getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
      trigger='click'
      placement='rightTop'
    >
      {button}
    </Popover>
  );
};

export default TagSelectionButton;
