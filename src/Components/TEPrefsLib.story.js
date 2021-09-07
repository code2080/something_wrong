import { useState } from 'react';
import { availableEnvs } from '../configs';
import TEPrefsLib from './TEPrefsLib';

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
    <>
      {toolbarContent}
      <TEPrefsLib
        coreAPI={{
          setToolbarContent: (content) => setToolbarContent(content),
        }}
        env={env}
      />
    </>
  );
};
Main.args = { env: 'staging' };
