import React, { useEffect, useMemo, useState } from 'react';
import { compact, flatten, groupBy, isEmpty, keyBy, map, uniq } from 'lodash';

// COMPONENTS
import DynamicTable from 'Components/DynamicTable/DynamicTableHOC';
import { Table, Button, Tooltip, Modal, notification } from 'antd';

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
import {
  AllocatedObject,
  allocateRelatedObjectsToGroups,
  hasAllocatedActivity,
} from './groupManagement.helpers';
import { updateActivities } from 'Redux/Activities/activities.actions';
import { TActivity } from 'Types/Activity.type';
import AllocationStatus from './AllocationStatus';

// UTILS
const getActivityTypeInGroup = (activities, activityType) => {
  if (isEmpty(activities) || isEmpty(activityType)) return [];
  const activityTypeElementIdx = activities[0].values.findIndex(
    (val) => val.elementId === activityType[1],
  );
  return uniq(
    activities.flatMap((track) => track.values[activityTypeElementIdx]?.value),
  );
};

type SubmissionItemGroup = {
  groupId: string;
  tracks: any[];
  activities: TActivity[];
  activityTypeValue: string;
  invalid: boolean;
  numberOfGroups?: number;
  isAllocated?: boolean;
};
type SubmissionItemType = {
  _id: string;
  status: number;
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
        item.isAllocated ? (
          <CheckCircleTwoTone style={{ fontSize: 16 }} />
        ) : (
          <CloseCircleOutlined
            style={{ fontSize: 16 }}
            className='text--error'
          />
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
            {(item.activities || []).length}
          </Button>
        );
      },
      width: 80,
    },
    {
      title: 'Total activities',
      render: (item) => item.numberOfGroups * item.activities.length,
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
  const [loading, setLoading] = useState(false);

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

  const dataSource: SubmissionItemType[] = useMemo(() => {
    return submissions.map((submission) => {
      const { submitter, values, scopedObject, _id } = submission;
      const acts = activities[_id] || [];
      const indexedActs = keyBy(acts, (act) => act.rowIdx || act.eventId);
      const sectionValues = values[activityType[0]] || {};
      const allValues: string[] = acts.flatMap((act) => {
        return (
          act.values
            // Filter out allocated value
            .filter(({ isAllocated }) => !isAllocated)
            // Filter out empty value and only keep activityType value
            .filter(
              ({ elementId, value }) =>
                elementId === activityType[1] && !isEmpty(value),
            )
            .map(({ value }) => (Array.isArray(value) ? value[0] : value))
        );
      });

      const indexedTypes = compact(allValues).reduce(
        (results, item: string) => {
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
        },
        {},
      );

      const groupedValues = groupBy(
        map(sectionValues, (item) => ({
          ...item,
          parentId: item.parentId || item.id,
        })),
        'parentId',
      );
      const allGroups: SubmissionItemGroup[] = Object.entries(
        groupedValues,
      ).map(([parentId, tracks]) => {
        const activities = compact(tracks.map(({ id }) => indexedActs[id]));
        const activityTypeValue = getActivityTypeInGroup(
          activities,
          activityType,
        );
        return {
          groupId: parentId,
          tracks,
          activities,
          isAllocated: hasAllocatedActivity(activities),
          activityTypeValue: (activityTypeValue[0] || '') as string,
          invalid: activityTypeValue.length !== 1,
        };
      });

      const groupedGroups = groupBy(
        allGroups,
        (group) =>
          `${group.activityTypeValue}_${group.activities.length}_${group.invalid}`,
      );
      const finalGroups = Object.entries(groupedGroups)
        .map(([, groups]) => {
          return {
            ...groups[0],
            numberOfGroups: groups.length,
          };
        })
        .sort((a: SubmissionItemGroup, b: SubmissionItemGroup) =>
          a.activityTypeValue.localeCompare(b.activityTypeValue),
        );

      const allocatedGroups = finalGroups.filter((group) => group.isAllocated);
      const allocationStatus =
        allocatedGroups.length === 0
          ? 0
          : allocatedGroups.length === finalGroups.length
          ? 1
          : -1;
      return {
        _id,
        status: allocationStatus,
        submitter: submitter,
        scopedObject,
        activityTypes: Object.keys(indexedTypes),
        groups: finalGroups,
        allValues,
        indexedTypes,
        invalid: allGroups.some((group) => group.invalid),
      };
    });
  }, [supportedSectionIds, submissions, activityType, activities]);

  const doGetActivities = async (formInstanceIds: string[]) => {
    setLoading(true);
    const _acts = await getActivities({
      formInstanceIds,
    });
    setActivities({ ...activities, ...groupBy(_acts, 'formInstanceId') });
    setLoading(false);
  };
  useEffect(() => {
    doGetActivities(dataSource.map(({ _id }) => _id));
  }, [dataSource.length]);

  /* CALLBACKS */
  const handleSelectAll = () =>
    setSelectedRowKeys(dataSource.map(({ _id }) => _id));
  const onDeselectAll = () => setSelectedRowKeys([]);
  const startAllocatingActivities = () => {
    setAllocatingGroupIds(selectedRowKeys);
    setAllocationModalVisible(true);
  };
  const onDeallocateActivities = async (submissions: SubmissionItemType[]) => {
    Modal.confirm({
      getContainer: () =>
        document.getElementById('te-prefs-lib') || document.body,
      title: 'Deallocate activities',
      content: 'Are you sure you want to deallocate these activities?',
      onOk: async () => {
        setLoading(true);
        // Remove activity value which has isAllocated === true
        await Promise.all(
          submissions.map((submission) => {
            const updatedActivities = submission.groups.flatMap((group) =>
              group.activities.map((act) => ({
                ...act,
                values: act.values.filter((val) => !val.isAllocated),
              })),
            );
            return dispatch(
              updateActivities(formId, submission._id, updatedActivities),
            );
          }),
        );
        doGetActivities(submissions.map(({ _id }) => _id));
        onDeselectAll();
      },
    });
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
        const relatedGroups: AllocatedObject[] = await Promise.all(
          allocatingGroupIds.map(async (formInstanceId) => {
            const submission = indexedDatasource[formInstanceId];
            const allocatingActivities = activities[formInstanceId];
            const objectIds = allocatingActivities.flatMap(({ values }) => {
              return values
                .filter(
                  (val) =>
                    !isEmpty(val.value) && val.extId === selectedGroupType,
                )
                .flatMap((val) => val.value);
            });
            const _relatedGroups = await teCoreAPI.getRelatedGroups({
              // The result is not a flat array
              objectIds: compact(uniq(objectIds)), // But rather an object with a key per objectIds
              typeId: selectedType, // {objectId1: ['te_1', 'te_2', ...], objectId2: []}
            });
            // Keep this logger for awhile
            console.log('_relatedGroups >>>', _relatedGroups);
            const relatedObjects = flatten(Object.values(_relatedGroups || {}));
            if (isEmpty(relatedObjects)) {
              notification.error({
                getContainer: () =>
                  document.getElementById('te-prefs-lib') as HTMLElement,
                message: 'There is no related objects',
              });
            }
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
    setLoading(true);
    const allocatedTracks = await getRelatedGroups(allocations);

    const mergedAllocations: AllocatedObject = allocations.reduce(
      (results, allocation, allocationIndex) => {
        const { selectedType } = allocation;
        return {
          ...results,
          [selectedType]: allocatedTracks[allocationIndex],
        };
      },
      {},
    );
    const updateActivitiesRes = await Promise.all(
      allocatingGroupIds.map((submissionId, idx) => {
        const acts = activities[submissionId];
        const updatedActivities = acts
          .filter((act) =>
            Object.keys(mergedAllocations).some(
              (key) =>
                mergedAllocations[key]?.[idx]?.[act.rowIdx || act.eventId],
            ),
          )
          .map((act) => {
            return {
              ...act,
              values: [
                ...act.values,
                // Add new activity value
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
        if (!isEmpty(updatedActivities)) {
          return dispatch(
            updateActivities(formId, submissionId, updatedActivities),
          );
        }
        return null;
      }),
    );
    setLoading(false);
    if (updateActivitiesRes.some((item) => item)) {
      doGetActivities(allocatingGroupIds);
    }
  };

  const actionColumnRenderer = (record: SubmissionItemType) => {
    if (record.status !== 0) {
      return (
        <Button
          onClick={() => {
            onDeallocateActivities([record]);
          }}
          size='small'
        >
          Deallocate
        </Button>
      );
    }
    let errorMessage: string = '';
    if (!record.activityTypes.length)
      errorMessage = 'There is on activity types';
    else if (record.invalid)
      errorMessage = 'All tracks in group must have same activity type';
    if (errorMessage)
      return (
        <Button size='small' disabled={!!errorMessage}>
          Allocate
        </Button>
      );
    return (
      <Button
        size='small'
        disabled={!!errorMessage}
        onClick={() => {
          setAllocatingGroupIds([record._id]);
          setAllocationModalVisible(true);
        }}
      >
        Allocate
      </Button>
    );
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <AllocationStatus status={status} />,
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
      render: actionColumnRenderer,
    },
  ];

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
        onDeallocateActivities={() =>
          onDeallocateActivities(
            dataSource.filter((item) => selectedRowKeys.includes(item._id)),
          )
        }
        allActivities={[]}
      />
      <DynamicTable
        className='group-management-table'
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey='_id'
        expandedRowRender={(record: SubmissionItemType) => {
          if (!record.activityTypes.length) return null;
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
          getCheckboxProps: (record: SubmissionItemType) => ({
            disabled: record.invalid || !record.activityTypes.length,
          }),
        }}
        onRow={(record: SubmissionItemType) => ({
          className: !record.activityTypes.length ? 'empty' : '',
        })}
      />
    </div>
  );
};

export default GroupManagementTable;
