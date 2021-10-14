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
  columnPrefix?: (b: ActivityValue[]) => void;
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
    if (typeof renderer === 'function') {
      const renderResult = renderer(activity, activityValues);
      if (renderResult !== undefined) return renderResult;
    }
    if (!activityValues || !activityValues.length) return 'No values';
    return (
      <>
        {typeof columnPrefix === 'function'
          ? columnPrefix(activityValues)
          : null}
        {activityValues
          .filter((activityValue) => activityValue.value != null)
          .map((activityValue, idx) => (
            <>
              <ColumnContent
                key={`av-${idx}`}
                activityValue={activityValue}
                activity={activity}
                type={type}
                prop={prop}
                mapping={mapping}
              />
            </>
          ))}
      </>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, activityValues, mapping, prop, type]);

  return (
    <div className='column--wrapper' style={{ display: 'flex', gridGap: 8 }}>
      {renderedPayload}
    </div>
  );
};

export default memo(ColumnWrapper);
