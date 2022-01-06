import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getEnvParams } from '../configs';

import { updateActivityInWorkerProgress, fetchActivitiesForForm } from '../Redux/Activities/activities.actions';

const useActivityGeneratorWSAPI = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<any>();
  
  useEffect(() => {
    const url = `${getEnvParams().AM_BE_URL}`;
    const socketUrl = url.slice(0, url.length - 3);
    const socket = socketIOClient(socketUrl);
    if (formId) {
      socket.emit('activityGeneration', { formId });
      socket.on('activityGeneration', ({ status, formId }) => {
        if (status === 'DONE')
          dispatch(fetchActivitiesForForm(formId, {}))
          dispatch(updateActivityInWorkerProgress({ formId }))
      });
    }

    // CLEAN UP THE EFFECT
    return () => { socket.disconnect() };
  }, [formId]);


  return null;
};

export default useActivityGeneratorWSAPI;