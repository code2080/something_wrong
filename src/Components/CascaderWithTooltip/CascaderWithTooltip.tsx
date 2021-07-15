import React from 'react';

import { CascaderProps, Cascader, Tooltip } from 'antd';

const CascaderWithTooltip = (props: CascaderProps) => {
  return (
    <Cascader
      {...props}
      displayRender={(label: string[]) => (
        <Tooltip
          title={label.join('/')}
          getPopupContainer={() =>
            document.getElementById('te-prefs-lib') as HTMLElement
          }
        >
          <span style={{ width: '100%', display: 'block' }}>
            {label.join('/')}
          </span>
        </Tooltip>
      )}
    />
  );
};

export default CascaderWithTooltip;
