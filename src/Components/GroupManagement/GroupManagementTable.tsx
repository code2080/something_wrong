import React, { useEffect, useMemo, useState } from 'react';
import { compact, groupBy, isEmpty, keyBy, uniq } from 'lodash';

// COMPONENTS
import DynamicTable from 'Components/DynamicTable/DynamicTableHOC';
import { Table, Button, Tooltip } from 'antd';

// HELPERS
import { determineSectionType } from 'Utils/determineSectionType.helpers';

// CONSTANTS
import { SECTION_CONNECTED } from 'Constants/sectionTypes.constants';

import './GroupManagementTable.scss';
import GroupManagementToolbar from 'Components/GroupManagementToolbar';
import GroupAllocationDesigner from 'Components/GroupAllocationDesigner';
import { useTECoreAPI } from 'Hooks/TECoreApiHooks';
import { IndexedObject } from 'Redux/ObjectRequests/ObjectRequests.types';
import { useDispatch, useSelector } from 'react-redux';
import { selectExtIdLabel } from 'Redux/TE/te.selectors';
import ObjectLabel from 'Components/ObjectLabel/ObjectLabel';
import {
  CheckCircleTwoTone,
  CloseCircleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { getActivities } from 'Utils/activities.helpers';
import { allocateRelatedObjectsToGroups } from './groupManagement.helpers';
import { updateActivities } from 'Redux/Activities/activities.actions';

// UTILS
const getActivityTypeInGroup = (tracks, activityType) => {
  if (isEmpty(tracks) || isEmpty(activityType)) return [];
  const activityTypeElementIdx = tracks[0].values.findIndex(
    (val) => val.elementId === activityType[1],
  );
  return uniq(
    tracks.flatMap((track) => track.values[activityTypeElementIdx]?.value),
  );
};

type SubmissionItemGroup = {
  groupId: string;
  tracks: any[];
  activityTypeValue: string;
  invalid: boolean;
  numberOfGroups?: number;
};
type SubmissionItemType = {
  _id: string;
  status: string;
  submitter: string;
  scopedObject: string;
  activityTypes: any[];
  allValues: any;
  indexedTypes: IndexedObject;
  groups: SubmissionItemGroup[];
  invalid: boolean;
};

interface Props {
  submissions: any;
  form: any;
  design: any;
}

interface SingeSubmissionTableProps {
  record: SubmissionItemType;
  objectScopeLabel: string;
  scopedObject: string;
}
const SingeSubmissionTable = ({
  objectScopeLabel,
  scopedObject,
  record,
}: SingeSubmissionTableProps) => {
  const columns = [
    {
      title: 'Activity type',
      render: (item) => (
        <ObjectLabel
          objects={[{ type: 'objects', extId: item?.activityTypeValue }]}
        />
      ),
    },
    {
      title: objectScopeLabel,
      render: () => (
        <ObjectLabel objects={[{ type: 'objects', extId: scopedObject }]} />
      ),
    },
    {
      title: 'Valid',
      render: (item) =>
        item.invalid ? (
          <Tooltip title='All tracks in group must have same activity type'>
            <CloseCircleOutlined
              style={{ fontSize: 16 }}
              className='text--error'
            />
          </Tooltip>
        ) : (
          <CheckCircleTwoTone style={{ fontSize: 16 }} />
        ),
    },
    {
      title: 'Status',
      render: (item) =>
        item.invalid ? (
          <Tooltip title='All tracks in group must have same activity type'>
            <CloseCircleOutlined
              style={{ fontSize: 16 }}
              className='text--error'
            />
          </Tooltip>
        ) : (
          <CheckCircleTwoTone style={{ fontSize: 16 }} />
        ),
    },
    {
      title: 'Tracks',
      render: (item) => {
        return (
          <Button
            ghost
            size='small'
            type='primary'
            style={{ cursor: 'default' }}
          >
            <ShareAltOutlined />
            &nbsp;
            {(item.tracks || []).length}
          </Button>
        );
      },
      width: 80,
    },
    {
      title: 'Groups',
      render: (item) => item.numberOfGroups,
    },
    {
      title: 'Total activities',
      render: (item) => item.numberOfGroups * item.tracks.length,
    },
  ];
  return (
    <div className='single-submission-table'>
      <Table columns={columns} dataSource={record.groups} pagination={false} />
    </div>
  );
};

const GroupManagementTable = ({ submissions, form, design }: Props) => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const { sections, objectScope, _id: formId } = form;
  const objectScopeLabel = useSelector((state) =>
    selectExtIdLabel(state)('types', objectScope),
  );

  /* STATE VARS */
  const [allocationModalVisible, setAllocationModalVisible] = useState(false);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [allocatingGroupIds, setAllocatingGroupIds] = useState<string[]>([]);
  const [activities, setActivities] = useState({});

  /* EFFECTS */
  useEffect(() => {
    async function execTypes() {
      const _availableTypes = await teCoreAPI.getAllocationTypes();
      setAvailableTypes(
        _availableTypes instanceof Object ? _availableTypes.subtypes : [],
      );
    }
    execTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* MEMO */
  const supportedSectionIds = useMemo(() => {
    return sections
      .filter((section) => determineSectionType(section) === SECTION_CONNECTED)
      .map((section) => section._id);
  }, [sections]);

  const activityType = useMemo(() => {
    return design.additionalFields?.activityType || [];
  }, [design]);

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Submitter',
      dataIndex: 'submitter',
    },
    {
      title: objectScopeLabel,
      dataIndex: 'scopedObject',
    },
    {
      title: 'Activity types',
      dataIndex: 'activityTypes',
      render: (activityTypes) => activityTypes.length,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Button
          onClick={() => {
            setAllocatingGroupIds([record._id]);
            setAllocationModalVisible(true);
          }}
          size='small'
          // disabled={record.invalid}
        >
          Allocate
        </Button>
      ),
    },
  ];

  const dataSource: SubmissionItemType[] = useMemo(() => {
    return submissions.map((submission) => {
      const { submitter, values, scopedObject, _id } = submission;
      const sectionValues = values[activityType[0]] || {};
      const allValues = Object.keys(sectionValues).map((rowId) => {
        return (sectionValues[rowId]?.values || []).find(
          (val) => val.elementId === activityType[1],
        )?.value?.[0];
      });
      const indexedTypes = compact(allValues).reduce((results, item) => {
        if (results[item]) {
          return {
            ...results,
            [item]: {
              ...results[item],
              total: (results[item]?.total || 0) + 1,
            },
          };
        }
        return {
          ...results,
          [item]: {
            total: 1,
            extId: item,
          },
        };
      }, {});

      const groupedValues = groupBy(sectionValues, 'parentId');
      const finalGroups: SubmissionItemGroup[] = Object.entries(
        groupedValues,
      ).map(([parentId, tracks]) => {
        const activityTypeValue = getActivityTypeInGroup(tracks, activityType);
        return {
          groupId: parentId,
          tracks,
          activityTypeValue: (activityTypeValue[0] || '') as string,
          invalid: activityTypeValue.length !== 1,
        };
      });
      const groupedGroups = groupBy(
        finalGroups,
        (group) =>
          `${group.activityTypeValue}_${group.tracks.length}_${group.invalid}`,
      );
      return {
        _id,
        status: 'Allocated',
        submitter: submitter,
        scopedObject,
        activityTypes: Object.entries(indexedTypes).map(([, value]) => value),
        groups: Object.entries(groupedGroups)
          .map(([, groups]) => {
            return {
              ...groups[0],
              numberOfGroups: groups.length,
            };
          })
          .sort((a: SubmissionItemGroup, b: SubmissionItemGroup) =>
            a.activityTypeValue.localeCompare(b.activityTypeValue),
          ),
        allValues,
        indexedTypes,
        invalid: finalGroups.some((group) => group.invalid),
      };
    });
  }, [supportedSectionIds, submissions, activityType]);

  useEffect(() => {
    const doGetActivities = async () => {
      const activities = await getActivities({
        formInstanceIds: dataSource.map(({ _id }) => _id),
      });
      setActivities(groupBy(activities, 'formInstanceId'));
    };
    doGetActivities();
  }, [dataSource.length]);

  /* CALLBACKS */
  const handleSelectAll = () =>
    setSelectedRowKeys(dataSource.map(({ _id }) => _id));
  const onDeselectAll = () => setSelectedRowKeys([]);
  const startAllocatingActivities = () => {
    setAllocatingGroupIds(selectedRowKeys);
    setAllocationModalVisible(true);
  };
  const onDeallocateActivities = () => {
    console.log('onDeallocateActivities', selectedRowKeys);
  };

  const onCloseModal = () => {
    setAllocationModalVisible(false);
    setAllocatingGroupIds([]);
    setSelectedRowKeys([]);
  };

  const getRelatedGroups = async (allocations) => {
    return Promise.all(
      allocations.map(async (allocation, allocationLevel) => {
        const indexedDatasource = keyBy(dataSource, '_id');
        const { selectedGroupType, selectedType } = allocation;
        const relatedGroups: Array<Array<string | undefined | null>> =
          await Promise.all(
            allocatingGroupIds.map(async (formInstanceId) => {
              const submission = indexedDatasource[formInstanceId];
              const allocatingActivities = activities[formInstanceId];
              const objectIds = allocatingActivities.flatMap(({ values }) => {
                return values
                  .filter(
                    (val) => !isEmpty(val.value) && val.extId === selectedType,
                  )
                  .flatMap((val) => val.value);
              });
              const relatedObjects = (await teCoreAPI.getRelatedGroups({
                objectIds: compact(uniq(objectIds)),
                typeId: selectedGroupType,
              })) || [
                'te_1',
                'te_2',
                'te_3',
                'te_4',
                'te_5',
                'te_6',
                'te_7',
                'te_8',
                'te_9',
                'te_10',
              ];

              const allocatedActivities = allocateRelatedObjectsToGroups({
                allocationLevel,
                submission,
                relatedObjects,
              });
              return allocatedActivities;
            }),
          );
        return relatedGroups;
      }),
    );
  };

  const onAllocateActivities = async (allocations) => {
    onCloseModal();
    if (isEmpty(allocations)) return;
    const allocatedTracks = await getRelatedGroups(allocations);
    const mergedAllocations = allocations.reduce(
      (results, allocation, allocationIndex) => {
        const { selectedType } = allocation;
        return {
          ...results,
          [selectedType]: allocatedTracks[allocationIndex],
        };
      },
      {},
    );

    console.log('mergedAllocations >>>', mergedAllocations);
    allocatingGroupIds.forEach((submissionId, idx) => {
      const acts = activities[submissionId];
      const updatedActivities = acts
        .filter((act) =>
          Object.keys(mergedAllocations).some(
            (key) => mergedAllocations[key]?.[idx]?.[act.rowIdx || act.eventId],
          ),
        )
        .map((act) => {
          return {
            ...act,
            values: [
              ...act.values,
              ...Object.keys(mergedAllocations)
                .filter(
                  (selectedType) =>
                    mergedAllocations[selectedType]?.[idx]?.[
                      act.rowIdx || act.eventId
                    ],
                )
                .map((selectedType) => {
                  return {
                    elementId: activityType[1],
                    eventId: act.eventId,
                    extId: selectedType,
                    rowIdx: act.rowIdx,
                    sectionId: activityType[0],
                    submissionValue:
                      mergedAllocations[selectedType]?.[idx]?.[
                        act.rowIdx || act.eventId
                      ],
                    submissionValueType: 'OBJECT',
                    type: 'object',
                    value:
                      mergedAllocations[selectedType]?.[idx]?.[
                        act.rowIdx || act.eventId
                      ],
                    valueMode: 'FROM_SUBMISSION',
                    isAllocated: true,
                  };
                }, []),
            ],
          };
        });
      dispatch(updateActivities(formId, submissionId, updatedActivities));
    });
  };

  return (
    <div>
      <GroupAllocationDesigner
        activityDesign={design}
        visible={allocationModalVisible}
        selectableTypes={availableTypes}
        onAllocateGroups={onAllocateActivities}
        onCancel={onCloseModal}
      />
      <GroupManagementToolbar
        selectedActivityIds={selectedRowKeys}
        onSelectAll={handleSelectAll}
        onDeselectAll={onDeselectAll}
        onAllocateActivities={startAllocatingActivities}
        onDeallocateActivities={onDeallocateActivities}
        allActivities={[]}
      />
      <DynamicTable
        columns={columns}
        dataSource={dataSource}
        rowKey='_id'
        expandedRowRender={(record) => {
          return (
            <SingeSubmissionTable
              objectScopeLabel={objectScopeLabel || objectScope}
              record={record}
              scopedObject={record.scopedObject}
            />
          );
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRows) => setSelectedRowKeys(selectedRows),
        }}
      />
    </div>
  );
};

export default GroupManagementTable;
