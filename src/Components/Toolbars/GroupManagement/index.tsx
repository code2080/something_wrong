import { PlusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Modal, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';
import { useGroupManagement } from 'Hooks/useGroupManagement';

// REDUX
import { selectMappedTypesForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { selectLabelsForTypes } from 'Redux/TE/te.selectors';

// COMPONENTS
import ToolbarGroup from '../Components/ToolbarGroup';
import ToolbarButton from '../Components/ToolbarButton';
import CreateObjectsModal from 'Components/CreateObjectsModal';

// STYLES
import '../index.scss';

const GroupManagementToolbar = () => {
  /**
   * HOOKS
   */
  const { formId } = useParams<{ formId: string }>();
  const { selectedKeys, patchMetadata, metadata, setSelectedKeys } = useSSP();
  const { requestAllocateObjectsByIds: requestAllocateObjects } =
    useGroupManagement();

  /**
   * SELECTORS
   */
  const mappedObjects = useSelector(selectMappedTypesForForm(formId as string));
  const objectLabels = useSelector(selectLabelsForTypes(mappedObjects));

  /**
   * STATE
   */
  const [showCreateObjectsModal, setShowCreateObjectsModal] = useState(false);

  const onAllocateObjects = () => {
    Modal.confirm({
      getContainer: () => document.getElementById('te-prefs-lib') as HTMLElement,
      title: 'Automatically allocate objects',
      content: 'This action will remove all existing objects of the same type from the activities. Do you want to proceed?',
      onOk: () => {
        requestAllocateObjects(selectedKeys);
        setSelectedKeys([]);
      },
    });

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
            value={metadata?.groupTypeExtId}
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
            disabled={!selectedKeys.length || !metadata?.groupTypeExtId}
            onClick={() => setShowCreateObjectsModal(true)}
          >
            <PlusCircleOutlined />
            Create objects
          </ToolbarButton>
          <ToolbarButton
            disabled={!selectedKeys.length || !metadata?.groupTypeExtId}
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
