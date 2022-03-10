/**
 * @todo
 * REWORK
 */

import { ShrinkOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

// REDUX
import { selectExtIdLabel } from 'Redux/TE/te.selectors';
import { updateActivities } from '../../../../../Redux/DEPR_Activities/activities.actions';
import { makeSelectActivitiesForFormAndIds } from '../../../../../Redux/DEPR_Activities/activities.selectors';
import { makeSelectForm } from '../../../../../Redux/Forms/forms.selectors';
import { makeSelectSubmissions } from '../../../../../Redux/FormSubmissions/formSubmissions.selectors';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// COMPONENTS
import TooltipAndPopoverWrapper from 'Components/TooltipAndPopoverWrapper';
import SelectWithDeleteOption from '../../../../DEPR_ActivitiesTableColumns/ActivityValueColumns/Helpers/SelectWithDeleteOption';

// STYLES
import './index.scss';

// TYPES
import { TActivity } from '../../../../../Types/Activity.type';
import { EActivityStatus } from 'Types/ActivityStatus.enum';

type Props = {
  activity: TActivity;
};

const JointTeachingIcon = ({ activity }: Props) => {
  const { selectedKeys } = useSSP();

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
      activityIds: selectedKeys,
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
      disabled={activity.activityStatus === EActivityStatus.INACTIVE}
      buttonIcon={icon}
      buttonClassName={`joint-teaching--btn ${
        localTeachingObject ? 'indicated' : ''
      }`}
    >
      {clickContent}
    </TooltipAndPopoverWrapper>
  );
};

export default JointTeachingIcon;
