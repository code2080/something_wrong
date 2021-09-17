import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectFilterIsActivated } from 'Redux/Filters/filters.selectors';

// TYPES
import { TActivityFilterQuery } from 'Types/ActivityFilter.type';

// COMPONENTS
import ActivityFilterButton from './Button';
import FilterModal from './FilterModal/FilterModal';

// STYLES
import './index.scss';

interface Props {
  onSubmit: (values) => void;
  selectedFilterValues: TActivityFilterQuery;
}

const ActivityFiltering = ({ onSubmit, selectedFilterValues }: Props) => {
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
        selectedFilterValues={selectedFilterValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ActivityFiltering;
