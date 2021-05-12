import { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';
import { Dropdown, Menu } from 'antd';
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';
import _ from 'lodash';

// COMPONENTS
import ObjectRequestModal from '../../Modals/ObjectRequestModal';

// ACTIONS
import { setExtIdPropsForObject } from '../../../Redux/TE/te.actions';
import { updateObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequests.actions';
import { setExternalAction } from '../../../Redux/GlobalUI/globalUI.actions';

// CONSTANTS
import {
  objectRequestActionToStatus,
  objectRequestActions,
  objectRequestActionIcon,
  objectRequestActionLabels,
  objectRequestActionCondition,
  objectRequestOnClick,
} from '../../../Constants/objectRequestActions.constants';

const ObjectRequestDropdown = ({ request, children }) => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const spotlightRef = useRef(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const objectRequestDropdownMenu = ({
    coreCallback,
    request,
    spotlightRef,
    showDetails,
  }) => (
    <Menu
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      onClick={objectRequestOnClick({
        dispatch,
        teCoreAPI,
        coreCallback,
        request,
        spotlightRef,
        showDetails,
      })}
    >
      <span style={{ padding: '5px 12px', cursor: 'default' }}>
        Execute request...
      </span>
      <Menu.Divider />
      {_.flatMap(objectRequestActions).reduce(
        (items, action) =>
          objectRequestActionCondition(request)[action]
            ? [
                ...items,
                <Menu.Item key={action}>
                  {objectRequestActionIcon[action]}{' '}
                  {objectRequestActionLabels[action]}
                </Menu.Item>,
              ]
            : items,
        [],
      )}
    </Menu>
  );

  const onHandledObjectRequest =
    (request) =>
    (action) =>
    (response = {}) => {
      dispatch(setExternalAction(null));
      if (!response || !request) {
        // api call failed (or was cancelled)
        return;
      }
      const { extid, fields } = response;

      const updatedObjectRequest = {
        ...request,
        replacementObjectExtId: extid,
        status: objectRequestActionToStatus[action] || request.status,
      };

      const label = fields[0].values[0];
      dispatch(setExtIdPropsForObject(extid, { label }));
      updateObjectRequest(updatedObjectRequest)(dispatch);
    };

  return (
    <Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={objectRequestDropdownMenu({
        coreCallback: onHandledObjectRequest(request),
        request,
        spotlightRef,
        showDetails: () => {
          setIsDropdownVisible(false);
          setDetailsModalVisible(true);
        },
      })}
      key={request._id}
      visible={isDropdownVisible}
      onVisibleChange={(newVisibility) =>
        !detailsModalVisible && setIsDropdownVisible(newVisibility)
      }
    >
      <div className='dd-trigger' ref={spotlightRef}>
        {children}
        <ObjectRequestModal
          onClose={() => setDetailsModalVisible(false)}
          request={request}
          visible={detailsModalVisible}
        />
      </div>
    </Dropdown>
  );
};

ObjectRequestDropdown.propTypes = {
  request: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
};

export default ObjectRequestDropdown;
