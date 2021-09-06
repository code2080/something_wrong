import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFilterIsActivated } from 'Redux/Filters/filters.selectors';

// COMPONENTS
import ActivityFilterButton from './Button';
import FilterModal from './FilterModal/FilterModal';

// STYLES
import './index.scss';

const ActivityFiltering = () => {
  const [showModal, setShowModal] = useState(false);
  const { formId } = useParams<{ formId: string }>();
  const isActivated = useSelector(selectFilterIsActivated(formId));

  return (
    <div className='activity-filtering--wrapper filter-bar__wrapper'>
      <ActivityFilterButton
        onClick={() => setShowModal(!showModal)}
        isActive={showModal}
        hasFilters={isActivated}
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
