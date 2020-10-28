import { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectExtIds } from '../Redux/TE/te.selectors';
import { setTEDataForValues } from '../Redux/TE/te.actions';
import { initialState as initialPayload } from '../Redux/TE/te.helpers';
import { TECoreAPIContext } from '../Components/TECoreAPI/context';
import _ from 'lodash'

export const useFetchLabelsFromExtIds = (payload) => {
  const teCoreAPI = useContext(TECoreAPIContext);
  const dispatch = useDispatch();
    const extIds = useSelector(state => selectExtIds(state));

  async function exec(payload) {
    const extIdProps = await teCoreAPI.getExtIdProps({ ...initialPayload, ...payload });
    dispatch(setTEDataForValues(extIdProps));
  }

  useEffect(() => {
    const payloadExtids = _.flatMap(payload);
    const missingExtIdsInStore = !payloadExtids.every(extId => extIds.includes(extId));
    if (!_.isEmpty(payloadExtids) && missingExtIdsInStore)
      exec(payload)
  }, [payload]);
};

