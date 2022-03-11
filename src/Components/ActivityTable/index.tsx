import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';

// REDUX
import { selectActivityDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

// UTILS
import { generateColumnsFromDesign } from './Columns/Generators';

// TYPES
import { ISSPColumn } from 'Components/SSP/Types';

type Props = {
  preCustomColumns?: ISSPColumn[];
  postCustomColumns?: ISSPColumn[];
};

const ActivityTable = ({
  preCustomColumns = [],
  postCustomColumns = [],
}: Props) => {
  const { formId } = useParams<{ formId: string }>();

  /**
   * SELECTORS
   */
  const design = useSelector(selectActivityDesignForForm(formId));

  /**
   * COLUMNS
   */
  const tableColumns = generateColumnsFromDesign({ design });

  return (
    <SSPTable
      columns={[...preCustomColumns, ...tableColumns, ...postCustomColumns]}
      rowKey='_id'
    />
  );
};

export default ActivityTable;
