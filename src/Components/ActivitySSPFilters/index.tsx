import { useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';

// COMPONENTS
import ToolbarButton from '../ActivitiesToolbar/ToolbarButton';
import FilterModal from './Components/Modal';

const ActivityFiltering = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)} className={'active'}>
        <FilterOutlined />
        Filters
      </ToolbarButton>
      <FilterModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ActivityFiltering;
