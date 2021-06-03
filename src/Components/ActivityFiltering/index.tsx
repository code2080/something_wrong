import { useState } from 'react';

// COMPONENTS
import ActivityFilterButton from './Button';
import FilterModal from './FilterModal';

// STYLES
import './index.scss';
import { useParams } from 'react-router-dom';

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
