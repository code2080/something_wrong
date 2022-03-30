// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';

const TagGroupTable = () => {
  return (
    <SSPTable
      columns={[
        {
          title: 'Id',
          key: '_id',
          dataIndex: '_id',
        },
        {
          title: 'Name',
          key: 'tagName',
          dataIndex: 'tagName',
        },
        {
          title: '# activities',
          key: 'noOfActivities',
          dataIndex: 'noOfActivities',
        },
        {
          title: '# activities scheduled',
          key: 'noOfActivitiesScheduled',
          dataIndex: 'noOfActivitiesScheduled',
        },
        {
          title: '# activities failed',
          key: 'noOfActivitiesFailed',
          dataIndex: 'noOfActivitiesFailed',
        },
        {
          title: '# activities unscheduled',
          key: 'noOfActivitiesUnscheduled',
          dataIndex: 'noOfActivitiesUnscheduled',
        },
      ]}
      rowKey='_id'
    />
  );
};

export default TagGroupTable;
