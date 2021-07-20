import { useState } from 'react';

// COMPONENTS
import ActivityFilterButton from './Button';
import FilterModal from './FilterModal/FilterModal';

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
      <FilterModal isVisible={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ActivityFiltering;
