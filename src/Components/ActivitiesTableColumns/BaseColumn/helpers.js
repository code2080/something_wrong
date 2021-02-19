import { activityViews } from '../../../Constants/activityViews.constants';

export const getActivityValue = (activityValue, activity, type, prop) => {
  if (activityValue) return activityValue;
  const payload = type === 'VALUE' ? activity.values : activity.timing;
  return payload.find(el => el.extId === prop);
};

export const resetView = () => ({ view: activityViews.VALUE_VIEW, action: null });
