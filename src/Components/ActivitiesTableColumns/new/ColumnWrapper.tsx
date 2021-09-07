import { memo, useMemo } from 'react';

// COMPONENTS

// TYPES
import { TActivity } from '../../../Types/Activity.type';
import { ActivityValue } from '../../../Types/ActivityValue.type';
import ColumnContent from './ColumnContent';

type Props = {
  activity: TActivity;
  type: 'VALUE' | 'TIMING';
  prop: string;
  mapping: any;
};

const getAllActivityValuesForDesignProperty = (
  activity: TActivity,
  type: 'VALUE' | 'TIMING',
  prop: string,
): ActivityValue[] => {
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.filter((el) => el.extId === prop);
};

const ColumnWrapper = ({ activity, type, prop, mapping }: Props) => {
  // Memoize all matching activity values
  const activityValues = useMemo(
    () => getAllActivityValuesForDesignProperty(activity, type, prop),
    [activity, type, prop],
  );
  const renderedPayload = useMemo(() => {
    if (!activityValues || !activityValues.length) return 'No values';
    return activityValues
      .filter((activityValue) => activityValue.value != null)
      .map((activityValue, idx) => (
        <ColumnContent
          key={`av-${idx}`}
          activityValue={activityValue}
          activity={activity}
          type={type}
          prop={prop}
          mapping={mapping}
        />
      ));
  }, [activity, activityValues, mapping, prop, type]);

  return (
    <div className='column--wrapper' style={{ display: 'flex' }}>
      {renderedPayload}
    </div>
  );
};

export default memo(ColumnWrapper);
