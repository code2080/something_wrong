import { useContext } from 'react';
import { TECoreAPIContext } from './context';

/**
 * @deprecated use useTECoreAPI hook instead
 */
const withTECoreAPI = (WrappedComponent) => (props) => {
  const teCoreAPI = useContext(TECoreAPIContext);
  return <WrappedComponent {...props} teCoreAPI={teCoreAPI.api} />;
};

export default withTECoreAPI;
