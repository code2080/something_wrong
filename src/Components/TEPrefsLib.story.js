import React, { useState } from 'react';
import TEPrefsLib from './TEPrefsLib';
import { availableEnvs } from '../configs';

export default {
  title: 'Activity Manager Frontend/Components/Primary',
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
export const Primary = ({ env }) => {
  const [toolbarContent, setToolbarContent] = useState(null);
  return (
    <React.Fragment>
      {toolbarContent}
      <TEPrefsLib
        coreAPI={{
          setToolbarContent: content => setToolbarContent(content),
        }}
        env={env}
      />
    </React.Fragment>
  );
};
