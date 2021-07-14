import { ActivityValue } from 'Types/ActivityValue.type';
import { validateMandatoryFieldValue } from '../activityValues.validation';

import { dummyActivities, dummyActivityDesign } from './mockups';

describe('Activity validations test', () => {
  interface Test {
    args: ActivityValue[];
    expected: boolean;
  }
  type TestData = [message: string, testVars: Test];

  const testData: TestData[] = [
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
  ];

  test.each<[string, Test]>(testData)('%s', (_, test) => {
    const result = test.args.every((val) =>
      validateMandatoryFieldValue(val, dummyActivityDesign),
    );
    expect(result).toEqual(test.expected);
  });
});
