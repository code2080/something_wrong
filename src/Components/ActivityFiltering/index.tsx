import { useMemo, useState } from 'react';

// COMPONENTS
import ActivityFilterButton from './Button';
import FilterModal from './FilterModal';

// STYLES
import './index.scss';
import { makeSelectFormLookupMap } from '../../Redux/Filters/filters.selectors';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ActivityFiltering = () => {
  const [showModal, setShowModal] = useState(false);
  const selectFormLookupMap = useMemo(() => makeSelectFormLookupMap(), []);
  const { formId } = useParams<{ formId: string }>();
  const filterData = useSelector((state) => selectFormLookupMap(state, formId));

  return (
    <div className='activity-filtering--wrapper'>
      <ActivityFilterButton
        onClick={() => setShowModal(!showModal)}
        isActive={showModal}
      />
      <FilterModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        filterLookupMap={filterData}
      />
    </div>
  );
};

export default ActivityFiltering;
