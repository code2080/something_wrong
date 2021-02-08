import { useEffect, useRef, useState } from 'react';
import { getEnvParams } from '../configs';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { abortJob, updateJobFromWS } from '../Redux/Jobs/jobs.actions';

export const useJobWSAPI = organizationId => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const [activeJobId, setActiveJobId] = useState(null);
  const [activeJobFormId, setActiveJobFormId] = useState(null);

  const stopJob = () => {
    if (activeJobId && activeJobFormId)
      dispatch(abortJob({ jobId: activeJobId, formId: activeJobFormId }));
  }

  useEffect(() => {
    const url = `${getEnvParams().AM_BE_URL}`;
    const socketUrl = url.slice(0, url.length - 3);
    // Init websocket connection
    socket.current = io(socketUrl);
    // Set handlers for connection, disconnection
    socket.current.on('connect', () => {
      console.log('WS connection initialized, starting dedicated session');
      socket.current.emit('watchJobs', { organizationId });
    });
    socket.current.on('connect_error', args => console.log(args));
    socket.current.on('disconnect', () => console.log('WS connection closed'));
    // Event listener for job update
    socket.current.on('jobUpdate', ({ job }) => {
      console.log('Received job update');
      // Set the active job id and form id
      setActiveJobId(job._id);
      setActiveJobFormId(job.formId);
      // Update the redux store
      dispatch(updateJobFromWS(job));
    });
    return () => {
      // When component unmounts, close the connection
      socket.current.disconnect();
    };
  }, []);

  return { activeJobId, activeJobFormId, stopJob };
};
