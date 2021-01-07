import React, { useState } from 'react';
import FormInstanceSchedulingProgress from './FormInstanceSchedulingProgress';

const useFormInstanceSchedulingProgressModal = () => {
  const [open, setOpen] = useState(false);
  const [{ schedulingProgress, formInstanceId }, setDetails] = useState({});
  return [
    () => <FormInstanceSchedulingProgress visible={open} onClose={() => setOpen(false)} schedulingProgress={schedulingProgress} formInstanceId={formInstanceId} />,
    (details) => {
      setOpen(true);
      setDetails(details);
    },
  ];
};

export default useFormInstanceSchedulingProgressModal;
