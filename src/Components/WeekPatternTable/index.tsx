import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';

// REDUX
import { selectActivityDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

// UTILS
import { generateColumnsFromDesign } from '../TableColumnsShared/Generators';
import { SchedulingStatusGroupedColumn, WeekPatternActivityTypeColumn, WeekPatternWeeksColumn } from 'Components/TableColumnsShared';

// TYPES
// import { ISSPColumn } from 'Components/SSP/Types';

const WeekPatternTable = () => {
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
      columns={[
        { title: "Submitter", dataIndex: 'recipientName' },
        SchedulingStatusGroupedColumn,
        WeekPatternActivityTypeColumn,
        WeekPatternWeeksColumn,
        { title: 'Number of weeks', key: 'weeks', dataIndex: 'weeks', render: (weeks: any[]) => weeks.length },
        { title: "Number of activities", key: 'activityIds', dataIndex: 'activityIds', render: (val) => val.length },
        ...tableColumns,
      ]}
      rowKey='_id'
    />
  );
};

export default WeekPatternTable;
