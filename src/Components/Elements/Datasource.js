import React, { useCallback, useMemo } from 'react';
import { datasourceValueTypes } from '../../Constants/datasource.constants';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// SELECTORS
import { getTECoreAPIPayload, getLabelsForDatasource } from '../../Redux/Integration/integration.selectors';

// HELPERS
import { transformPayloadForDatasourceFiltering } from '../../Utils/teCoreAPIHelpers';

// STYLES
import './Datasource.scss';

// CONSTANTS
import {
  teCoreActions,
  teCoreCallnames
} from '../../Constants/teCoreActions.constants';

import { DatasourceInner, DatasourceEmptyInner } from './DatasourceInner';

const elTypes = {
  EMPTY: 'EMPTY',
  OBJECT: 'OBJECT',
  FILTER: 'FILTER',
};

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.value && ownProps.value[0])
    return { labels: null, payload: null };
  const { value, element } = ownProps;
  const payload = getTECoreAPIPayload(value, element.datasource, state);
  const labels = getLabelsForDatasource(payload, state);
  return {
    payload,
    labels,
  };
};

const Datasource = ({ payload, labels, value, element, teCoreAPI }) => {
  const elType = useMemo(() => {
    if (payload == null) return elTypes.EMPTY;
    if (payload.findIndex(el => el.valueType === datasourceValueTypes.OBJECT_EXTID) > -1) return elTypes.OBJECT;
    return elTypes.FILTER;
  }, [payload]);

  // Callback on menu click
  const onClickCallback = useCallback(
    ({ key }) => {
      const { callname } = teCoreActions[key];
      let _payload;
      switch (callname) {
        case teCoreCallnames.FILTER_OBJECTS:
          _payload = transformPayloadForDatasourceFiltering(payload);
          break;
        default:
          _payload = payload;
          break;
      }
      teCoreAPI[callname](_payload);
    },
    [payload, teCoreAPI]
  );
  // Memoized list of supported actions
  const supportedActions = useMemo(
    () =>
      teCoreAPI
        .getCompatibleFunctionsForElement(element.elementId)
        .filter(action => {
          const src = element.datasource.split(',')[1];
          if (src === 'object' && action === 'FILTER_OBJECTS') {
            return false;
          }
          if (src !== 'object' && action === 'SELECT_OBJECT') {
            return false;
          }
          return true;
        }),
    [teCoreAPI, element]
  );
  // Memoized menu
  const menu = useMemo(
    () => (
      <Menu
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        onClick={onClickCallback}
      >
        {supportedActions.map(key => (
          <Menu.Item key={key}>{teCoreActions[key].label}</Menu.Item>
        ))}
      </Menu>
    ),
    [onClickCallback, supportedActions]
  );

  if (elType === elTypes.EMPTY)
    return (
      <div className="element__datasource--wrapper">
        <DatasourceEmptyInner />
      </div>
    );

  return (
    <div className="element__datasource--wrapper">
      <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={menu}
        trigger={['hover']}
      >
        <div className="dd-trigger">
          <DatasourceInner elType={elType} labels={labels} payload={payload} />
        </div>
      </Dropdown>
    </div>
  );
};

Datasource.propTypes = {
  payload: PropTypes.array,
  labels: PropTypes.object,
  value: PropTypes.array,
  element: PropTypes.object,
  teCoreAPI: PropTypes.object.isRequired
};

Datasource.defaultProps = {
  payload: null,
  label: {},
  value: null,
  element: {}
};

export default connect(mapStateToProps, null)(withTECoreAPI(Datasource));
