import { CascaderProps, Cascader, Tooltip } from 'antd';

const CascaderWithTooltip = (props: CascaderProps & { separator?: string }) => {
  const defaultSeparator = ' / ';
  return (
    <Cascader
      {...props}
      displayRender={(label: string[]) => (
        <Tooltip
          title={label.join(props.separator ?? defaultSeparator)}
          getPopupContainer={() =>
            document.getElementById('te-prefs-lib') as HTMLElement
          }
        >
          <span
            style={{
              width: '100%',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {label.join(props.separator ?? defaultSeparator)}
          </span>
        </Tooltip>
      )}
    />
  );
};

export default CascaderWithTooltip;
