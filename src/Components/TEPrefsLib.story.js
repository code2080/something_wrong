import React, { useState } from 'react';
import TEPrefsLib from './TEPrefsLib';

export default {
  title: 'Activity Manager Frontend/Components/Primary',
  component: TEPrefsLib,
};

export const Primary = () => {
  const [toolbarContent, setToolbarContent] = useState(null);
  return (
    <React.Fragment>
      {toolbarContent}
      <TEPrefsLib
        coreAPI={{
          setToolbarContent: content => setToolbarContent(content),
        }}
        env='amLocalhost'
      />
    </React.Fragment>
  );
};
