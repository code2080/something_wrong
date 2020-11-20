import React from 'react';
import { Icon } from 'antd';

export const columnModifierColumn = onModifyCols => ({
  title: <Icon type="plus-circle" theme="filled" style={{ fontSize: '0.8rem' }} />,
  dataIndex: null,
  fixedWidth: 34,
  width: 34,
  key: 'modifyColumns',
  onHeaderCell: col => ({
    onClick: () => onModifyCols(),
  }),
});
