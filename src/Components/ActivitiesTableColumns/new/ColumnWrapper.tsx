import { memo, useMemo, ReactChild } from 'react';

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
  columnPrefix?: (activity: TActivity, b: any) => void;
  renderer?: (
    activity: TActivity,
    activityValues: ActivityValue[],
  ) => ReactChild;
};

const getAllActivityValuesForDesignProperty = (
  activity: TActivity,
  type: 'VALUE' | 'TIMING',
  prop: string,
): ActivityValue[] => {
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.filter((el) => el.extId === prop);
};

const ColumnWrapper = ({
  activity,
  type,
  prop,
  mapping,
  columnPrefix,
  renderer,
}: Props) => {
  // Memoize all matching activity values
  const activityValues = useMemo(
    () => getAllActivityValuesForDesignProperty(activity, type, prop),
    [activity, type, prop],
  );
  const renderedPayload = useMemo(() => {
    if (!activityValues || !activityValues.length) return 'No values';
    if (typeof renderer === 'function') {
      const renderResult = renderer(activity, activityValues);
      if (renderResult !== undefined) return renderResult;
    }
    return activityValues
      .filter((activityValue) => activityValue.value != null)
      .map((activityValue, idx) => (
        <>
          {typeof columnPrefix === 'function'
            ? columnPrefix(activity, activityValue)
            : null}
          <ColumnContent
            key={`av-${idx}`}
            activityValue={activityValue}
            activity={activity}
            type={type}
            prop={prop}
            mapping={mapping}
          />
        </>
      ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, activityValues, mapping, prop, type]);

  return (
    <div className='column--wrapper' style={{ display: 'flex' }}>
      {renderedPayload}
    </div>
  );
};

export default memo(ColumnWrapper);
