import PropTypes from 'prop-types';
import { RiShareBoxFill } from 'react-icons/ri';
import { ShrinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import HoverAndClickPopOver from '../../ActivityValueColumns/Helpers/HoverAndClickPopOver';
import SelectWithDeleteOption from '../../ActivityValueColumns/Helpers/SelectWithDeleteOption';
import { useState } from 'react';

const JointTeachingIcon = ({ activity }) => {
  const [teachingObject, setTeachingObject] = useState(null);

  const handleSelectJointTeachObj = (jointTeachingObj): void => {
    setTeachingObject(jointTeachingObj);
  };

  const handleResetJointTeachObj = () => {
    setTeachingObject(null);
  };

  const hoverContent = 'Click to indicate joint teaching';
  const clickContent = (
    <SelectWithDeleteOption
      header={'Select joint teaching object'}
      selectedValue={teachingObject}
      onSelect={handleSelectJointTeachObj}
      onDelete={handleResetJointTeachObj}
    />
  );
  const icon = <RiShareBoxFill />;

  if (!activity) return;
  if (teachingObject) {
    return (
      <>
        <HoverAndClickPopOver
          hoverContent={teachingObject}
          clickContent={clickContent}
          icon={icon}
          style={{
            border: 'none',
            background: 'none',
            color: '#40a9ff',
          }}
        />
      </>
    );
  }
  if (activity?.isMerged)
    return (
      <>
        <Button
          icon={<ShrinkOutlined />}
          disabled
          style={{
            border: 'none',
            color: 'green',
            background: 'none',
          }}
        />
      </>
    );

  return (
    <>
      <HoverAndClickPopOver
        hoverContent={hoverContent}
        clickContent={clickContent}
        icon={icon}
        style={{
          border: 'none',
          background: 'none',
        }}
      />
    </>
  );
};

JointTeachingIcon.propTypes = {
  activity: PropTypes.object,
};

export default JointTeachingIcon;
