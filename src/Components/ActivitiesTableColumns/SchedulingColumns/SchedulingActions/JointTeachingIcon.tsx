/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from 'prop-types';
import { RiShareBoxFill } from 'react-icons/ri';
import { ShrinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import HoverAndClickPopOver from '../../ActivityValueColumns/Helpers/HoverAndClickPopOver';
import SelectWithDeleteOption from '../../ActivityValueColumns/Helpers/SelectWithDeleteOption';
import { useMemo, useState } from 'react';
import { updateActivities } from '../../../../Redux/Activities/activities.actions';
import { makeSelectActivitiesForFormAndIds } from '../../../../Redux/Activities/activities.selectors';

import { useSelector, useDispatch } from 'react-redux';

import { makeSelectForm } from '../../../../Redux/Forms/forms.selectors';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import _ from 'lodash';
import { TActivity } from 'Types/Activity.type';

const JointTeachingIcon = ({ activity, selectedRowKeys }) => {
  if (!activity?.formId) return null;
  const { formId, formInstanceId }: { formId: string; formInstanceId: string } =
    activity;
  const dispatch = useDispatch();
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const selectForm = useMemo(() => makeSelectForm(), []);

  const selectActivitiesForFormAndIds = useMemo(
    () => makeSelectActivitiesForFormAndIds(),
    [],
  );

  const selectedActivitiesInRow: TActivity[] = useSelector((state) =>
    selectActivitiesForFormAndIds(state, {
      formId,
      activityIds: selectedRowKeys,
    }),
  );

  const form = useSelector((state) => selectForm(state, formId));
  const submissions = useSelector((state) => selectSubmissions(state, formId));
  const scopedObjectIds = useMemo(
    () =>
      form.objectScope ? _.uniq(submissions.map((el) => el.scopedObject)) : [],
    [form, submissions],
  );
  const [localTeachingObject, setTeachingObject] = useState(
    activity?.jointTeaching || null,
  );

  const updateSingleObject = (updatedActivities) => {
    dispatch(updateActivities(formId, formInstanceId, [updatedActivities]));
  };

  const updateMultipleObjects = (
    selectedActivitiesInRow,
    jointTeachingObject,
  ) => {
    const updatedActivities = selectedActivitiesInRow.map((activity) => ({
      ...activity,
      jointTeaching: jointTeachingObject,
    }));

    dispatch(updateActivities(formId, formInstanceId, updatedActivities));
  };

  const updateJointTeachingObjects = (jointTeachingObject) => {
    if (
      _.isEmpty(selectedActivitiesInRow) ||
      !_.includes(selectedActivitiesInRow, activity)
    ) {
      updateSingleObject({ ...activity, jointTeaching: jointTeachingObject });
    } else {
      updateMultipleObjects(selectedActivitiesInRow, jointTeachingObject);
    }
  };

  const handleSelectJointTeachObj = (jointTeachingObject): void => {
    setTeachingObject(jointTeachingObject);
    updateJointTeachingObjects(jointTeachingObject);
  };

  const handleResetJointTeachObj = () => {
    setTeachingObject(null);
    updateJointTeachingObjects(null);
  };

  const hoverContent = 'Click to indicate joint teaching';
  const clickContent = (
    <SelectWithDeleteOption
      header={'Select joint teaching object'}
      selectedValue={localTeachingObject}
      onSelect={handleSelectJointTeachObj}
      onDelete={handleResetJointTeachObj}
      selectValues={scopedObjectIds}
    />
  );
  const icon = <RiShareBoxFill />;

  if (localTeachingObject) {
    return (
      <>
        <HoverAndClickPopOver
          hoverContent={localTeachingObject}
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
  selectedRowKeys: PropTypes.array,
};

export default JointTeachingIcon;
