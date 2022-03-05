import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';

// TYPES
import { TActivityFilterQuery } from 'Types/ActivityFilter.type';

// COMPONENTS
import ToolbarButton from "../ActivitiesToolbar/ToolbarButton";
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

  return (
    <>
      <ToolbarButton
        onClick={() => setShowModal(true)}
        className={'active'}
      >
        <FilterOutlined />
        Filters
      </ToolbarButton>
      <FilterModal
        formId={formId}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        selectedFilterValues={selectedFilterValues}
        onSubmit={onSubmit}
        tableType={tableType}
      />
    </>
  );
};

export default ActivityFiltering;
