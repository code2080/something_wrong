import { useState } from 'react';
import { useParams } from 'react-router-dom';

// SELECTORS
import { useSelector } from 'react-redux';
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
  tableType?: string;
  selectedFilterValues: TActivityFilterQuery;
}

const ActivityFiltering = ({
  onSubmit,
  selectedFilterValues,
  tableType,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { formId } = useParams<{ formId: string }>();
  const isActivated = useSelector(selectFilterIsActivated(formId, tableType));

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
        tableType={tableType}
      />
    </div>
  );
};

export default ActivityFiltering;
