import { useState } from 'react';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ActivityFilterButton from './Button';
import FilterModal from './FilterModal/FilterModal';

// STYLES
import './index.scss';

const ActivityFiltering = () => {
  const [showModal, setShowModal] = useState(false);
  const { formId } = useParams<{ formId: string }>();

  return (
    <div className='activity-filtering--wrapper'>
      <ActivityFilterButton
        onClick={() => setShowModal(!showModal)}
        isActive={showModal}
      />
      <FilterModal
        formId={formId}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ActivityFiltering;
