import { Button } from 'antd';
import { TActivity } from 'Types/Activity.type';
import PropTypes from 'prop-types';

type Props = {
  activities: TActivity[];
};

const JointTeachingGroupMerger = ({ activities }: Props) => {
  return (
    <div>
      Create joint teaching group <Button disabled>Create</Button>
    </div>
  );
};

JointTeachingGroupMerger.propTypes = {
  activities: PropTypes.array.isRequired,
};

export default JointTeachingGroupMerger;
