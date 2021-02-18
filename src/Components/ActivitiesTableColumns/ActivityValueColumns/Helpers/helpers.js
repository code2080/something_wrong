import { activityViews } from '../../../../Constants/activityViews.constants';

export const getNormalizedActivityValue = (activityValue, activity, type, prop) => {
  if (activityValue) return activityValue;
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.find(el => el.extId === prop);
};

export const resetView = () => ({ view: activityViews.VALUE_VIEW, action: null });

export const mapCoreCategoryObjectToCategories = coreCategoryObject =>
  // Categories is an array of objects with ids and values?
  Object.keys(coreCategoryObject).map(key => ({ id: key, values: coreCategoryObject[key] }));
