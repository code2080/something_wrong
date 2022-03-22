import { useDispatch, useSelector } from 'react-redux';
import { Popover, Button } from 'antd';
import { useParams } from 'react-router-dom';

// COMPONENTS
import TagSelectorComponent from '../../TagSelector';

// REDUX
import { tagSelector } from 'Redux/Tags';
import { batchOperationTags } from 'Redux/Activities';

// TYPES
import { EActivityBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';

// STYLES
import './index.scss';

type Props = {
  tagIds: string[];
  activityIds: string[];
};

const calcFinalTagId = (tagIds: string[]): string | null => {
  if (!tagIds || !tagIds.length || (tagIds.length === 1 && tagIds[0] === null)) return null;
  if (tagIds.length === 1) return tagIds[0];
  return null;
}

const GroupedTags = ({ tagIds, activityIds }: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const tagId = calcFinalTagId(tagIds);
  const selectedTag = useSelector(tagSelector(tagId));
  
  /**
   * EVENT HANDLERS
   */ 
  const onAssignTag = (tagId: string | undefined) => {
    const data = activityIds.map((_id) => ({ _id, tagId: tagId || null }));
    dispatch(batchOperationTags(formId, { type: EActivityBatchOperation.TAGS, data }));
  };

  return (
    <Popover
      title='Tag'
      content={(
        <TagSelectorComponent
          value={tagId || undefined}
          onChange={onAssignTag}
        />
      )}
      getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
      trigger='hover'
      placement='rightTop'
    >
      <Button size='small' className='tag-col--wrapper'>
        {selectedTag ? selectedTag.name : tagIds.length > 1 ? 'Multiple' : 'N/A'}
      </Button>
    </Popover>
  );
};

export default GroupedTags;
