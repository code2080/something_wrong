import moment from 'moment';

// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';
import { JobStatusColumn, StopJobColumn } from 'Components/TableColumnsShared';

// CONSTANTS
import { DATE_TIME_FORMAT } from 'Constants/common.constants';

const JobsTable = () => {
  return (
    <SSPTable
      columns={[
        {
          title: 'Job Id',
          key: '_id',
          dataIndex: '_id',
          width: 200,
        },
        JobStatusColumn,
        StopJobColumn,
        {
          title: '# activities',
          key: 'noOfActivities',
          dataIndex: 'noOfActivities',
        },
        {
          title: 'Date',
          key: 'createdAt',
          dataIndex: 'createdAt',
          render: (val: string) => moment.utc(val).format(DATE_TIME_FORMAT),
        },
        {
          title: 'Constraint profile',
          key: 'constraintConfigurationName',
          dataIndex: 'constraintConfigurationName',
        },
      ]}
      allowRowSelection={false}
      rowKey='_id'
    />
  );
};

export default JobsTable;
