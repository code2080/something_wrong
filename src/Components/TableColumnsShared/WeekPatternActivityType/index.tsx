import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectActivityTypeForWeekPatternGroup } from 'Redux/Activities/weekPatternGroups';

type Props = {
  wpgId: string;
};

const WeekPatternActivityType = ({ wpgId }: Props) => {
  const { formId } = useParams<{ formId: string }>();

  const activityType = useSelector(
    selectActivityTypeForWeekPatternGroup(wpgId, formId),
  );
  /**
   * @todo need to get label here
   */
  return <span>{activityType || 'N/A'}</span>;
};

export default WeekPatternActivityType;
