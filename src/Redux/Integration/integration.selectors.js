import _ from 'lodash';
import { datasourceValueTypes } from '../../Constants/datasource.constants';

export const getTECoreAPIPayload = (value, datasource, state) => {
  if (!value) return null;
  const _datasource = datasource.split(',');
  if (!_datasource.length || _datasource.length < 2) return [{ valueType: undefined, extId: undefined }];
  let _retVal = [{
    valueType: datasourceValueTypes.TYPE_EXTID,
    extId: _.get(state, `integration.mapping[${_datasource[0]}].mapping`, undefined),
  }];

  if (_datasource[1] === 'object')
    return [
      {
        valueType: datasourceValueTypes.OBJECT_EXTID,
        extId: value,
      },
      ..._retVal,
    ];
  return [
    {
      valueType: datasourceValueTypes.FIELD_VALUE,
      value,
    },
    ..._retVal,
    {
      valueType: datasourceValueTypes.FIELD_EXTID,
      extId: _datasource[1],
    },
  ];
};
