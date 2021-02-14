import React, { useState } from 'react';
import TEPrefsLib from './TEPrefsLib';

export default {
  title: 'PrefsLib'
};

export const Primary = () => {
  const [toolbarContent, setToolbarContent] = useState(null);
  return (
    <div>
      {toolbarContent}
      <TEPrefsLib
        coreAPI={{
          setToolbarContent: content => setToolbarContent(content),
        }}
        env='amLocalhost'
      />
    </div>
  );
};
