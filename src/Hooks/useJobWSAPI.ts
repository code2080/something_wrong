import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { abortJob, updateJobFromWS } from '../Redux/Jobs/jobs.actions';
import { forceFetchingActivities } from '../Redux/GlobalUI/globalUI.actions';
import { updateActivityInWorkerProgress } from '../Redux/Activities/activities.actions';
import { jobStatus } from '../Constants/jobStatuses.constants';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';
import EventListener from '../Utils/socket.helper';

export const useJobWSAPI = () => {
  const dispatch = useDispatch();
  const [activeJobId, setActiveJobId] = useState(null);
  const { formId } = useParams<{ formId: string }>();

  const stopJob = () => {
    if (activeJobId && formId) {
      dispatch(abortJob({ jobId: activeJobId, formId }));
    }
  };

  useEffect(() => {
    const socket = new EventListener();
    socket.watchJob({ formId }, (job) => {
      setActiveJobId(job?._id ?? null);
      // Set the active job id and form id
      // Update the redux store
      job && dispatch(updateJobFromWS(job));
      if (job && job.status && ![jobStatus.NOT_STARTED].includes(job.status)) {
        dispatch(forceFetchingActivities());
      }
    });

    socket.activityGeneration({ formId }, ({ status }) => {
      if (status === 'DONE')
        dispatch(forceFetchingActivities(ACTIVITIES_TABLE));
      dispatch(updateActivityInWorkerProgress({ formId }));
    });

    return () => {
      // When component unmounts, close the connection
      console.info('WS connection closed on purpose');
      socket.disconnect();
    };
  }, [formId]);

  return { activeJobId, activeJobFormId: formId, stopJob };
};
