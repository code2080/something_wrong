import React, { useState } from 'react';

import TEPrefsLib from '@timeedit/te-prefs-lib';

// STYLES
import '@timeedit/te-prefs-lib/dist/te-prefs-lib.css';

const App = () => {
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

export default App;
