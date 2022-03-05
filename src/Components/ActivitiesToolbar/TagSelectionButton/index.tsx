/* eslint-disable react/prop-types */
import { Popover } from "antd";
import { TagOutlined } from "@ant-design/icons";

// COMPONENTS
import ActivityTagPopover from "Components/ActivitiesTableColumns/SchedulingColumns/ActivityTaging/Popover";
import ToolbarButton from "../ToolbarButton";

const TagSelectionButton: React.FC<{ selectedActivityIds: string[] }> = ({ selectedActivityIds }) => {

  const button = <ToolbarButton disabled={!selectedActivityIds.length}><TagOutlined />Tag selection</ToolbarButton>;

  if (!selectedActivityIds.length)
    return button;

  return (
    <Popover
      overlayClassName='activity-tag-popover--wrapper'
      title='Tag activity'
      content={<ActivityTagPopover selectedActivityIds={selectedActivityIds} />}
      getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
      trigger='click'
      placement='rightTop'
    >
      {button}
    </Popover>
  );
};

export default TagSelectionButton;