import { PlusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Select } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// REDUX
import { selectMappedTypesForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { selectLabelsForTypes } from 'Redux/TE/te.selectors';

// COMPONENTS
import ToolbarGroup from '../Components/ToolbarGroup';
import ToolbarButton from '../Components/ToolbarButton';
import CreateObjectsModal from 'Components/CreateObjectsModal';

// STYLES
import '../index.scss';
import { useGroupManagement } from 'Hooks/useGroupManagement';

const GroupManagementToolbar = () => {
  /**
   * HOOKS
   */
  const { formId } = useParams<{ formId: string }>();
  const { selectedKeys, patchMetadata, metadata } = useSSP();
  const { requestAllocateObjectsByIds: requestAllocateObjects } =
    useGroupManagement();

  /**
   * SELECTORS
   */
  const mappedObjects = useSelector(selectMappedTypesForForm(formId));
  const objectLabels = useSelector(selectLabelsForTypes(mappedObjects));

  /**
   * STATE
   */
  const [showCreateObjectsModal, setShowCreateObjectsModal] = useState(false);

  const canAllocateObjects = !isEmpty(selectedKeys);

  const onAllocateObjects = () => {
    requestAllocateObjects(selectedKeys);
  };

  return (
    <>
      <div className='detail-toolbar--wrapper'>
        <ToolbarGroup label='Group type'>
          <Select
            options={mappedObjects.map((value, idx) => ({
              value,
              label: objectLabels[idx],
            }))}
            value={metadata.groupTypeExtId}
            onSelect={(val: string) => patchMetadata('groupTypeExtId', val)}
            style={{ width: '100%', fontSize: '0.75rem' }}
            placeholder='Select an object type'
            size='small'
            allowClear
            onClear={() => patchMetadata('groupTypeExtId', undefined)}
          />
        </ToolbarGroup>
        <ToolbarGroup label='Actions'>
          <ToolbarButton
            disabled={!selectedKeys.length || !metadata.groupTypeExtId}
            onClick={() => setShowCreateObjectsModal(true)}
          >
            <PlusCircleOutlined />
            Create objects
          </ToolbarButton>
          <ToolbarButton
            disabled={!canAllocateObjects}
            onClick={onAllocateObjects}
          >
            <AppstoreAddOutlined />
            Allocate objects
          </ToolbarButton>
        </ToolbarGroup>
      </div>
      <CreateObjectsModal
        visible={showCreateObjectsModal}
        onClose={() => setShowCreateObjectsModal(false)}
      />
    </>
  );
};

export default GroupManagementToolbar;
