import { cloneDeep, mergeWith } from 'lodash';
import { customFilterPathMergeWith } from '../Utils/helpers';

describe('Merger function used for filters', () => {
  test('Test basic merge on nested properties', () => {
    const baseObj = {
      entry1: ['1'],
      entry2: ['1', '2'],
      nestedEntry: {
        level1: {
          level2a: ['hello'],
        },
      },
    };

    const patch = {
      nestedEntry: {
        level1: {
          level2b: ['hello from b'],
        },
      },
    };

    const clonedObj = cloneDeep(baseObj);
    mergeWith(clonedObj, patch, customFilterPathMergeWith);

    const expected = {
      entry1: ['1'],
      entry2: ['1', '2'],
      nestedEntry: {
        level1: {
          level2a: ['hello'],
          level2b: ['hello from b'],
        },
      },
    };

    expect(clonedObj).toEqual(expected);
  });
});
