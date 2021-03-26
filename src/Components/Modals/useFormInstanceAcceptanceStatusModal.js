import { useState } from 'react';
import FormInstanceAcceptanceStatus from './FormInstanceAcceptanceStatus';

const useFormInstanceAcceptanceStatusModal = () => {
  const [open, setOpen] = useState(false);
  const [{ formId, formInstanceId }, setDetails] = useState({});
  return [
    () => (
      <FormInstanceAcceptanceStatus
        isVisible={open}
        onClose={() => setOpen(false)}
        formId={formId}
        formInstanceId={formInstanceId}
      />
    ),
    (details) => {
      setOpen(true);
      setDetails(details);
    },
  ];
};

export default useFormInstanceAcceptanceStatusModal;
