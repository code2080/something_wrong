import React, { useState } from 'react';
import TEPrefsLib from './TEPrefsLib';
import { availableEnvs } from '../configs';

export default {
  title: 'Activity Manager/Components/Main',
  component: TEPrefsLib,
  argTypes: {
    coreAPI: {
      control: false,
    },
    mixpanel: {
      control: false,
    },
    env: {
      control: {
        type: 'select',
        options: availableEnvs,
      },
    },
  },
};

// eslint-disable-next-line react/prop-types
export const Main = ({ env }) => {
  const [toolbarContent, setToolbarContent] = useState(null);
  return (
    <React.Fragment>
      {toolbarContent}
      <TEPrefsLib
        coreAPI={{
          setToolbarContent: (content) => setToolbarContent(content),
        }}
        env={env}
      />
    </React.Fragment>
  );
};
Main.args = { env: 'staging' };
