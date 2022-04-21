import { Button, Select } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty, trim } from 'lodash';

// REDUX
import { createTagForForm, tagsLoading, tagsSelector } from 'Redux/Tags';

// TYPES
type Props = {
  value: string | undefined;
  onChange: (tagId: string | undefined) => void;
  onClick: (tagId: string | undefined) => void;
};

const TagSelectorComponent = ({ value, onChange, onClick }: Props) => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  
  /**
   * SELECTORS
   */
  const tags = useSelector(tagsSelector);
  const isLoading = useSelector(tagsLoading);

  /**
   * STATE
   */
  const [tagName, setTagName] = useState('');

  /**
   * EVENT HANDLERS
   */
  const onSearch = (val: string) => {
    setTagName(val);
  };

  const onCreateTag = () => {
    dispatch(createTagForForm(formId as string, { name: tagName }));
    setTagName('');
  };

  return (
    <>
    <Select
      options={tags.map((el) => ({ value: el._id, label: el.name }))}
      showSearch
      placeholder='Select or create a tag'
      style={{ width: 200 }}
      size='small'
      value={value}
      onChange={(val) => onChange(val)}
      onSearch={onSearch}
      notFoundContent={
        <div>
          <span>Tag not found</span>
          <Button
            type='link'
            size='small'
            hidden={isEmpty(trim(tagName))}
            onClick={onCreateTag}
          >{`Create '${tagName}'?`}</Button>
        </div>
      }
      loading={isLoading}
      searchValue={tagName}
      optionFilterProp='label'
    />
    <Button type='link' danger onClick={() => onClick(undefined)}>
            Clear
    </Button>
    </>
  );
};

export default TagSelectorComponent;
