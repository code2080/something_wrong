import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'
import PropTypes from 'prop-types';
import { Dropdown, Icon } from 'antd';

import withTECoreAPI from '../../TECoreAPI/withTECoreAPI';

import { ObjectRequestValue, objectRequestDropdownMenu } from '../ObjectRequestValue';
import { selectObjectRequestsByValues } from '../../../Redux/ObjectRequests/ObjectRequests.selectors'

// ACTIONS
import { setExtIdPropsForObject } from '../../../Redux/TE/te.actions';
import { updateObjectRequest} from '../../../Redux/ObjectRequests/ObjectRequests.actions'

// CONSTANTS
import { objectRequestActions, externalobjectRequestActionMapping, RequestStatus, objectRequestActionToStatus } from '../../../Constants/objectRequest.constants'

// TODO: Detect edit requests before selecting label, or else it will be a label instead of extid. Can we change this to always show ID as the other types of requests? Create ticket, explain edge cases
// TODO: labels -> label: only one label per objectInner
const DatasourceObjectInner = ({ labels, menu, teCoreAPI }) => {
  const dispatch = useDispatch();
  const foundObjReqs = useSelector(selectObjectRequestsByValues(labels));

  const onHandledObjectRequest = (requestId, action) => (response = {}) => {
    if(!response) {
      // api call failed (or was cancelled)
      return;
    }
    const { extid, fields } = response;
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
      replacementObjectExtId: extid,
      status: objectRequestActionToStatus[action]
    }

    // TODO: test this when api call is implemented
    const labelField = fields[0].values[0];
    dispatch(setExtIdPropsForObject(extid, [labelField]));
    updateObjectRequest(updatedObjectRequest)(dispatch);
  }

  const handleObjectRequestClick = request => ({ key }) => {
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
          fields: request.objectRequest, 
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
        updateObjectRequest(declinedRequest)(dispatch);
        return;
      case objectRequestActions.REPLACE:
        // replace -> REQUEST_REPLACE_OBJECT
        payload = {
          ...payload,
          objectExtId: request.replacementObjectExtId || request.objectExtId, // TODO: This could be null, should we make core handle this, or is it better to use some kind of requestGetObjectOfType? requestGetObjectFromFilter?
          typeExtId: request.datasource,
        };
        break;
      case objectRequestActions.SEARCH:
        // search -> REQUEST_GET_OBJECT_FROM_FILTER (?)
        // TODO: set up payload
        // Decline -> no action, update obj req status
        const pendingRequest = {
          ...request,
          status: RequestStatus.PENDING
        };
        updateObjectRequest(pendingRequest)(dispatch);
        return;
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