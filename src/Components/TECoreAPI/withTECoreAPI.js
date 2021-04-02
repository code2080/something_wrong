import { useContext } from 'react';
import { TECoreAPIContext } from './context';

const withTECoreAPI = (WrappedComponent) => (props) => {
  const teCoreAPI = useContext(TECoreAPIContext);
  return <WrappedComponent {...props} teCoreAPI={teCoreAPI.api} />;
};

export default withTECoreAPI;

export const useTECoreAPI = () => {
  const teCoreAPI = useContext(TECoreAPIContext);
  return teCoreAPI.api;
};
