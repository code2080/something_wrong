import { ISimpleAPIResult, ISimpleAPIState } from 'Types/State.type';

export const finishedLoadingSuccess = (state: ISimpleAPIState): void => {
  state.loading = false;
  state.hasErrors = false;
};

export const finishedLoadingFailure = (state: ISimpleAPIState): void => {
  state.loading = false;
  state.hasErrors = true;
};

export const beginLoading = (state: ISimpleAPIState): void => {
  state.loading = true;
  state.hasErrors = false;
};

export const commitAPIPayloadToState = (
  payload: ISimpleAPIResult,
  state: ISimpleAPIState,
  createFn: Function,
  idProp: string = '_id',
): void => {
  try {
    const { results }: ISimpleAPIResult = payload;
    const iteratedResults = results.map((el: any) => createFn(el));

    const map: any[] = iteratedResults.reduce(
      (tot: any[], acc: any) => ({
        ...tot,
        [acc[idProp]]: acc,
      }),
      {},
    );
    state.results = iteratedResults;
    state.map = map;

  } catch (error) {
    console.error(error);
  }
};

/**
 * @function deleteEntityFromState
 * @description standardized way of deleting an entity from the redux state
 * @param {String} id
 * @param {ISimpleAPIState} state
 * @param {String | undefined} idKey
 * @returns {void}
 */
export const deleteEntityFromState = (
  id: string,
  state: ISimpleAPIState,
  idKey = '_id',
): void => {
  const { [id]: _, ...updState } = state.map;
  state.map = updState;
  const idx = state.results.findIndex(
    (el) => el && el[idKey].toString() === id.toString(),
  );
  if (idx > -1)
    state.results = [
      ...state.results.slice(0, idx),
      ...state.results.slice(idx + 1),
    ];
};

/**
 * @function addEntityToState
 * @description standardized way of adding an entity to the redux state
 * @param {ISimpleAPIState} state
 * @param {Object} payload
 * @param {Function} createFn
 * @param {String | undefined} idKey
 * @returns {void}
 */
export const addEntityToState = (
  state: ISimpleAPIState,
  payload: any,
  createFn: Function,
  idKey = '_id',
): void => {
  const item = createFn(payload);
  const map = { ...state.map, [item[idKey]]: item };
  const idx = state.results.findIndex((el) => el[idKey] === item[idKey]);
  const results =
    idx > -1
      ? [...state.results.slice(0, idx), item, ...state.results.slice(idx + 1)]
      : [...state.results, item];
  state.map = map;
  state.results = results;
};

/**
 * @function updateOrCreateEntities
 * @description standardized way of upserting one or many entities from an API call into the redux sate
 * @param {IDefaultAPIState} state
 * @param {Object} payload
 * @param {Function} createFn
 * @param {String | undefined} idKey
 * @returns {void}
 */
export const updateOrCreateEntities = (
  state: ISimpleAPIState,
  payload: any,
  createFn: Function,
  idKey = '_id',
): void => {
  // Create the objects
  const iteratedResults = payload.map((el: any) => createFn(el));

  const map = iteratedResults.reduce(
    (tot: any, acc: any) => ({
      ...tot,
      [acc.id]: acc,
    }),
    state.map,
  );
  const results = iteratedResults.reduce((tot: any, acc: any) => {
    const idx = tot.findIndex((el: any) => el[idKey] === acc[idKey]);
    if (idx > -1) return [...tot.slice(0, idx), acc, ...tot.slice(idx + 1)];
    return [...tot, acc];
  }, state.results);
  state.map = map;
  state.results = results;
};

/**
 * @function upsertEntity
 * @description standardized way of upserting one entity from a PATCH or POST API call into the redux sate
 * @param {ISimpleAPIState} state
 * @param {Object} payload
 * @param {Function} createFn
 * @param {String | undefined} idKey
 * @returns {void}
 */
export const upsertEntity = (
  state: ISimpleAPIState,
  payload: any,
  createFn: Function,
  idKey = '_id',
): void => {
  // Create the objects
  const result = createFn(payload);

  state.map = {
    ...state.map,
    [result[idKey]]: result,
  };
  const idx = state.results.findIndex((el: any) => el[idKey] === result[idKey]);
  if (idx > -1) {
    state.results = [
      ...state.results.slice(0, idx),
      result,
      ...state.results.slice(idx + 1),
    ];
  } else {
    state.results = [...state.results, result];
  }
};

export const transformSimpleAPIResultToFilterLookupPatch = (
  result: Partial<ISimpleAPIResult>,
) => {
  const { results = [] } = result;
  const filterLookupMapPatch = results.reduce(
    (tot, acc) => ({
      ...tot,
      [acc._id]: 1,
    }),
    {},
  );
  return filterLookupMapPatch;
};
