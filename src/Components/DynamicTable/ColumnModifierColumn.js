import { PlusCircleFilled } from '@ant-design/icons';

export const columnModifierColumn = (onModifyCols) => ({
  title: <PlusCircleFilled style={{ fontSize: '0.8rem' }} />,
  dataIndex: null,
  key: 'modifyColumns',
  width: 40,
  onHeaderCell: () => ({
    onClick: () => onModifyCols(),
  }),
});
