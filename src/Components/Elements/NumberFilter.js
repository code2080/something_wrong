import { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, FilterOutlined } from '@ant-design/icons';

// HELPERS
import { getTECoreAPIPayload } from '../../Redux/Integration/integration.selectors';
import { datasourceValueTypes } from '../../Constants/datasource.constants';
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';
import { transformPayloadForNumberFiltering } from '../../Utils/teCoreAPIHelpers';

// STYLES
import './FilterElements.scss';

// CONSTANTS
import {
  teCoreActions,
  teCoreCallnames,
} from '../../Constants/teCoreActions.constants';
import {
  searchCriteriaNumber,
  searchCriteriaNumberProps,
} from '../../Constants/searchCriteria.constants';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

const getSearchCriteria = (value) => searchCriteriaNumber[value.equality];

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.value || !ownProps.value.value)
    return { label: null, payload: null };
  const { value, element } = ownProps;
  const payload = getTECoreAPIPayload(value.value, element.datasource);
  const typeEl = payload.find(
    (el) => el.valueType === datasourceValueTypes.TYPE_EXTID,
  );
  const fieldEl = payload.find(
    (el) => el.valueType === datasourceValueTypes.FIELD_EXTID,
  );
  return {
    searchValue: value.value,
    searchCriteria: getSearchCriteria(value),
    fieldLabel: fieldEl && selectExtIdLabel(state)('fields', fieldEl.extId),
    typeLabel: typeEl && selectExtIdLabel(state)('types', typeEl.extId),
    payload,
  };
};

const NumberFilter = ({
  searchValue,
  searchCriteria,
  fieldLabel,
  typeLabel,
  element,
  payload,
  teCoreAPI,
}) => {
  // Callback on menu click
  const onClickCallback = useCallback(
    ({ key }) => {
      const { callname } = teCoreActions[key];
      let _payload;
      switch (callname) {
        case teCoreCallnames.FILTER_OBJECTS:
          _payload = transformPayloadForNumberFiltering(
            payload,
            searchCriteria,
          );
          break;
        default:
          _payload = payload;
          break;
      }
      teCoreAPI[callname](_payload);
    },
    [payload, searchCriteria, teCoreAPI],
  );
  // Memoized list of supported actions
  const supportedActions = useMemo(
    () => teCoreAPI.getCompatibleFunctionsForElement(element.elementId),
    [teCoreAPI, element],
  );

  // Memoized menu
  const menu = useMemo(
    () => (
      <Menu
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        onClick={onClickCallback}
      >
        {supportedActions.map((key) => (
          <Menu.Item key={key}>{teCoreActions[key].label}</Menu.Item>
        ))}
      </Menu>
    ),
    [onClickCallback, supportedActions],
  );

  return (
    <div className='element__filter--wrapper'>
      <Dropdown
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
        overlay={menu}
      >
        <div className='element__filter--inner'>
          <FilterOutlined />
          {`${typeLabel}/${fieldLabel} ${searchCriteriaNumberProps[searchCriteria].label} ${searchValue}`}
          <DownOutlined />
        </div>
      </Dropdown>
    </div>
  );
};

NumberFilter.propTypes = {
  searchValue: PropTypes.string,
  searchCriteria: PropTypes.string,
  fieldLabel: PropTypes.string,
  typeLabel: PropTypes.string,
  element: PropTypes.object,
  payload: PropTypes.array.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

NumberFilter.defaultProps = {
  searchValue: '',
  searchCriteria:
    searchCriteriaNumberProps[searchCriteriaNumber.EQUAL_TO].label,
  fieldLabel: null,
  typeLabel: null,
  element: {},
};

export default connect(mapStateToProps, null)(withTECoreAPI(NumberFilter));
