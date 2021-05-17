import VirtualTable from './VirtualTable';

export default {
  title: 'Activity Manager/Components/VirtualTable/Table',
  component: VirtualTable,
  argTypes: {},
};

// Usage
const columns = [
  { title: 'A', dataIndex: 'key', width: 150 },
  { title: 'B', dataIndex: 'key' },
  { title: 'C', dataIndex: 'key' },
  { title: 'D', dataIndex: 'key' },
  { title: 'E', dataIndex: 'key', width: 200 },
  { title: 'F', dataIndex: 'key', width: 100 },
];

const data = Array.from({ length: 100000 }, (_, key) => ({ key }));

export const Table = (args) => {
  return (
    <VirtualTable
      columns={columns}
      dataSource={data}
      scroll={{ y: 300, x: '100vw' }}
      {...args}
    />
  );
};
