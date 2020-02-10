import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Table } from 'antd';

// COMPONENTS
import BaseReservationCol from './BaseReservationCol';

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
      render: (_, reservation) => (
        <BaseReservationCol
          reservation={reservation}
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
      render: (_, reservation) => (
        <BaseReservationCol
          reservation={reservation}
          type="VALUE"
          prop={fieldKey}
          mapping={mapping}
        />
      ),
    },
  ], []),
  ...ASTableStaticCols,
];

const convertReservationsToDatasource = reservations => reservations;

const AutomaticSchedulingTable = ({ mapping, reservations }) => {
  const columns = mapping ? createColumnsFromMapping(mapping) : [];
  const dataSource = reservations && reservations.length
    ? convertReservationsToDatasource(reservations)
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
  reservations: PropTypes.array,
};

AutomaticSchedulingTable.defaultProps = {
  mapping: null,
  reservations: [],
};

export default AutomaticSchedulingTable;
