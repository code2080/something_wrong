import { useState } from 'react';

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
          setToolbarContent: (content) => setToolbarContent(content),
        }}
        env='beta'
      />
    </div>
  );
};

export default App;
