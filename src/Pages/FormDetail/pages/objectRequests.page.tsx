import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { capitalize } from 'lodash';

// COMPONENTS
import { Button } from 'antd';
import type { ColumnType } from 'antd/lib/table/interface';
import { MoreOutlined } from '@ant-design/icons';
import DynamicTable from '../../../Components/DynamicTable/DynamicTableHOC';
import ExpandedPane from '../../../Components/TableColumns/Components/ExpandedPane';

import { getSectionsForObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequests.selectors';
import { selectFormObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import { selectSectionDesign } from '../../../Redux/Forms/forms.selectors';
import ObjectRequestValue, {
  ObjectRequestStatusIcon,
  ObjectRequestType,
  ObjectRequestLabel,
} from '../../../Components/Elements/ObjectRequestValue';
import ObjectRequestDropdown from '../../../Components/Elements/DatasourceInner/ObjectRequestDropdown';

// CONSTANTS
import {
  objectRequestTypeToPlainText,
  RequestStatus,
} from '../../../Constants/ObjectRequest.constants';

// UTILS
import LabelRenderer from '../../../Utils/LabelRenderer';
import { ObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequests.types';
import { sortAlpha } from '../../../Components/TableColumns/Helpers/_sorters';

// STYLES
import '../../../Components/TableColumns/Components/ExpandedPane.scss';

const ObjectRequestSection = ({ request }: { request: ObjectRequest }) => {
  const { formId } = useParams<{ formId: string }>();
  const sectionIds: string[] = useSelector(
    getSectionsForObjectRequest(request, formId),
  );
  const firstSection = useSelector((state) =>
    selectSectionDesign(state)(formId, sectionIds?.[0]),
  );
  const sectionName = firstSection ? firstSection.name : 'No section';
  return sectionName;
};

const objReqColumns = (objReqs: ObjectRequest[]): ColumnType<any>[] => [
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    sorter: (a: ObjectRequest, b: ObjectRequest) =>
      sortAlpha(a.status, b.status),
    render: (status: string) => (
      <>
        <ObjectRequestStatusIcon status={status} />
        {capitalize(status || RequestStatus.PENDING)}
      </>
    ),
  },
  {
    title: 'Submission',
    key: 'submitter',
    dataIndex: 'submitter',
    sorter: (a: ObjectRequest, b: ObjectRequest) =>
      sortAlpha(a.submitter, b.submitter),
  },
  {
    title: 'Primary object',
    key: 'scopedObject',
    dataIndex: 'scopedObject',
    sorter: (a: ObjectRequest, b: ObjectRequest) =>
      sortAlpha(a.scopedObject, b.scopedObject),
    render: (primaryObject: string) => {
      const req = objReqs.find((request) => request._id === primaryObject);
      return req ? (
        <ObjectRequestValue request={req} />
      ) : (
        <LabelRenderer extId={primaryObject} type='objects' />
      );
    },
  },
  {
    title: 'Section',
    key: 'section',
    // TODO: Should use better way
    sorter: (a: ObjectRequest, b: ObjectRequest) =>
      sortAlpha(
        ObjectRequestSection({ request: a }),
        ObjectRequestSection({ request: b }),
      ),
    render: (request: ObjectRequest) => (
      <ObjectRequestSection request={request} />
    ),
  },
  {
    title: 'Request type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a: ObjectRequest, b: ObjectRequest) => sortAlpha(a.type, b.type),
    render: (reqType: string) => (
      <>
        <ObjectRequestType type={reqType} />{' '}
        {objectRequestTypeToPlainText[reqType]}
      </>
    ),
  },
  {
    title: 'Type',
    key: 'datasource',
    dataIndex: 'datasource',
    sorter: (a: ObjectRequest, b: ObjectRequest) =>
      sortAlpha(a.datasource, b.datasource),
    render: (typeExtId: string) => (
      <LabelRenderer extId={typeExtId} type='types' />
    ),
  },
  {
    title: 'Extid',
    key: 'extid',
    sorter: (a: ObjectRequest, b: ObjectRequest) =>
      sortAlpha(
        a.replacementObjectExtId || a.objectExtId,
        b.replacementObjectExtId || b.objectExtId,
      ),
    render: (req: ObjectRequest) =>
      req.replacementObjectExtId || req.objectExtId || 'N/A',
  },
  {
    title: 'Object',
    key: 'label',
    sorter: (a: ObjectRequest, b: ObjectRequest) =>
      sortAlpha(a.datasource, b.datasource),
    render: (req: ObjectRequest) => (
      <LabelRenderer
        extId={req.replacementObjectExtId || req.objectExtId}
        type='objects'
      />
    ),
  },
  {
    title: 'Label',
    key: 'actions',
    render: (request: ObjectRequest) => (
      <ObjectRequestDropdown request={request}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <ObjectRequestLabel request={request} onlyShowRequest />
          <Button type='link' size='small'>
            <MoreOutlined />
          </Button>
        </div>
      </ObjectRequestDropdown>
    ),
  },
];

const fieldColumns = (request: ObjectRequest) =>
  Object.entries(request.objectRequest).map(([field, value]) => ({
    title: <LabelRenderer type='fields' extId={field} />,
    key: field,
    render: () => value,
  }));

const ObjectRequestsPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const requests = useSelector(selectFormObjectRequest(formId));
  return (
    <DynamicTable
      columns={objReqColumns(requests)}
      dataSource={requests}
      datasourceId={`OBJREQS_${formId}`}
      rowKey='_id'
      pagination={false}
      expandedRowRender={(request: ObjectRequest) => (
        <ExpandedPane columns={fieldColumns(request)} row={request} />
      )}
    />
  );
};

export default ObjectRequestsPage;
