import ObjectLabel from 'Components/ObjectLabel/ObjectLabel';
import React from 'react';
import { TActivity } from 'Types/Activity.type';
import SortableTableCell from '../../DynamicTable/SortableTableCell';

export const JointTeachingColumn = () => [
  {
    title: 'Joint teaching object',
    key: 'activityScheduling',
    dataIndex: undefined,
    width: 240,
    render: (activity: TActivity) => (
      <SortableTableCell
        className={`activityJointTeachingTable_${activity?.jointTeaching?.object}`}
      >
        <ObjectLabel
          objects={[
            { type: 'objects', extId: activity?.jointTeaching?.object },
          ]}
        />
      </SortableTableCell>
    ),
    sorter: true,
  },
  {
    title: 'Primary object',
    key: 'scopedObject',
    width: 250,
    render: (act: TActivity) => {
      return (
        <div>
          <ObjectLabel
            objects={[{ type: 'objects', extId: act.scopedObject }]}
          />
        </div>
      );
    },
    sorter: true,
  },
];
