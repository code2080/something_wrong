import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import ConfirmLeaveTabModal from '../Components/ConfirmLeaveTabModal/ConfirmLeaveTabModal';

export const ConfirmLeavingPageContext = createContext();

export const ConfirmLeavingPageProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [callback, setCallBack] = useState();
  const [executeFuncBeforeLeave, setExecuteFuncBeforeLeave] = useState();

  const handleSave = () => {
    setOpen(false);
    setIsModified(false);
    if (executeFuncBeforeLeave) executeFuncBeforeLeave();
    setExecuteFuncBeforeLeave();
    callback();
  };

  const triggerConfirm = (callback) => {
    setOpen(true);
    setCallBack(() => callback);
  };

  const handleCancel = () => setOpen(false);

  const handleLeaveAnyway = () => {
    setOpen(false);
    setIsModified(false);
    setExecuteFuncBeforeLeave();
    callback();
  };

  return (
    <ConfirmLeavingPageContext.Provider
      value={{
        triggerConfirm,
        isModified,
        setIsModified,
        setExecuteFuncBeforeLeave,
      }}
    >
      {children}
      <ConfirmLeaveTabModal
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleLeave={handleLeaveAnyway}
        isOpen={isOpen}
      />
    </ConfirmLeavingPageContext.Provider>
  );
};

ConfirmLeavingPageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default { ConfirmLeavingPageProvider, ConfirmLeavingPageContext };
