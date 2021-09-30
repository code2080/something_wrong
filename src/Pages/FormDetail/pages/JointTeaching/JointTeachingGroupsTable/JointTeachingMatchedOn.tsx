import _ from 'lodash';
import JointTeachingGroup, {
  ConflictType,
} from 'Models/JointTeachingGroup.model';
import { useMemo } from 'react';
import { renderComponent } from 'Components/ActivitiesTableColumns/ActivityValueColumns/Helpers/rendering';
import TitleCell from 'Components/ActivitiesTableColumns/new/TitleCell';
import { getFieldLabel } from 'Utils/activityDesigner';
import { ActivityValue } from 'Types/ActivityValue.type';

const labelFieldMapping = {
  field: 'fields',
  object: 'objects',
};

const JointTeachingMatchedOn = ({
  jointTeachingGroup,
}: {
  jointTeachingGroup: JointTeachingGroup;
}) => {
  const { matchingOn, activities } = jointTeachingGroup;
  const allElements: string[] = useMemo(() => {
    return _(Object.values(matchingOn).map((elementIds) => elementIds))
      .flatMap()
      .uniq()
      .value();
  }, [matchingOn]);
  const activity = activities[0];

  const foundActivityValues = useMemo(() => {
    return Object.values(ConflictType).reduce(
      (results, type) => ({
        ...results,
        [type]: activity[type].filter(
          (activityValue) =>
            activityValue.elementId &&
            allElements.includes(activityValue.elementId),
        ),
      }),
      {},
    );
  }, [allElements]);

  const renderFieldLabel = (key, activityValue: ActivityValue) => {
    if (key === ConflictType.TIMING) return getFieldLabel(activityValue.extId);
    const field = labelFieldMapping[activityValue.type];
    if (!field) return activityValue.extId;
    return <TitleCell field={field} extId={activityValue.extId} />;
  };

  return (
    <div className='cell--matched-on'>
      {Object.keys(foundActivityValues).map((key) => {
        return foundActivityValues[key].map((activityValue) => {
          const component = renderComponent(activityValue, activity);
          return (
            <div className='cell__value-wrapper' key={activityValue.extId}>
              <span>
                {renderFieldLabel(key, activityValue)}
                {':'}
              </span>
              <span>{component.renderedComponent}</span>
            </div>
          );
        });
      })}
    </div>
  );
};

export default JointTeachingMatchedOn;
