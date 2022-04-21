/* eslint-disable react/prop-types */
import {Popover } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// COMPONENTS
import ToolbarButton from '../ToolbarButton';
import TagSelectorComponent from 'Components/TagSelector';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// REDUX
import { batchOperationTags } from 'Redux/Activities';

// TYPES
import { EActivityBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';

const TagSelectionButton: React.FC = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();

  const { getSelectedActivityIds, setSelectedKeys } = useSSP();

  /**
   * EVENT HANDLERS
   */
  const onBatchAssign = (tagId: string | undefined) => {
    const activityIds = getSelectedActivityIds();
    const data = activityIds.map((id) => ({
      _id: id,
      tagId: tagId || null,
    }));
    dispatch(
      batchOperationTags(formId as string, {
        type: EActivityBatchOperation.TAGS,
        data,
      }),
    );
    setSelectedKeys([]);
  };

  const button = (
    <ToolbarButton disabled={!getSelectedActivityIds().length}>
      <TagOutlined />
      Tag selection
    </ToolbarButton>
  );

  if (!getSelectedActivityIds().length) return button;
  return (
    <Popover
      title='Tag activity'
      content={
          <TagSelectorComponent value={undefined} onChange={onBatchAssign} onClick={onBatchAssign} />
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
