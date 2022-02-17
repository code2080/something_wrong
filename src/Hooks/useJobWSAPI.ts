import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getEnvParams } from '../configs';
import { abortJob, updateJobFromWS } from '../Redux/Jobs/jobs.actions';
import { forceFetchingActivities } from '../Redux/GlobalUI/globalUI.actions';

export const useJobWSAPI = () => {
  const socket = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const [activeJobId, setActiveJobId] = useState(null);
  const { formId } = useParams<{ formId: string }>();

  const stopJob = () => {
    if (activeJobId && formId) {
      console.log({ activeJobId });
      dispatch(abortJob({ jobId: activeJobId, formId }));
    }
  };

  useEffect(() => {
    const url = `${getEnvParams().AM_BE_URL}`;
    const socketUrl = url.slice(0, url.length - 3);

    // Init websocket connection
    socket.current = io(socketUrl, {
      transports: ['websocket'],
    });
    // Set handlers for connection, disconnection
    socket.current.on('connect', () => {
      console.log('WS connection initialized, starting dedicated session');
      socket.current?.emit('watchJobs', { formId });
    });
    socket.current.on('connect_error', (args) => console.log(args));
    socket.current.on('disconnect', (reason) =>
      console.log(`WS connection closed, reason: ${reason}`),
    );
    // Event listener for job update
    socket.current.on('jobUpdate', ({ job }) => {
      const jobId = job?._id ?? null;
      console.log(`Received job update: ${jobId}`);
      setActiveJobId(jobId);
      // Set the active job id and form id
      // Update the redux store
      job && dispatch(updateJobFromWS(job));
      if (job?.status !== 'NOT_STARTED') {
        dispatch(forceFetchingActivities());
      }
    });
    return () => {
      // When component unmounts, close the connection
      socket.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activeJobId, activeJobFormId: formId, stopJob };
};
