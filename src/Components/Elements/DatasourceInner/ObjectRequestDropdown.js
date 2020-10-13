import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown, Icon } from 'antd';
import withTECoreAPI from '../../TECoreAPI/withTECoreAPI';

// COMPONENTS
import { ObjectRequestValue, objectRequestDropdownMenu, ObjectRequestModal} from '../ObjectRequestValue';

// ACTIONS
import { setExtIdPropsForObject } from '../../../Redux/TE/te.actions';
import { updateObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequests.actions';

// CONSTANTS
import { objectRequestActionToStatus } from '../../../Constants/objectRequestActions.constants';


const ObjectRequestDropdown = ({ label, request, teCoreAPI }) => {
  const dispatch = useDispatch();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const onHandledObjectRequest = request => action => (response = {}) => {
    if (!response || !request) {
      // api call failed (or was cancelled)
      return;
    }
    const { extid, fields } = response;

    const updatedObjectRequest = {
      ...request,
      replacementObjectExtId: extid,
      status: objectRequestActionToStatus[action] || request.status
    }

    const labelField = fields[0].values[0];
    dispatch(setExtIdPropsForObject(extid, { label: labelField }));
    updateObjectRequest(updatedObjectRequest)(dispatch);
  }

  return <Dropdown
    getPopupContainer={() => document.getElementById('te-prefs-lib')}
    overlay={objectRequestDropdownMenu({ dispatch: dispatch, teCoreAPI: teCoreAPI, coreCallback: onHandledObjectRequest(request), request, showDetails: () => { setIsDropdownVisible(false); setDetailsModalVisible(true) } })}
    key={label}
    visible={isDropdownVisible}
    onVisibleChange={newVisibility => !detailsModalVisible && setIsDropdownVisible(newVisibility)}
  >
    <div className="dd-trigger element__datasource--inner">
      {<ObjectRequestValue request={request} /> || 'N/A'}
      <Icon type="down" />
      <ObjectRequestModal onClose={() => setDetailsModalVisible(false)} request={request} visible={detailsModalVisible} />
    </div>
  </Dropdown>
};

export default withTECoreAPI(ObjectRequestDropdown);