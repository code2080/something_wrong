import { Cascader } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
  getExtIdParams: any;
};

const ParameterCascader = ({ getExtIdParams }: Props) => {
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    const exec = async () => {
      const parameterObjects = await getExtIdParams();
      const option = Object.keys(parameterObjects).map((extId: any) => ({
        value: extId,
        label: extId,
        children: Object.keys(parameterObjects[extId]).map((type: any) => ({
          value: type,
          label: type,
        })),
      }));

      setOptions(option);
    };
    exec();
  }, []);
  return (
    <div>
      <Cascader
        options={options}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
      />
      <Cascader
        options={options}
        size='small'
        getPopupContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
      />
    </div>
  );
};

export default ParameterCascader;
