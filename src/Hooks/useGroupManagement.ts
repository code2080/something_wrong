import { useSelector, useStore } from 'react-redux';
import { useParams } from 'react-router-dom';

// REDUX
import { selectFormById } from 'Redux/DEPR_Forms/forms.selectors';
import { allocateGroups } from 'Redux/Groups';

// HOOKS
import { useTECoreAPI } from './TECoreApiHooks';

// TYPES
import { IState } from 'Types/State.type';
import {
  ECreateObjectsMode,
  TActivityTypeTrackGroup,
  TCreateObjectsRequestPayload,
  TRequestSummary,
} from 'Types/GroupManagement.type';
import { useAppDispatch } from './useAppHooks';

export const useGroupManagement = () => {
  const { formId } = useParams<{ formId: string }>();
  const store = useStore(); // Hacky...
  const dispatch = useAppDispatch();
  const teCoreAPI = useTECoreAPI();
  /**
   * SELECTORS
   */
  const form = useSelector(selectFormById(formId as string));

  const requestCreateObjects = (requestSummary: TRequestSummary[]) => {
    const finalPayload: TCreateObjectsRequestPayload[] = requestSummary.map(
      (el) => ({
        numberOfObjects: el.numberOfObjects,
        typeExtId: el.typeExtId,
        connectTo: {
          typeExtId: el.connectTo.typeExtId,
          extId: el.connectTo.extId,
        },
      }),
    );
    teCoreAPI.requestCreateObjects(Object.values(finalPayload), (args) =>
      console.log(args),
    );
  };

  const createRequestSummary = (
    typeExtId: string | undefined,
    mode: ECreateObjectsMode,
    activityTypeGroupIds: string[],
  ): TRequestSummary[] => {
    if (
      !form ||
      !form.objectScope ||
      !typeExtId ||
      !activityTypeGroupIds ||
      !activityTypeGroupIds.length
    )
      return [];
    const state: IState = store.getState();
    // Get the loaded activity groups
    /**
     * @todo do this on the BE instead to make it compatible with SSP
     */
    const activityTypeGroups: TActivityTypeTrackGroup[] = activityTypeGroupIds
      .filter((el) => state.groups.data[state.groups.groupBy].map[el])
      .map((el) => state.groups.data[state.groups.groupBy].map[el]);

    // Reduce to a keyed TCreateObjectsRequestPayload[]
    const payload = activityTypeGroups.reduce<Record<string, TRequestSummary>>(
      (tot, acc) => {
        if (tot[acc.primaryObject]) return tot;
        tot[acc.primaryObject] = {
          numberOfObjects:
            mode === ECreateObjectsMode.SINGLE_GROUP
              ? 1
              : acc.maxTracksForPrimaryObject,
          typeExtId,
          connectTo: {
            typeExtId: form.objectScope,
            extId: acc.primaryObject,
          },
          primaryObject: acc.primaryObject,
          maxTracksForPrimaryObject: acc.maxTracksForPrimaryObject,
        };
        return tot;
      },
      {},
    );

    return Object.values(payload);
  };

  const requestAllocateObjectsByIds = (
    activityTypeGroupIds: string[]
    ) => {
    const state: IState = store.getState();
    const activityTypeGroups: TActivityTypeTrackGroup[] = activityTypeGroupIds
      .filter((el) => state.groups.data[state.groups.groupBy].map[el])
      .map((el) => state.groups.data[state.groups.groupBy].map[el]);
    const activityIds = activityTypeGroups.flatMap((a) => a.activityIds.flatMap((ai) => ai));
    dispatch(allocateGroups(formId as string, activityIds));
  };

  return {
    requestCreateObjects,
    createRequestSummary,
    requestAllocateObjectsByIds,
  };
};
