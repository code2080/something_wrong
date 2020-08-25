import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectExtIds } from '../Redux/TE/te.selectors';
import { setTEDataForValues } from '../Redux/TE/te.actions';
import _ from 'lodash'

export const useFetchLabelsFromExtIds = (teCoreAPI, payload) => {
  const dispatch = useDispatch();
  const extIds = useSelector(state => selectExtIds(state));

  useEffect(() => {
    const filterPayload = (payload) => {
      // const { types, objects, fields } = extIdProps;
      // const { payloadTypes, payloadObjs, payloadFields } = payload;
      
      let payloadCopy = { ...payload };
      _.flatMap(payload).forEach(type => Object.keys(type).forEach(extId => Object.keys(extIds).includes(extId) && delete payloadCopy[type][extId]));
      return payloadCopy;
    }    
    
    async function exec(payload) {
      const extIdProps = await teCoreAPI.getExtIdProps(filterPayload(payload));
      dispatch(setTEDataForValues(extIdProps));
    }
    
    const filteredPayload = filterPayload(payload);
    const { types, objects, fields } = filteredPayload;
    if (!(_.isEmpty(types) && _.isEmpty(objects) && _.isEmpty(fields)))
      exec(filteredPayload);
  }, [payload])
}