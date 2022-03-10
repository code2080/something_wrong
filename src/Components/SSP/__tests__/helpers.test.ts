import { cloneDeep, flatMapDeep, isEmpty, mergeWith, pickBy } from 'lodash';
import { customFilterPathMergeWith, removeDeepEntry } from '../Utils/helpers';

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

  test('Delete deeply nested key', () => {
    const baseObj = {
      entry1: ['1'],
      entry2: ['1', '2'],
      nestedEntry: {
        level1: {
          level2a: ['hello'],
          level2b: { level3b: ['hello from b'] },
        },
      },
    };

    const pathToDelete = ['nestedEntry', 'level1', 'level2b', 'level3b'];

    const cleaned = removeDeepEntry(baseObj, pathToDelete);

    const expected = {
      entry1: ['1'],
      entry2: ['1', '2'],
      nestedEntry: {
        level1: {
          level2a: ['hello'],
          //level2b and level2c should be removed
        },
      },
    };

    expect(cleaned).toEqual(expected);
  });

  test('Delete deeply nested key2', () => {
    const baseObj = {
      entry1: ['1'],
      entry2: ['1', '2'],
      nestedEntry: {
        level1: {
          level2a: ['hello'],
          level2b: { level3b: ['hello from b'] },
        },
      },
    };

    const pathToDelete = ['nestedEntry', 'level1', 'level2b', 'level3b'];
    const pathToDelete2 = ['nestedEntry', 'level1', 'level2a'];

    const cleaned = removeDeepEntry(baseObj, pathToDelete);
    const cleaned2 = removeDeepEntry(cleaned, pathToDelete2);

    const expected = {
      entry1: ['1'],
      entry2: ['1', '2'],
      //empty base level
      nestedEntry: {
        //level1: {
        //level2a: ['hello'],
        //level2b and level2c should be removed
        //},
      },
    };

    expect(cleaned2).toEqual(expected);
  });
});
