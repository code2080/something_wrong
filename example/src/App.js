import React, { useState } from 'react'

import TEPrefsLib from 'te-prefs-lib'

// STYLES
import 'te-prefs-lib/dist/te-prefs-lib.css';

const App = () => {
  const [toolbarContent, setToolbarContent] = useState(null);

  return (
    <div>
      {toolbarContent}
      <TEPrefsLib
        coreAPI={{
          setToolbarContent: content => setToolbarContent(content),
        }}
        env="production"
      />
    </div>
  );
};

export default App;
