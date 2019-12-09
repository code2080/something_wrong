import React from 'react'
import PropTypes from 'prop-types'
import { TECoreAPIContext } from './context';

const TECoreAPIProvider = ({ api, children }) => {
  const Context = TECoreAPIContext;
  return <Context.Provider value={api}>{children}</Context.Provider>;
};

TECoreAPIProvider.propTypes = {
  api: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default TECoreAPIProvider;
