import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// SELECTORS
import { getTECoreAPIPayload } from '../../Redux/Integration/integration.selectors';

// HELPERS
import { transformPayloadForDatasourceFiltering } from '../../Utils/teCoreAPIHelpers';

// STYLES
import './Datasource.scss';

// CONSTANTS
import {
  teCoreActions,
  teCoreCallnames
} from '../../Constants/teCoreActions.constants';

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.value && ownProps.value[0])
    return { label: null, payload: null };
  const { value, element } = ownProps;
  const extId = value[0];
  const payload = getTECoreAPIPayload(value[0], element.datasource, state);
  return {
    label: state.te.extIdProps.objects[extId]
      ? state.te.extIdProps.objects[extId].label
      : null,
    payload
  };
};

const Datasource = ({ payload, label, value, element, teCoreAPI }) => {
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

  if (payload == null)
    return (
      <div className="element__datasource--wrapper">
        <div className="element__datasource--inner">
          <Icon type="appstore" />
          N/A
        </div>
      </div>
    );

  return (
    <div className="element__datasource--wrapper">
      <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={menu}
      >
        <div className="element__datasource--inner">
          {label || value.toString() || 'N/A'}
          <Icon type="down" />
        </div>
      </Dropdown>
    </div>
  );
};

Datasource.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.string,
  value: PropTypes.array,
  element: PropTypes.object,
  teCoreAPI: PropTypes.object.isRequired
};

Datasource.defaultProps = {
  payload: null,
  label: null,
  value: null,
  element: {}
};

export default connect(mapStateToProps, null)(withTECoreAPI(Datasource));
