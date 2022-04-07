import { createSelector } from 'reselect';
import _ from 'lodash';

export const selectLabelForType = (
  typeExtId?: string, 
  missingExtIdReturnVal: string | undefined = 'N/A', 
) => (state: any) => {
  if (!typeExtId) return missingExtIdReturnVal;
  const extIdProps = state.te.extIdProps?.types?.typeExtId || null;
  if (!extIdProps || !extIdProps.label) return typeExtId;
  return extIdProps.label;
};

export const selectLabelsForTypes = (
  typeExtIds?: string[], 
  missingExtIdReturnVal: string | undefined = 'N/A', 
) => (state: any) => {
  if (!typeExtIds) return missingExtIdReturnVal;
  const extIdProps = state.te.extIdProps?.types || {};
  return typeExtIds.map((typeExtId: string) => extIdProps[typeExtId]?.label || typeExtId);
};

/**
 * @deprecated
 * ALL BELOW SHOULD BE CONSIDERED DEPRECATED
 */
const selectExtIdProps = (state) => state.te.extIdProps || {};

export const selectExtIds = createSelector(selectExtIdProps, (extIdProps) =>
  _.flatMapDeep<string>(extIdProps).reduce(
    (extIds, extIdTypes: any) => [
      ...extIds,
      ...(Object.keys(extIdTypes) as string[]),
    ],
    <string[]>[],
  ),
);

export const selectLabels = (
  objects: Array<{ type: string; extId?: string }>,
) =>
  createSelector(selectExtIdProps, (extIdProps) =>
    objects.map(
      ({ type, extId }) => (extId && extIdProps[type]?.[extId]?.label) || extId,
    ),
  );
export const selectLabelByTypeAndExtId = ({ type, extId }) =>
  createSelector(
    selectExtIdProps,
    (extIdProps) => extIdProps[type]?.[extId]?.label || extId,
  );

export type Field = 'types' | 'fields' | 'objects';

type ExtIdLabelPayload = {
  field: Field;
  extId?: string | null;
  fallbackVal?: string | null;
};

const getLabelFromExtId = (
  extIdProps: any,
  { field, extId, fallbackVal = extId }: ExtIdLabelPayload,
) =>
  !_.isEmpty(extIdProps[field][extId ?? '']?.label)
    ? (extIdProps[field][extId ?? ''].label as string)
    : fallbackVal;

/**
 * @function selectExtIdLabel
 * @description curried function to fetch the label for the specified extId
 * @param {Object} state curried redux state
 * @param {Field} field field to access of the extIdProps object (valid arguments: 'fields', 'objects', 'types')
 * @param {String} extId extId that you want to get related label from
 * @param {String} fallbackVal value you want this function to return if it does not find a label for the specified extid
 */
export const selectExtIdLabel = createSelector(
  /**
   * @important extIdProps must be populated by using teCoreAPI.getExtIdProps() first (recommend using useFetchLabelsFromExtids hook)
   */
  selectExtIdProps,
  (extIdProps) =>
    (field: Field, extId?: string | null, fallbackVal = extId) =>
      getLabelFromExtId(extIdProps, { field, extId, fallbackVal }),
);

export const deprSelectIndexedExtIdLabel = createSelector(
  selectExtIdProps,
  (extIdProps) => (allActivityValues: Array<[Field, string]>) => {
    return allActivityValues.reduce((values, [field, extId]) => {
      return {
        ...values,
        [`${field}_${extId}`]: getLabelFromExtId(extIdProps, {
          field,
          extId,
          fallbackVal: extId,
        }),
      };
    }, {});
  },
);

export const selectMultipleExtIdLabels = createSelector(
  selectExtIdProps,
  (extIdProps) =>
    (extIds: ExtIdLabelPayload[]): { [extId: string]: string } =>
      extIds.reduce(
        (idLabelMap, extId) => ({
          ...idLabelMap,
          [extId.extId ?? '']: getLabelFromExtId(extIdProps, extId),
        }),
        {},
      ),
);

export const selectAllLabels = () =>
  createSelector(selectExtIdProps, (extIdProps) =>
    Object.values(extIdProps).reduce(
      (results: { [key: string]: string }, item: any) => {
        return {
          ...results,
          ...Object.keys(item).reduce(
            (itemResults, itemKey) => ({
              ...itemResults,
              [itemKey]: item[itemKey].label,
            }),
            {},
          ),
        };
      },
      {},
    ),
  );

/**
 * REWORKED SELECTORS
 */
export const selectIndexedExtIdLabel =
  (activityValues: [Field, string][]) => (state: any) => {
    const extIdProps = state.te.extIdProps || {};

    return activityValues.reduce(
      (values, [field, extId]) => ({
        ...values,
        [`${field}_${extId}`]: getLabelFromExtId(extIdProps, {
          field,
          extId,
          fallbackVal: extId,
        }),
      }),
      {},
    );
  };
