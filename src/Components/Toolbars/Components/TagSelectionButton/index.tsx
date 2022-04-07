/* eslint-disable react/prop-types */
import { Button, Popover } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// COMPONENTS
import ToolbarButton from '../ToolbarButton';
import TagSelectorComponent from 'Components/TagSelector';

// REDUX
import { batchOperationTags } from 'Redux/Activities';

// TYPES
import { EActivityBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';
import { useState } from 'react';

const TagSelectionButton: React.FC<{ selectedActivityIds: string[] }> = ({
  selectedActivityIds,
}) => {
  const dispatch = useDispatch();

  const [tagSelectorValue, setTagSelectorValue] = useState('');
  const { formId } = useParams<{ formId: string }>();

  /**
   * EVENT HANDLERS
   */
  const onBatchClear = () => {
    const data = selectedActivityIds.map((id) => ({ _id: id, tagId: null }));
    dispatch(
      batchOperationTags(formId as string, {
        type: EActivityBatchOperation.TAGS,
        data,
      }),
    );
    setTagSelectorValue('');
  };

  const onBatchAssign = (tagId: string | undefined) => {
    const data = selectedActivityIds.map((id) => ({
      _id: id,
      tagId: tagId || null,
    }));
    dispatch(
      batchOperationTags(formId as string, {
        type: EActivityBatchOperation.TAGS,
        data,
      }),
    );
    setTagSelectorValue(tagId as string);
  };

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
      content={
        <>
          <TagSelectorComponent
            value={tagSelectorValue}
            onChange={onBatchAssign}
          />
          <Button type='link' danger onClick={onBatchClear}>
            Clear
          </Button>
        </>
      }
      getPopupContainer={() =>
        document.getElementById('te-prefs-lib') as HTMLElement
      }
      trigger='click'
      placement='rightTop'
    >
      {button}
    </Popover>
  );
};

export default TagSelectionButton;
