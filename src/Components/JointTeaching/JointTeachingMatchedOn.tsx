import _ from 'lodash';
import JointTeachingGroup, {
  ConflictType,
} from 'Models/JointTeachingGroup.model';
import { ActivityDesign } from 'Models/ActivityDesign.model';
import { useMemo } from 'react';
import { renderComponent } from 'Components/DEPR_ActivitiesTableColumns/ActivityValueColumns/Helpers/rendering';
import TitleCell from 'Components/DEPR_ActivitiesTableColumns/new/TitleCell';
import { getFieldLabel } from 'Utils/activityDesigner';
import { ActivityValue } from 'Types/Activity/ActivityValue.type';
import { Field } from 'Redux/TE/te.selectors';

const JointTeachingMatchedOn = ({
  jointTeachingGroup,
  activityDesigner,
}: {
  jointTeachingGroup: JointTeachingGroup;
  activityDesigner: ActivityDesign;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allElements]);

  const getTypeByExtId = (extId: string) => {
    return (['fields', 'objects'] as Field[]).find((type) =>
      Object.keys(activityDesigner[type] || {}).includes(extId),
    );
  };
  const renderFieldLabel = (key, activityValue: ActivityValue) => {
    if (key === ConflictType.TIMING) return getFieldLabel(activityValue.extId);
    const field = getTypeByExtId(activityValue.extId);
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
