import React from 'react';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import { Dropdown, Icon, Button } from 'antd';
import { objectRequestDropdownMenu, ObjectRequestLabel } from '../../Components/Elements/ObjectRequestValue';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';

// HELPERS
import { sortAlpha } from '../../Components/TableColumns/Helpers/sorters';
import { capitalizeString } from '../../Utils/string.helpers';

// STATUS, SECTION, REQUEST TYPE, TYPE, EXTID, LABEL, ACTIONS

const objReqColumns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: status =><React.Fragment><ObjectRequestStatusIcon status={status} />{capitalizeString(status || RequestStatus.PENDING)}</React.Fragment>
  },
  {
    title: 'Section',
    dataIndex: 'section',
    key: 'section',
    sorter: (a, b) => sortAlpha(a.type, b.type)
  },
  {
    title: 'Request type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a, b) => sortAlpha(a.type, b.type)
  },
  {
    title: 'Type',
    dataIndex: 'datasource',
    key: 'datasource',
    sorter: (a, b) => sortAlpha(a.type, b.type),
  },
  {
    title: 'Extid',
    key: 'objectExtId',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: req => req.replacementObjectExtId || req.objectExtId || 'N/A'
  },
  {
    title: 'Object',
    key: 'label',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: obj => <ObjectRequestLabel request={{ objectRequest: { hej: 'då' }, room: { name: 'testnaem' } }} /> || 'N/A',
  },
  {
    title: '',
    dataIndex: null,
    key: 'actions',
    fixedWidth: 40,
    render: (_) => (<Dropdown
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      overlay={
        objectRequestDropdownMenu({request: {status: 'pending'}})
      }
      trigger={['click']}
    >
      <Button type="link" size="small">
        <Icon type="more" />
      </Button>
    </Dropdown>)
  },
];

const mockDataSource = [
  {
    _id: '1',
    section: 'Regular',
    type: 'MISSING',
    status: 'Pending',
    extId: '_te_411',
    datasource: 'room',
  },
  {
    _id: '2',
    section: 'Untitled connected section',
    type: 'EDIT',
    status: 'Accepted',
    extId: 'room.nac_her',
    datasource: 'room',
    objectExtId: '_te_editMe',
  },
  {
    _id: '3',
    section: 'Table',
    type: 'NEW',
    status: 'Accepted',
    extId: '_te_4511',
    datasource: 'course',
  },
  {
    _id: '4',
    section: 'Regular',
    type: 'MISSING',
    status: 'Replaced',
    extId: 'courseevt.AVB01294',
    datasource: 'courseevt',
  },
];


const ObjectRequestOverview = ({ formInstanceId, requests }) => { 
  return (<DynamicTable
    columns={objReqColumns}
    dataSource={mockDataSource}
    rowKey="_id"
    pagination={false}
    datasourceId={`${tableViews.OBJECTREQUESTS}-${formInstanceId}`}
  />);
};

ObjectRequestOverview.defaultProps = {
  requests: [],
}

export default ObjectRequestOverview;