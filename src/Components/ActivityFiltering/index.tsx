import { useState } from 'react';

// COMPONENTS
import ActivityFilterButton from './Button';
import ActivityFilterModal from './Modal';

// STYLES
import './index.scss';

const ActivityFiltering = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='activity-filtering--wrapper'>
      <ActivityFilterButton
        onClick={() => setShowModal(!showModal)}
        isActive={showModal}
      />
      <ActivityFilterModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ActivityFiltering;
