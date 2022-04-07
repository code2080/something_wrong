import { PlusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useState } from 'react';

// COMPONENTS
import ToolbarGroup from '../Components/ToolbarGroup';
import ToolbarButton from '../Components/ToolbarButton';
import CreateObjectsModal from "Components/CreateObjectsModal";

// STYLES
import '../index.scss';

const GroupManagementToolbar = () => {
  /**
   * STATE
   */
  const [showCreateObjectsModal, setShowCreateObjectsModal] = useState(false);

  return (
    <>
      <div className='detail-toolbar--wrapper'>
        <ToolbarGroup label='Actions'>
          <ToolbarButton onClick={() => setShowCreateObjectsModal(true)}>
            <PlusCircleOutlined />
            Create objects
          </ToolbarButton>
          <ToolbarButton>
            <AppstoreAddOutlined />
            Allocate objects
          </ToolbarButton>
        </ToolbarGroup>
      </div>
      <CreateObjectsModal visible={showCreateObjectsModal} onClose={() => setShowCreateObjectsModal(false)} />
    </>
  );
};

export default GroupManagementToolbar;