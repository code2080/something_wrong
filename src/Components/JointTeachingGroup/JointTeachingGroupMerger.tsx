import { Button, Modal } from 'antd';
import { TActivity } from 'Types/Activity.type';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ActivityTable from 'Pages/FormDetail/pages/ActivityTable';
import { useSelector } from 'react-redux';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
// import ActivitiesTable from '../ActivitiesTable/ActivitiesTable';
type Props = {
  activities: TActivity[];
  formId: string;
};

const JointTeachingGroupMerger = ({ activities = [], formId }: Props) => {
  const [visible, setVisible] = useState(false);
  const design = useSelector(selectDesignForForm)(formId);
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
          <Button key='merge' autoFocus onClick={() => setVisible(false)}>
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
