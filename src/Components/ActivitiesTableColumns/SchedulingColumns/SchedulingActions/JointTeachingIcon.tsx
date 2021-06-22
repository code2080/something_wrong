import { RiShareBoxFill } from 'react-icons/ri';
import { Button, Popover } from 'antd';
import HoverAndClickPopOver from '../../ActivityValueColumns/Helpers/HoverAndClickPopOver';
import SelectWithDeleteOption from '../../ActivityValueColumns/Helpers/SelectWithDeleteOption';
import { useSelector } from 'react-redux';

const JointTeachingIcon = (jointTeachingProps) => {
  const [jointTeachingObj, setJointTeachingObj] = useSelector();

  if (!jointTeachingProps) return;
  const hoverContent = 'Click to indicate joint teaching';
  const clickContent = (
    <SelectWithDeleteOption
      placeholder={'Placeholder'}
      header={'Select joint teaching object'}
    />
  );
  const icon = <RiShareBoxFill />;

  if (jointTeachingProps?.hasJointTeaching)
    return (
      <Popover content={'Click to indicate joint teaching'}>
        <Button
          style={{
            padding: 0,
            border: 'none',
            background: 'none',
          }}
          icon={<RiShareBoxFill size='large' />}
        ></Button>
      </Popover>
    );

  if (jointTeachingProps?.isMerged)
    return <Button icon={<RiShareBoxFill size='large' color='green' />} />;

  return (
    <>
      <HoverAndClickPopOver
        hoverContent={hoverContent}
        clickContent={clickContent}
        icon={icon}
      />
    </>
  );
};

export default JointTeachingIcon;
