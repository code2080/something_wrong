import { ReactNode, useContext } from 'react';
import { Tabs } from 'antd';

// COMPONENTS
import { ConfirmLeavingPageContext } from '../../Hooks/ConfirmLeavingPageContext';

// STYLES
import './index.scss';

// TYPES
type Props = {
  defaultActiveKey?: string;
  activeKey: string;
  onChange: (key: string) => void;
  children: ReactNode,
  extra?: ReactNode
};

const renderTabBar = (props: any, DefaultTabBar: any, extra?: ReactNode) => (
  <>
    <DefaultTabBar {...props} className={`${props.className} teantd-tabbar`} />
    {!!extra && extra}
  </>
);

const TEAntdTabBar = ({ defaultActiveKey, activeKey, onChange, children, extra }: Props) => {
  const { isModified, triggerConfirm } = useContext(ConfirmLeavingPageContext);

  const handleOnChange = (key: string) => {
    if (isModified) {
      triggerConfirm(() => onChange(key));
    } else {
      onChange(key);
    }
  };

  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      onChange={handleOnChange}
      renderTabBar={(props: any, DefaultTabBar: any) => renderTabBar(props, DefaultTabBar, extra)}
      animated={false}
    >
      {children}
    </Tabs>
  );
};

export default TEAntdTabBar;
