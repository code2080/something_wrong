import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'antd';

import withTECoreAPI from '../../TECoreAPI/withTECoreAPI';

import { ObjectRequestValue, objectRequestDropdownMenu } from '../ObjectRequestValue';
import { selectObjectRequestsByValues } from '../../../Redux/ObjectRequests/ObjectRequests.selectors'

import { updateObjectRequest} from '../../../Redux/ObjectRequests/ObjectRequests.actions'

// CONSTANTS
import { objectRequestActions, externalobjectRequestActionMapping, RequestStatus, objectRequestActionToStatus } from '../../../Constants/objectRequest.constants'

// TODO: Implement action on clicking obj req dropdown item. 
// TODO: Detect edit requests before selecting label, or else it will be a label instead of extid. Can we change this to always show ID as the other types of requests?
const DatasourceObjectInner = ({ labels, menu, teCoreAPI }) => {
  const dispatch = useDispatch();
  const foundObjReqs = useSelector(selectObjectRequestsByValues(labels));

  const onHandledObjectRequest = (requestId, action) => ({ extId, label }) => {
    // TODO: call redux action to update object request with replacedObjectExtI and set status
    if(extId === null) {
      console.log('api call failed (or was cancelled)');
      return;
    }
    const request = foundObjReqs.find(req => req._id === requestId);
    if(!request) {
      console.log('request not found on return from api');
      return;
    }

    if(action === objectRequestActions.SEARCH){
      return; // We do not want to set any status as of now at least, maybe replace?? Or just show in core a la select object?
    }
    const updatedObjectRequest = {
      ...request,
      replacementObjectExtI: extId,
      status: objectRequestActionToStatus[action]
    }
    
    console.log({action: updateObjectRequest(updatedObjectRequest)});
    updateObjectRequest(updatedObjectRequest)(dispatch);
  }

  const handleObjectRequestClick = request => ({ key }) => {
    console.log({ key, type: request.type });
    const callname = externalobjectRequestActionMapping[key];
    let payload = {
      callback: onHandledObjectRequest(request._id, key)
    };

    switch (key) {
      case objectRequestActions.ACCEPT:
        // accept -> new api call to edit/create obj
        payload = { 
          ...payload,
          extId: request.objectExtId, 
          fields: _.toPairs(request.objectRequest), 
          objectType: request.datasource, 
          requestType: request.type, 
        };
        break;
      case objectRequestActions.DECLINE:
        // Decline -> no action, update obj req status
        const declinedRequest = {
          ...request,
          status: RequestStatus.DECLINED
        };
        console.log('setting declined status!');
        updateObjectRequest(declinedRequest)(dispatch);
        return;
      case objectRequestActions.REPLACE:
        // replace -> REQUEST_REPLACE_OBJECT
        // TODO: set up payload
        payload = {
          ...payload,
          objectExtId: request.finalObjectExtI || request.objectExtId,
          typeExtId: request.datasource,
        };
        break;
      case objectRequestActions.SEARCH:
        // search -> REQUEST_GET_OBJECT_FROM_FILTER
        // TODO: set up payload
        break;
      default:
        console.log(`Unsupported object request action: ${callname}`);
        return;
    }
    teCoreAPI[callname](payload);
  }

  return labels.map(label => {
    const objReq = foundObjReqs.find(req => req._id === label);
    return <Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={objReq ? objectRequestDropdownMenu({ onClick: handleObjectRequestClick(objReq) }) : menu}
      key={label}
    >
      <div className="dd-trigger element__datasource--inner">
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