import React, { useState } from 'react'

import TEPrefsLib from 'te-prefs-lib'

// STYLES
import 'te-prefs-lib/dist/te-prefs-lib.css';

const App = () => {
  const [toolbarContent, setToolbarContent] = useState(null);

  return (
    <div>
      {toolbarContent}
      <span>I am a divider, belonging to the host application and exemplifying that the toolbar is being rendered outside of TEPrefsLib</span>
      <TEPrefsLib
        coreAPI={{
          setToolbarContent: content => setToolbarContent(content),
        }}
      />
    </div>
  );
};

export default App;
