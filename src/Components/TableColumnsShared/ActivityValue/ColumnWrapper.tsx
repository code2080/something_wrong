import { memo, useMemo, ReactChild } from 'react';

// COMPONENTS
import ColumnContent from './ColumnContent';

// TYPES
import { TActivity } from '../../../Types/Activity/Activity.type';
import { ActivityValue } from '../../../Types/Activity/ActivityValue.type';

type Props = {
  activity: TActivity;
  type: 'values' | 'timing';
  prop: string;
  mapping: any;
  columnPrefix?: (b: ActivityValue[]) => void;
  renderer?: (
    activity: TActivity,
    activityValues: ActivityValue[],
  ) => ReactChild;
  readonly?: boolean;
};

const getAllActivityValuesForDesignProperty = (
  activity: TActivity,
  type: 'values' | 'timing',
  prop: string,
): ActivityValue[] => activity[type].filter((el) => el.extId === prop);

const ColumnWrapper = ({
  activity,
  type,
  prop,
  mapping,
  columnPrefix,
  renderer,
  readonly,
}: Props) => {
  // Memoize all matching activity values
  const activityValues = useMemo(
    () => getAllActivityValuesForDesignProperty(activity, type, prop),
    [activity, type, prop],
  );
  const renderedPayload = useMemo(() => {
    const renderResult = renderer?.(activity, activityValues);

    if (renderResult) {
      return renderResult;
    }

    if (!activityValues || !activityValues.length) return 'No values';

    return (
      <>
        {columnPrefix?.(activityValues) ?? null}
        {activityValues
          .filter((activityValue) => activityValue.value != null)
          .map((activityValue, idx) => (
            <ColumnContent
              key={`av-${idx}`}
              activityValue={activityValue}
              activity={activity}
              type={type}
              prop={prop}
              mapping={mapping}
              readonly={readonly}
            />
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
