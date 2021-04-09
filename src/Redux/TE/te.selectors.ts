import { createSelector } from 'reselect';
import _ from 'lodash';

const selectExtIdProps = (state) => state.te.extIdProps;

export const selectExtIds = createSelector([selectExtIdProps], (extIdProps) =>
  _.flatMapDeep(extIdProps).reduce<any>(
    (extIds: string[], extIdTypes: any) => [
      ...extIds,
      ...Object.values(extIdTypes),
    ],
    [],
  ),
);

export type Field = 'types' | 'fields' | 'objects';

type ExtIdLabelPayload = {
  field: Field;
  extId: string;
  fallbackVal: string;
};

const getLabelFromExtId = (
  extIdProps: any,
  { field, extId, fallbackVal = extId }: ExtIdLabelPayload,
) =>
  !_.isEmpty(extIdProps[field][extId]?.label)
    ? (extIdProps[field][extId].label as string)
    : fallbackVal;

/**
 * @function selectExtIdLabel
 * @description curried function to fetch the label for the specified extId
 * @param {Object} state curried redux state
 * @param {String} field field to access of the extIdProps object (valid arguments: 'fields', 'objects', 'types')
 * @param {String} extId extId that you want to get related label from
 * @param {String} fallbackVal value you want this function to return if it does not find a label for the specified extid
 */
export const selectExtIdLabel = createSelector(
  /**
   * @important extIdProps must be populated by using teCoreAPI.getExtIdProps() first (recommend using useFetchLabelsFromExtids hook)
   */
  selectExtIdProps,
  (extIdProps) => (field: Field, extId: string, fallbackVal = extId) =>
    getLabelFromExtId(extIdProps, { field, extId, fallbackVal }),
);
);
