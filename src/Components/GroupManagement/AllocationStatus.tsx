import { Tag } from 'antd';
import React from 'react';
import {
  AllocationStatus as AllocationStatusType,
  allocationStatusMapping,
} from './groupMangement.constants';

interface Props {
  status: AllocationStatusType;
}
const AllocationStatus = ({ status }: Props) => {
  const statusMapping = allocationStatusMapping[status];
  return <Tag color={statusMapping.color}>{statusMapping.label}</Tag>;
};

export default AllocationStatus;
