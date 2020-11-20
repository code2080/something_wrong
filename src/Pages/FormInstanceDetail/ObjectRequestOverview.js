import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

// COMPONENTS
import DynamicTable from '../../Components/DynamicTable/DynamicTableHOC';
import { Icon, Button } from 'antd';
import { ObjectRequestStatusIcon, ObjectRequestType, ObjectRequestLabel } from '../../Components/Elements/ObjectRequestValue';
import { Table } from 'antd';
import ExpandedPane from '../../Components/TableColumns/Components/ExpandedPane';
import { LabelRenderer } from '../../Utils/rendering.helpers';
import ObjectRequestDropdown from '../../Components/Elements/DatasourceInner/ObjectRequestDropdown';

// CONSTANTS
import { objectRequestTypeToPlainText } from '../../Constants/ObjectRequest.constants';
import { tableViews } from '../../Constants/tableViews.constants';

// HELPERS
import { sortAlpha } from '../../Components/TableColumns/Helpers/sorters';
import { capitalizeString } from '../../Utils/string.helpers';

// SELECTORS
import { getSectionsForObjectRequest } from '../../Redux/ObjectRequests/ObjectRequests.selectors';
import { selectSectionDesign } from '../../Redux/Forms/forms.selectors';

// STYLES
import '../../Components/TableColumns/Components/ExpandedPane.scss';

const ObjectRequestSection = ({ request }) => {
  const { formId } = useParams();
  const sectionIds = useSelector(getSectionsForObjectRequest(request));
  const firstSection = sectionIds.length > 0 && useSelector(state => selectSectionDesign(state)(formId, sectionIds[0]));
  const sectionName = firstSection
    ? firstSection.name
    : 'No section';
  return sectionName;
}

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
    key: 'section',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: request => <ObjectRequestSection request={request} />
  },
  {
    title: 'Request type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: reqType => <React.Fragment><ObjectRequestType type={reqType} /> {objectRequestTypeToPlainText[reqType]}</React.Fragment>
  },
  {
    title: 'Type',
    dataIndex: 'datasource',
    key: 'datasource',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: typeExtId => <LabelRenderer extId={typeExtId} type='types' />
  },
  {
    title: 'Extid',
    key: 'extid',
    sorter: (a, b) => sortAlpha(a.type, b.type),
    render: req => req.replacementObjectExtId || req.objectExtId || 'N/A'
  },
  {
    title: 'Object',
    key: 'label',
    sorter: (a, b) => sortAlpha(a, b),
    render: req => <LabelRenderer extId={req.replacementObjectExtId || req.objectExtId} type='objects' />
  },

  {
    title: 'Label',
    dataIndex: null,
    key: 'actions',
    render: request => (
      <ObjectRequestDropdown request={request} >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }} >
          <ObjectRequestLabel request={request} />
          <Button type="link" size="small">
            <Icon type="more" />
          </Button>
        </div>
      </ObjectRequestDropdown>
    )
  },
];

const fieldColumns = request => Object.entries(request.objectRequest).map(([field, value]) => ({
  title: <LabelRenderer type='fields' extId={field} />,
  key: field,
  render: () => value,
}));

const ObjectRequestOverview = ({ formInstanceId, requests }) => { 
  return (<DynamicTable
    resizable
    columns={objReqColumns}
    dataSource={requests}
    showFilter={false}
    rowKey="_id"
    pagination={false}
    expandedRowRender={request => <ExpandedPane columns={fieldColumns(request)} row={request} />}
    datasourceId={`${tableViews.OBJECTREQUESTS}-${formInstanceId}`}
  />);
};

ObjectRequestOverview.defaultProps = {
  requests: [],
}

export default ObjectRequestOverview;