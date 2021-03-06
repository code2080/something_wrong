import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Dropdown, Menu } from 'antd';
import _ from 'lodash';
import { DownOutlined } from '@ant-design/icons';
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';

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
import { closeAllDropdown } from '../../../Utils/dom.helper';
import ObjectRequestValue from '../ObjectRequestValue';
import styles from './ObjectRequestDropdown.module.scss';

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
      getPopupContainer={() =>
        document.getElementById('te-prefs-lib') as HTMLElement
      }
      onClick={(e) => {
        closeAllDropdown();
        objectRequestOnClick({
          dispatch,
          teCoreAPI,
          coreCallback,
          request,
          spotlightRef,
          showDetails,
        })(e);
      }}
    >
      <span style={{ padding: '5px 12px', cursor: 'default' }}>
        Execute request...
      </span>
      <Menu.Divider />
      {_.flatMap(objectRequestActions as { [ACTION: string]: string }).reduce<
        any[]
      >(
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
    (response: any = {}) => {
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
      getPopupContainer={() =>
        document.getElementById('te-prefs-lib') as HTMLElement
      }
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
        {children || (
          <div
            className={`element__datasource--inner ${styles.dataSourceInner}`}
          >
            <ObjectRequestValue request={request} />
            <DownOutlined />
          </div>
        )}
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
