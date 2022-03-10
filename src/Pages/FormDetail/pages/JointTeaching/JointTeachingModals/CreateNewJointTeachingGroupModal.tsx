import { useEffect, useMemo, useState } from 'react';
import { Modal, ModalProps, Button } from 'antd';
import { flatten, keyBy } from 'lodash';

import JointTeachingActivitiesTable, {
  SelectedConflictValue,
} from 'Components/DEPR_ActivitiesTable/JointTeachingActivitiesTable';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import {
  createJointTeachingGroup,
  createThenMergeJointTeachingGroup,
} from 'Redux/JointTeaching/jointTeaching.actions';

// SELETORS
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';

// TYPES
import {
  CALCULATE_JOINT_TEACHING_MATCHING_SCORE,
  CREATE_JOINT_TEACHING_GROUP,
  CREATE_THEN_MERGE_JOINT_TEACHING_GROUP,
} from 'Redux/JointTeaching/jointTeaching.actionTypes';
import {
  ConflictType,
  JointTeachingConflict,
  JointTeachingConflictResolution,
} from 'Models/JointTeachingGroup.model';

// HELPERS
import { useJointTeachingCalculating } from 'Hooks/jointTeaching';
import { getActivities, getUniqueValues } from 'Utils/activities.helpers';
import { TActivity } from 'Types/Activity.type';
import { FETCH_ACTIVITIES_FOR_FORM } from 'Redux/DEPR_Activities/activities.actionTypes';

interface Props extends Omit<ModalProps, 'onCancel'> {
  activityIds: string[];
  formId: string;
  onCancel: (refetchNeeded?: boolean) => void;
}
const CreateNewJointTeachingGroupModal = (props: Props) => {
  const { visible, onCancel, activityIds, formId } = props;
  const [activities, setActivities] = useState<TActivity[]>([]);

  useEffect(() => {
    let mounted = true;
    if (visible) {
      (async () => {
        const fetchedActivities = await getActivities({ activityIds });
        // Check if mounted to avoid uppdating if component has been unmounted (avoiding memory leaks)
        if (mounted) setActivities(fetchedActivities);
      })();
    }
    return () => {
      mounted = false;
    };
  }, [activityIds, visible]);

  const [canBePaired, setCanBePaired] = useState(false);
  const [selectedValues, setSelectedValues] = useState<JointTeachingConflict[]>(
    [],
  );
  const calculating = useSelector(
    createLoadingSelector([
      CALCULATE_JOINT_TEACHING_MATCHING_SCORE,
      FETCH_ACTIVITIES_FOR_FORM,
    ]),
  );
  const creating = useSelector(
    createLoadingSelector([CREATE_JOINT_TEACHING_GROUP]),
  );
  const merging = useSelector(
    createLoadingSelector([CREATE_THEN_MERGE_JOINT_TEACHING_GROUP]),
  );
  const dispatch = useDispatch();

  const uniqueValues = useMemo(() => {
    return getUniqueValues(activities);
  }, [activities]);

  const canBeMerge = useMemo(() => {
    const indexedValues = keyBy(
      selectedValues,
      (val) => `${val.type}_${val.extId}`,
    );
    return Object.keys(uniqueValues).every((type) => {
      const uniqueValue = uniqueValues[type];
      return Object.keys(uniqueValue)
        .filter((extId) => uniqueValue[extId]?.length > 1)
        .every((extId) => indexedValues[`${type}_${extId}`]);
    });
  }, [uniqueValues, selectedValues]);

  const jointTeachingCalculating = useJointTeachingCalculating({ formId });

  const onSelectValue = (values: SelectedConflictValue) => {
    const updatedValues = Object.entries(values).flatMap(
      ([type, typeValues]) => {
        return Object.entries(typeValues).map(([extId, value]) => {
          return {
            type: type as ConflictType,
            resolution: flatten(value) as JointTeachingConflictResolution,
            extId,
          };
        });
      },
    );
    setSelectedValues(updatedValues);
  };

  useEffect(() => {
    const doCalculating = async () => {
      const canBePaired = await jointTeachingCalculating.activitiesCanBePaired(
        activityIds,
      );
      setCanBePaired(canBePaired);
    };
    if (visible) {
      doCalculating();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, activityIds]);

  const doCreate = async () => {
    await dispatch(
      createJointTeachingGroup({
        formId,
        activityIds: activities.map(({ _id }) => _id),
        conflicts: selectedValues,
      }),
    );
    if (typeof onCancel === 'function') {
      onCancel(true);
    }
  };

  const onCreate = () => {
    jointTeachingCalculating.addActivitiesToJointTeachingMatchRequest({
      canBePaired,
      onSubmit: doCreate,
    });
  };
  const onCreateAndMerge = async () => {
    jointTeachingCalculating.addActivitiesToJointTeachingMatchRequest({
      canBePaired,
      onSubmit: async () => {
        const res = await dispatch(
          createThenMergeJointTeachingGroup({
            formId,
            activityIds: activities.map(({ _id }) => _id),
            conflicts: selectedValues,
          }),
        );
        if (!(res instanceof Error)) {
          onCancel(true);
        }
      },
    });
  };

  return (
    <Modal
      title='Create joint teaching match'
      visible={visible}
      onCancel={() => onCancel()}
      footer={false}
      width={900}
      destroyOnClose
    >
      <JointTeachingActivitiesTable
        selectable={false}
        loading={!!calculating}
        showResult
        formId={formId}
        activities={activities}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onCreate} type='primary' loading={!!creating}>
              Create
            </Button>
            &nbsp;&nbsp;
            <Button
              onClick={onCreateAndMerge}
              type='primary'
              disabled={!canBeMerge}
              loading={!!merging}
            >
              Create and merge
            </Button>
            &nbsp;&nbsp;
            <Button type='default' onClick={() => onCancel()}>
              Cancel
            </Button>
          </div>
        }
        onSelectValue={onSelectValue}
      />
    </Modal>
  );
};

export default CreateNewJointTeachingGroupModal;
