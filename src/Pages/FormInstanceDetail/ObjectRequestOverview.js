import React from 'react';

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import { Dropdown, Icon, Button, Menu } from 'antd';
import { objectRequestDropdownMenu } from '../../Components/Elements/ObjectRequestValue';

// CONSTANTS
import { tableViews } from '../../Constants/tableViews.constants';

// HELPERS
import { sortAlpha } from '../../Components/TableColumns/Helpers/sorters';

const objReqColumns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => sortAlpha(a.type, b.type)
  },
  {
    title: 'Section',
    dataIndex: 'section',
    key: 'section',
    sorter: (a, b) => sortAlpha(a.type, b.type)
  },
  {
    title: 'Element',
    dataIndex: 'element',
    key: 'element',
  },
  {
    title: 'Request type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a, b) => sortAlpha(a.type, b.type)
  },
  {
    title: 'Extid',
    dataIndex: 'extId',
    key: 'extId',
    sorter: (a, b) => sortAlpha(a.type, b.type)
  },
  {
    title: 'Object type',
    dataIndex: 'datasource',
    key: 'datasource',
    sorter: (a, b) => sortAlpha(a.type, b.type),
  },
  {
    title: 'Edited object',
    dataIndex: 'objectExtId',
    key: 'objectExtId',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: obj => obj || 'N/A',
  },
  {
    title: 'Accepted object',
    dataIndex: 'replacementObjectExtId',
    key: 'replacementObjectExtId',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: obj => obj || 'N/A',
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
      // <Menu
      //   getPopupContainer={() => document.getElementById('te-prefs-lib')}
      //   onClick={({ key }) => {
      //     console.log({ key });
      //   }}
      // >
      //   <Menu.Item key={'world'} >Hello!</Menu.Item>
      // </Menu>}
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
    element: 'Datasource',
    type: 'MISSING',
    status: 'Pending',
    extId: '_te_411',
    datasource: 'room',
  },
  {
    _id: '2',
    section: 'Untitled connected section',
    element: 'Datasource',
    type: 'EDIT',
    status: 'Accepted',
    extId: 'room.nac_her',
    datasource: 'room',
    objectExtId: '_te_editMe',
  },
  {
    _id: '3',
    section: 'Table',
    element: 'Datasource',
    type: 'NEW',
    status: 'Accepted',
    extId: '_te_4511',
    datasource: 'course',
  },
  {
    _id: '4',
    section: 'Regular',
    element: 'Datasource',
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
  // return <div>
  //   <h1>Hello world!</h1>
  //   There are {requests.length} object requests
  //   </div>

};

ObjectRequestOverview.defaultProps = {
  requests: [],
}

export default ObjectRequestOverview;