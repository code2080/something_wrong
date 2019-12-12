import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// SELECTORS
import { getTECoreAPIPayload } from '../../Redux/Integration/integration.selectors';

// STYLES
import './Datasource.scss';

// CONSTANTS
import { teCoreActions } from '../../Constants/teCoreActions.constants';

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.value && ownProps.value[0]) return { label: null, payload: null };
  const { value, element } = ownProps;
  const extId = value[0];
  const payload = getTECoreAPIPayload(value[0], element.datasource, state);
  return {
    label: state.te.extIdProps.objects[extId] ? state.te.extIdProps.objects[extId].label : null,
    payload,
  };
};

const Datasource = ({ payload, label, value, element, teCoreAPI }) => {
  // Callback on menu click
  const onClickCallback = useCallback(({ key }) => {
    const { callname } = teCoreActions[key];
    teCoreAPI[callname](payload);
  }, [payload, teCoreAPI]);
  // Memoized list of supported actions
  const supportedActions = useMemo(
    () => teCoreAPI.getCompatibleFunctionsForElement(element.elementId),
    [teCoreAPI, element]
  );
  // Memoized menu
  const menu = useMemo(() => (
    <Menu
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      onClick={onClickCallback}
    >
      {supportedActions.map(key => (
        <Menu.Item key={key}>
          {teCoreActions[key].label}
        </Menu.Item>
      ))}
    </Menu>
  ), [onClickCallback, supportedActions]);

  return (
    <div className="element__datasource--wrapper">
      <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={menu}
      >
        <div className="element__datasource--inner">
          <Icon type="appstore" />
          {label || value.toString()}
          <Icon type="down" />
        </div>
      </Dropdown>
    </div>
  );
};

Datasource.propTypes = {
  payload: PropTypes.array.isRequired,
  label: PropTypes.string,
  value: PropTypes.array,
  element: PropTypes.object,
  teCoreAPI: PropTypes.object.isRequired,
};

Datasource.defaultProps = {
  label: null,
  value: null,
  element: {},
};

export default connect(
  mapStateToProps,
  null
)(withTECoreAPI(Datasource));
