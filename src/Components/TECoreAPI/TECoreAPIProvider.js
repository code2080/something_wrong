import React from 'react';
import PropTypes from 'prop-types';
import { TECoreAPIContext } from './context';

const mockMP = {
  track: (name, data) =>
    console.log('Mixpanel only works while running core locally', {
      name,
      data,
    }),
};

const TECoreAPIProvider = ({ mixpanel = mockMP, api, children }) => {
  const Context = TECoreAPIContext;
  return (
    <Context.Provider value={{ api, mixpanel }}>{children}</Context.Provider>
  );
};

TECoreAPIProvider.propTypes = {
  mixpanel: PropTypes.object,
  api: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default TECoreAPIProvider;
