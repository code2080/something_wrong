import { Select } from "antd"
import { useSelector } from "react-redux"

// REDUX
import { tagsSelector } from '../../Redux/Tags';

const ActivityTagPopover = () => {
  const tags = useSelector(tagsSelector);
  <Select
    options={tags.map((el) => ({ value: el._id, label: el.name }))}
    showSearch
    style={{ width: 200 }}
    size="small"
  />
};

export default ActivityTagPopover;