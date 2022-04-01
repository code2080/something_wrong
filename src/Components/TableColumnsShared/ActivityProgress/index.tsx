import { Progress } from 'antd';
import { CSSProperties } from 'react';

type Props = {
  totalActivities: number;
  progressedActivities: number;
  progressColor: CSSProperties['backgroundColor'];
};
const ActivityProgress = ({
  totalActivities,
  progressedActivities,
  progressColor,
}: Props) => {
  const progressPercent = (progressedActivities / totalActivities) * 100;

  return (
    <Progress
      percent={progressPercent}
      format={() => `${progressedActivities.toString()} / ${totalActivities}`}
      strokeColor={progressColor}
      status={'normal'}
      style={{ fontSize: '0.7rem' }}
    />
  );
};

export default ActivityProgress;
