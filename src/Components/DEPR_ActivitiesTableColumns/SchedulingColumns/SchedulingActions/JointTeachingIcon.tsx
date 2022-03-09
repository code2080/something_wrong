/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from 'prop-types';
import { ShrinkOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

// REDUX
import { selectExtIdLabel } from 'Redux/TE/te.selectors';
import { updateActivities } from '../../../../Redux/Activities/activities.actions';
import { makeSelectActivitiesForFormAndIds } from '../../../../Redux/Activities/activities.selectors';
import { makeSelectForm } from '../../../../Redux/Forms/forms.selectors';
import { makeSelectSubmissions } from '../../../../Redux/FormSubmissions/formSubmissions.selectors';

// COMPONENTS
import TooltipAndPopoverWrapper from 'Components/TooltipAndPopoverWrapper';
import SelectWithDeleteOption from '../../ActivityValueColumns/Helpers/SelectWithDeleteOption';

// STYLES
import './JointTeachingIcon.scss';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';

type Props = {
  activity?: TActivity;
  selectedRowKeys?: string[];
};

const JointTeachingIcon = ({ activity, selectedRowKeys = [] }: Props) => {
  if (!activity?.formId) return null;
  const { formId, formInstanceId } = activity;

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
    (): string[] =>
      form.objectScope ? _.uniq(submissions.map((el) => el.scopedObject)) : [],
    [form, submissions],
  );

  const [localTeachingObject, setTeachingObject] = useState(
    activity?.jointTeaching?.object || null,
  );
  const extIdLabel = useSelector(selectExtIdLabel)(
    'objects',
    localTeachingObject,
  );

  useEffect(() => {
    setTeachingObject(activity?.jointTeaching?.object || null);
  }, [activity.jointTeaching]);

  const updateObjects = (
    selectedActivitiesInRow: TActivity[],
    jointTeachingObject: string | null,
  ) => {
    const updatedActivities = selectedActivitiesInRow.map((activity) => ({
      ...activity,
      jointTeaching: jointTeachingObject
        ? { object: jointTeachingObject }
        : null,
    }));
    dispatch(updateActivities(formId, formInstanceId, updatedActivities));
  };

  const updateJointTeachingObjects = (jointTeachingObject: string | null) => {
    if (_.includes(selectedActivitiesInRow, activity)) {
      updateObjects(selectedActivitiesInRow, jointTeachingObject);
    } else {
      updateObjects([activity], jointTeachingObject);
    }
  };

  const handleSelectJointTeachObj = (jointTeachingObject: string | null) => {
    setTeachingObject(jointTeachingObject);
    updateJointTeachingObjects(jointTeachingObject);
  };

  const handleResetJointTeachObj = () => {
    setTeachingObject(null);
    updateJointTeachingObjects(null);
  };

  const clickContent = (
    <SelectWithDeleteOption
      header={'Select joint teaching object'}
      selectedValue={extIdLabel}
      onSelect={handleSelectJointTeachObj}
      onDelete={handleResetJointTeachObj}
      selectValues={scopedObjectIds}
    />
  );
  const icon = <TeamOutlined />;

  if (activity?.originJointTeachingGroup || activity?.jointTeachingGroupId)
    return (
      <>
        <Popover
          trigger={['hover']}
          content='Activity is a merged joint teaching match'
        >
          <Button
            icon={<ShrinkOutlined />}
            style={{
              border: 'none',
              color: 'darkseagreen',
              background: 'none',
              margin: '0 0.4rem',
            }}
          />
        </Popover>
      </>
    );

  return (
    <TooltipAndPopoverWrapper
      tooltipTitle={
        localTeachingObject
          ? `Joint teaching: ${extIdLabel}` || 'N/A'
          : 'Click to indicate joint teaching'
      }
      disabled={activity.isInactive()}
      buttonIcon={icon}
      buttonClassName={`joint-teaching--btn ${
        localTeachingObject ? 'indicated' : ''
      }`}
    >
      {clickContent}
    </TooltipAndPopoverWrapper>
  );
};

JointTeachingIcon.propTypes = {
  activity: PropTypes.object,
  selectedRowKeys: PropTypes.array,
};

export default JointTeachingIcon;
