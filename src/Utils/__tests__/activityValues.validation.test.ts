import { ActivityValue } from 'Types/ActivityValue.type';
import { validateMandatoryFieldValue } from '../activityValues.validation';

import { dummyActivities, dummyActivityDesign } from './mockups';

describe('Activity validations test', () => {
  it('Return true if there is no empty mandatory field', () => {
    const result = (dummyActivities[0].values as ActivityValue[]).every(
      (val: ActivityValue) => {
        return validateMandatoryFieldValue(val, dummyActivityDesign);
      },
    );
    expect(result).toBeTruthy();
  });

  it('Return false if there is empty mandatory field', () => {
    const result = (dummyActivities[2].values as ActivityValue[]).every(
      (val: ActivityValue) => {
        return validateMandatoryFieldValue(val, dummyActivityDesign);
      },
    );
    expect(result).toBeFalsy();
  });
});
