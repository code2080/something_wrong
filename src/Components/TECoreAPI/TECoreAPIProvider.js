import React from 'react'
import PropTypes from 'prop-types'
import { TECoreAPIContext } from './context';

const TECoreAPIProvider = ({ mixpanel, api, children }) => {
  const Context = TECoreAPIContext;
  return <Context.Provider value={{ api, mixpanel }}>{children}</Context.Provider>;
};

TECoreAPIProvider.propTypes = {
  mixpanel: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default TECoreAPIProvider;
