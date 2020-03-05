import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Table } from 'antd';

// COMPONENTS
import BaseActivityCol from './BaseActivityCol';

// CONSTANTS
import { ASTableStaticCols, ASTableTimingCols } from './ASTableStaticCols';

const createColumnsFromMapping = mapping => [
  ...ASTableTimingCols[mapping.timing.mode](mapping),
  ...(Object.keys(mapping.objects) || []).reduce((objects, objectKey) => [
    ...objects,
    {
      title: objectKey,
      key: objectKey,
      dataIndex: null,
      render: (_, activity) => (
        <BaseActivityCol
          activity={activity}
          type="VALUE"
          prop={objectKey}
          mapping={mapping}
        />
      ),
    },
  ], []),
  ...(Object.keys(mapping.fields) || []).reduce((fields, fieldKey) => [
    ...fields,
    {
      title: fieldKey,
      key: fieldKey,
      dataIndex: null,
      render: (_, activity) => (
        <BaseActivityCol
          activity={activity}
          type="VALUE"
          prop={fieldKey}
          mapping={mapping}
        />
      ),
    },
  ], []),
  ...ASTableStaticCols,
];

const convertActivitiesToDatasource = activities => activities;

const AutomaticSchedulingTable = ({ mapping, activities }) => {
  const columns = mapping ? createColumnsFromMapping(mapping) : [];
  const dataSource = activities && activities.length
    ? convertActivitiesToDatasource(activities)
    : [];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="_id"
    />
  );
};

AutomaticSchedulingTable.propTypes = {
  mapping: PropTypes.object,
  activities: PropTypes.array,
};

AutomaticSchedulingTable.defaultProps = {
  mapping: null,
  activities: [],
};

export default AutomaticSchedulingTable;
