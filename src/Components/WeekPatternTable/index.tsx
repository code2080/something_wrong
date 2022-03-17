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

const WeekPatternTable = () => {
  // const { formId } = useParams<{ formId: string }>();

  // /**
  //  * SELECTORS
  //  */
  // const design = useSelector(selectActivityDesignForForm(formId));

  // /**
  //  * COLUMNS
  //  */
  // const tableColumns = generateColumnsFromDesign({ design });

  return (
    <SSPTable
      columns={[
        { title: "Number of activities", dataIndex: 'activityIds', render: (val) => val.length },
        { title: "Submitter", dataIndex: 'recipientName' },
      ]}
      rowKey='_id'
    />
  );
};

export default WeekPatternTable;
