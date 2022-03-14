import { parameterizedTest, TestMetaData } from '../../Utils/test.utils';
import { dummyActivityDesign } from '../../Mock/ActivityDesign';
import { dummyActivities } from '../../Mock/Activities';
import { TActivity } from '../../Types/Activity/Activity.type';
import { validateActivityByMandatoryFieldValue } from '../activityValues.validation';

describe('Activity validations test', () => {
  const testData = [
    [
      'Return true if there is no empty mandatory field',
      {
        args: dummyActivities[0] as TActivity,
        expected: true,
      },
    ],
    [
      'Return true if there is multiple values of same field, with one of them nonempty mandatory field',
      {
        args: dummyActivities[1] as TActivity,
        expected: true,
      },
    ],
    [
      'Return false if there is multiple values of same field, with all of them empty mandatory field',
      {
        args: dummyActivities[2] as TActivity,
        expected: false,
      },
    ],
    [
      'Return false if all mandatory fields are empty',
      {
        args: dummyActivities[3] as TActivity,
        expected: false,
      },
    ],
    [
      'Return true if mandatory fields are not array',
      {
        args: dummyActivities[4] as TActivity,
        expected: true,
      },
    ],
  ] as TestMetaData<TActivity, boolean>[];

  parameterizedTest(testData, ({ args, expected }) => {
    const valid = validateActivityByMandatoryFieldValue(
      args,
      dummyActivityDesign,
    );
    expect(valid).toBe(expected);
  });
});
