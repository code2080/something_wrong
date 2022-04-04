import { Button } from "antd";

// STYLES
import './index.scss';

// TYPES
type Props = {
  tagNames: string[];
};

const JobTags = ({ tagNames }: Props) => {
  if (!tagNames || !tagNames.length) return <>N/A</>;
  return (
    <div className="job-tags--wrapper">
      {tagNames.map((tagName) => (
        <Button
          size='small'
          className='tag-col--wrapper'
          key={tagName}
        >
          {tagName}
        </Button>
      ))}
    </div>
  );
};

export default JobTags;