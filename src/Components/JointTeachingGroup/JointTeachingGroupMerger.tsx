import { Button, Modal } from 'antd';
import { TActivity } from 'Types/Activity.type';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ActivityTable from 'Pages/FormDetail/pages/ActivityTable';
import { useSelector } from 'react-redux';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
// import JointTeachingGroup from '../../Models/JointTeachingGroup.model';
import { EActivityStatus } from 'Types/ActivityStatus.enum';
import { ActivityValue } from 'Types/ActivityValue.type';
import _ from 'lodash';

type Props = {
  activities: TActivity[];
  formId: string;
};

const JointTeachingGroupMerger = ({ activities = [], formId }: Props) => {
  // const [jointTeachingGroup, setJointTeachingGroup] = useState(
  //   new JointTeachingGroup({
  //     activityIds: activities.map((a) => a._id),
  //   }),
  // );
  const [visible, setVisible] = useState(false);
  const design = useSelector(selectDesignForForm)(formId);

  const mergeActivityValues = (lAV: ActivityValue, rAV: ActivityValue) => {
    if (lAV.value === rAV.value) return lAV.value;
    if (Array.isArray(lAV.value)) {
      return _([...lAV.value, ...((rAV?.value as string[]) ?? [])])
        .uniq()
        .compact()
        .value();
    }
    if (typeof lAV.value === 'string') return `${lAV.value} ${rAV.value}`;
    // TODO: Test the last with filters. Might need to add special logic for categories, daterange and padding
    return { ...(lAV.value as any), ...(rAV.value as any) };
  };

  const canMergectivities =
    activities.length > 1 &&
    !activities.some((act) =>
      ['SCHEDULED', 'QUEUED'].includes(act.activityStatus),
    );

  const mergeActivities = (activities: TActivity[]) =>
    activities.reduce((newActivity, activity) => ({
      ...newActivity,
      ...activity,
      values: newActivity.values.map((val) => {
        const nextValue = activity.values.find((v) => v.extId === val.extId);
        if (!nextValue) return val;
        return {
          ...val,
          value: mergeActivityValues(val, nextValue),
        };
      }),
    }));

  const handleMerge = () => {
    /*
    TODO:
    Validate
    Create group
    Merge activities
    Update old activities status
    Create new activity on BE
    Update group status?
    */
    if (!canMergectivities) return;
    const mergedActivity = _.omit(mergeActivities(activities), [
      '_id',
      'formInstanceId',
    ]);
    const inactivatedActivities = activities.map(
      (act) =>
        ({
          ...act,
          activityStatus: EActivityStatus.INACTIVE,
        } as TActivity),
    );
    console.log(mergedActivity);
    // dispatch updateactivities(inactivatedActivities)
    // dispatch createNewActivity
  };

  return (
    <div>
      <Button
        size='small'
        type='link'
        disabled={activities.length < 2}
        onClick={() => setVisible(true)}
      >
        Create joint teaching group
      </Button>
      <Modal
        width={'80%'}
        title='Create joint teaching group'
        visible={visible}
        footer={[
          <Button key='create' disabled onClick={() => setVisible(false)}>
            Create
          </Button>,
          <Button
            key='merge'
            autoFocus
            disabled={!canMergectivities}
            onClick={() => {
              setVisible(false);
              handleMerge();
            }}
          >
            Create and merge
          </Button>,
          <Button
            key='cancel'
            danger
            type='primary'
            onClick={() => setVisible(false)}
          >
            Cancel
          </Button>,
        ]}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        getContainer={() =>
          document.getElementById('te-prefs-lib') as HTMLElement
        }
      >
        <ActivityTable design={design} activities={activities} />
      </Modal>
    </div>
  );
};

JointTeachingGroupMerger.propTypes = {
  activities: PropTypes.array,
};

export default JointTeachingGroupMerger;
