import { useEffect, useRef, useState } from 'react';
import { getEnvParams } from '../configs';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { abortJob, updateJobFromWS } from '../Redux/Jobs/jobs.actions';
import { fetchActivitiesForForm } from '../Redux/Activities/activities.actions';

import { useParams } from 'react-router-dom';

export const useJobWSAPI = () => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const [activeJobId, setActiveJobId] = useState(null);
  const { formId } = useParams();

  const stopJob = () => {
    if (activeJobId && formId) { dispatch(abortJob({ jobId: activeJobId, formId })); }
  };

  useEffect(() => {
    const url = `${getEnvParams().AM_BE_URL}`;
    const socketUrl = url.slice(0, url.length - 3);

    // Init websocket connection
    socket.current = io(socketUrl);
    // Set handlers for connection, disconnection
    socket.current.on('connect', () => {
      console.log('WS connection initialized, starting dedicated session');
      socket.current.emit('watchJobs', { formId });
    });
    socket.current.on('connect_error', args => console.log(args));
    socket.current.on('disconnect', () => console.log('WS connection closed'));
    // Event listener for job update
    socket.current.on('jobUpdate', ({ job }) => {
      const jobId = job ? job._id : null;
      console.log(`Received job update: ${jobId}`);
      // Set the active job id and form id
      setActiveJobId(jobId);
      // Update the redux store
      job && dispatch(updateJobFromWS(job));
      dispatch(fetchActivitiesForForm(formId));
    });
    return () => {
      // When component unmounts, close the connection
      socket.current.disconnect();
    };
  }, []);

  return { activeJobId, activeJobFormId: formId, stopJob };
};
