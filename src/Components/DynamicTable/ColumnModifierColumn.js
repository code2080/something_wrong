import React from 'react';
import { Icon } from 'antd';

export const columnModifierColumn = onModifyCols => ({
  title: <Icon type='plus-circle' theme='filled' style={{ fontSize: '0.8rem' }} />,
  dataIndex: null,
  key: 'modifyColumns',
  onHeaderCell: () => ({
    onClick: () => onModifyCols(),
  }),
});
