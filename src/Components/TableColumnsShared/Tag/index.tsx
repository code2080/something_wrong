import { useDispatch, useSelector } from 'react-redux';
import { Popover, Button } from 'antd';
import { useParams } from 'react-router-dom';

// COMPONENTS
import TagSelectorComponent from '../../TagSelector';

// REDUX
import { tagSelector } from 'Redux/Tags';
import { batchOperationTags } from 'Redux/Activities';

// TYPES
import { TActivity } from '../../../Types/Activity/Activity.type';
import { EActivityBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';

// STYLES
import './index.scss';

type Props = {
  activity: TActivity;
};

const TagColumn = ({ activity }: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const selectedTag = useSelector(tagSelector(activity.tagId));

  /**
   * EVENT HANDLERS
   */
  const onAssignTag = (tagId: string | undefined) => {
    dispatch(
      batchOperationTags(formId, {
        type: EActivityBatchOperation.TAGS,
        data: [{ _id: activity._id, tagId: tagId || null }],
      }),
    );
  };

  return (
    <Popover
      title='Activity tag'
      content={
        <TagSelectorComponent
          value={activity.tagId || undefined}
          onChange={onAssignTag}
        />
      }
      getPopupContainer={() =>
        document.getElementById('te-prefs-lib') as HTMLElement
      }
      trigger='hover'
      placement='rightTop'
    >
      <Button size='small' className='tag-col--wrapper'>
        {selectedTag ? selectedTag.name : 'N/A'}
      </Button>
    </Popover>
  );
};

export default TagColumn;
