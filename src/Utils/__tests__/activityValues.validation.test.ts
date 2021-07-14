import { ActivityValue } from 'Types/ActivityValue.type';
import { parameterizedTest, TestMetaData } from 'Utils/test.utils';
import { validateMandatoryFieldValue } from '../activityValues.validation';
import { dummyActivities, dummyActivityDesign } from './mockups';

describe('Activity validations test', () => {
  const testData = [
    [
      'Return true if there is no empty mandatory field',
      {
        args: dummyActivities[0].values as ActivityValue[],
        expected: true,
      },
    ],
    [
      'Return false if there is empty mandatory field',
      {
        args: dummyActivities[2].values as ActivityValue[],
        expected: false,
      },
    ],
    [
      'Return true if there is multiple values of same field, with one of them nonempty mandatory field',
      {
        args: dummyActivities[1].values as ActivityValue[],
        expected: true,
      },
    ],
  ] as TestMetaData<ActivityValue[], boolean>[];

  parameterizedTest(testData, ({ args, expected }) => {
    const result = args.every((val) =>
      validateMandatoryFieldValue(val, dummyActivityDesign),
    );
    expect(result).toBe(expected);
  });
});
