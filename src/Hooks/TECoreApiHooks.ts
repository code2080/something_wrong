import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectExtIds } from '../Redux/TE/te.selectors';
import { setTEDataForValues } from '../Redux/TE/te.actions';
import { TECoreAPIContext } from '../Components/TECoreAPI/context';
import { TECoreAPI } from '../Types/TECoreAPI';
import _ from 'lodash';
import { Dispatch } from 'redux';
import { GetExtIdPropsPayload, TEObject } from '../Types/TECorePayloads.type';

export const useTECoreAPI = (): TECoreAPI => {
  const teCoreAPI: any = useContext(TECoreAPIContext);
  return teCoreAPI.api;
};

export const useMixpanel = () => {
  const teCoreAPI: any = useContext(TECoreAPIContext);
  return teCoreAPI.mixpanel;
};

export const fetchLabelsFromExtIds = (
  teCoreAPI: TECoreAPI,
  dispatch: Dispatch,
  extIds: string[],
  payload: GetExtIdPropsPayload,
) => {
  async function exec(nonNullPayload: GetExtIdPropsPayload) {
    const extIdProps = await teCoreAPI.getExtIdProps(nonNullPayload);
    dispatch(setTEDataForValues(extIdProps));
  }

  const nonNullPayload = {
    objects: _.compact(payload.objects).filter(
      (obj) => (obj as TEObject).id !== null,
    ),
    types: _.compact(payload.types),
    fields: _.compact(payload.fields),
  } as GetExtIdPropsPayload;
  const payloadExtids = _.flatMap(nonNullPayload);
  const missingExtIdsInStore = !payloadExtids.every(
    (extId) =>
      extId && extIds.includes((extId as TEObject).id ?? (extId as string)),
  );

  if (!_.isEmpty(payloadExtids) && missingExtIdsInStore) exec(nonNullPayload);
};

export const useFetchLabelsFromExtIds = (payload: GetExtIdPropsPayload) => {
  const teCoreAPI = useTECoreAPI();
  const dispatch = useDispatch();
  const extIds = useSelector(selectExtIds) as string[];

  useEffect(() => {
    if (teCoreAPI) {
      fetchLabelsFromExtIds(teCoreAPI, dispatch, extIds, payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, teCoreAPI]);
};
