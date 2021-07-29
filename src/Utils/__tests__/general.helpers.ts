import { parameterizedTest, TestMetaData } from 'Utils/test.utils';
import { isEmptyDeep } from 'Utils/general.helpers';

const dummyObjects = [
  null,
  '',
  0,
  {
    tmp: [],
  },
  [[], {}],
  {
    tmp: {
      tmp2: [],
    },
  },
  {
    tmp: {
      tmp2: [],
      tmp3: '',
    },
  },
  {
    tmp: {
      tmpStr: 'Test',
      values: [],
    },
  },
  {
    tmp: {
      tmpStr: 'Test',
      values: {
        tmpValue: {},
      },
    },
  },
  {
    tmp: {
      tmpStr: 'Test',
      values: [0, 1, 2],
    },
  },
  {
    tmp: {
      tmp2: [],
      tmp3: 'TEST',
    },
  },
];

describe('isEmptyDeep tests', () => {
  const testData = [
    [
      'Return true if the input is empty, ',
      {
        args: dummyObjects[0],
        expected: true,
      },
    ],
    [
      'Return true if the input is empty, ',
      {
        args: dummyObjects[1],
        expected: true,
      },
    ],
    [
      'Return true if the input is empty, ',
      {
        args: dummyObjects[2],
        expected: true,
      },
    ],
    [
      'Return true if data is object or array, and all children are empty,',
      {
        args: dummyObjects[3],
        expected: true,
      },
    ],
    [
      'Return true if data is object or array, and all children are empty,',
      {
        args: dummyObjects[4],
        expected: true,
      },
    ],
    [
      'Return true if data is object or array, and all children are empty,',
      {
        args: dummyObjects[5],
        expected: true,
      },
    ],
    [
      'Return true if data is object or array, and all children are empty,',
      {
        args: dummyObjects[6],
        expected: true,
      },
    ],
    [
      'Return true if data is object or array, and there is empty `values`, ',
      {
        args: dummyObjects[7],
        expected: true,
      },
    ],
    [
      'Return true if data is object or array, and there is empty `values`, ',
      {
        args: dummyObjects[8],
        expected: true,
      },
    ],
    [
      'Return false there is something inside the object/array',
      {
        args: dummyObjects[9],
        expected: false,
      },
    ],
    [
      'Return false there is something inside the object/array',
      {
        args: dummyObjects[10],
        expected: false,
      },
    ],
  ] as TestMetaData<any, boolean>[];

  parameterizedTest(testData, ({ args, expected }) => {
    const valid = isEmptyDeep(args);
    expect(valid).toBe(expected);
  });
});
