import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'antd';

// COMPONENTS
import withTECoreAPI from '../../TECoreAPI/withTECoreAPI';
import { ObjectRequestValue, objectRequestDropdownMenu } from '../ObjectRequestValue';

// SELECTORS
import { selectObjectRequestsByValues } from '../../../Redux/ObjectRequests/ObjectRequests.selectors';

// ACTIONS
import { setExtIdPropsForObject } from '../../../Redux/TE/te.actions';
import { updateObjectRequest} from '../../../Redux/ObjectRequests/ObjectRequests.actions';
import { setExternalAction } from '../../../Redux/GlobalUI/globalUI.actions';

// CONSTANTS
import { objectRequestActionToStatus } from '../../../Constants/objectRequestActions.constants';

const DatasourceObjectInner = ({ labels, menu, teCoreAPI }) => {
  const dispatch = useDispatch();
  const foundObjReqs = useSelector(selectObjectRequestsByValues(labels));
  const spotlightRef = useRef(null);

  const onHandledObjectRequest = request => action => (response = {}) => {
    dispatch(setExternalAction(null));
    if(!response || !request) {
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

  return labels.map(label => {
    const objReq = foundObjReqs.find(req => req._id === label);
    return <Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={objReq
        ? objectRequestDropdownMenu({
          dispatch: dispatch,
          teCoreAPI: teCoreAPI,
          coreCallback: onHandledObjectRequest(objReq),
          request: objReq,
          spotlightRef: spotlightRef,
        })
        : menu}
      key={label}
    >
      <div className="dd-trigger element__datasource--inner" ref={spotlightRef}>
        {objReq ? <ObjectRequestValue request={objReq} /> : label || 'N/A'}
        <Icon type="down" />
      </div>
    </Dropdown>
  })
};

DatasourceObjectInner.propTypes = {
  labels: PropTypes.array,
  menu: PropTypes.object.isRequired
};

DatasourceObjectInner.defaultProps = {
  labels: [],
};

export default withTECoreAPI(DatasourceObjectInner);