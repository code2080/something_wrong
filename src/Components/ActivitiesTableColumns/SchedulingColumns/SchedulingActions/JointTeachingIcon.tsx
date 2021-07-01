/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from 'prop-types';
import { RiShareBoxFill } from 'react-icons/ri';
import { ShrinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import HoverAndClickPopOver from '../../ActivityValueColumns/Helpers/HoverAndClickPopOver';
import SelectWithDeleteOption from '../../ActivityValueColumns/Helpers/SelectWithDeleteOption';
import { useMemo, useState } from 'react';
import { updateActivity } from '../../../../Redux/Activities/activities.actions';

import { useSelector, useDispatch } from 'react-redux';

import { makeSelectForm } from '../../../../Redux/Forms/forms.selectors';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import _ from 'lodash';

const JointTeachingIcon = ({ activity }) => {
  if (!activity?.formId) return null;
  const { formId }: { formId: string } = activity;
  const dispatch = useDispatch();
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const selectForm = useMemo(() => makeSelectForm(), []);

  const form = useSelector((state) => selectForm(state, formId));
  const submissions = useSelector((state) => selectSubmissions(state, formId));

  const scopedObjectIds = useMemo(
    () =>
      form.objectScope ? _.uniq(submissions.map((el) => el.scopedObject)) : [],
    [form, submissions],
  );
  const [teachingObject, setTeachingObject] = useState(
    activity?.jointTeachingObject || null,
  );

  const handleSelectJointTeachObj = (jointTeachingObject): void => {
    const updatedActivity = {
      ...activity,
      jointTeachingObject,
    };

    setTeachingObject(jointTeachingObject);
    dispatch(updateActivity(updatedActivity));
  };

  const handleResetJointTeachObj = () => {
    setTeachingObject(null);
    const updatedActivity = {
      ...activity,
      jointTeachingObject: null,
    };
    dispatch(updateActivity(updatedActivity));
  };

  const hoverContent = 'Click to indicate joint teaching';
  const clickContent = (
    <SelectWithDeleteOption
      header={'Select joint teaching object'}
      selectedValue={teachingObject}
      onSelect={handleSelectJointTeachObj}
      onDelete={handleResetJointTeachObj}
      selectValues={scopedObjectIds}
    />
  );
  const icon = <RiShareBoxFill />;

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
            height: '24px',
            marginLeft: '0.4rem',
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
            marginLeft: '0.4rem',
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
          background: '#e7eff0',
          height: '24px',
          marginLeft: '0.4rem',
        }}
      />
    </>
  );
};

JointTeachingIcon.propTypes = {
  activity: PropTypes.object,
};

export default JointTeachingIcon;
