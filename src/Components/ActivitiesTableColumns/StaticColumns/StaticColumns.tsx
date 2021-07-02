import { sortByElementHtml } from '../../../Utils/sorting.helpers';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SubmissionColumn from './SubmissionColumn';

export const StaticColumns = [
  {
    title: 'Submission',
    key: 'formInstanceId',
    render: (activity) => (
      <SortableTableCell
        className={`formInstanceId_${activity.formInstanceId}`}
      >
        {activity.formInstanceId ? (
          <SubmissionColumn formInstanceId={activity.formInstanceId} />
        ) : (
          <span>Merged activity</span>
        )}
      </SortableTableCell>
    ),
    sorter: (a, b) => {
      return sortByElementHtml(
        `.formInstanceId_${a.formInstanceId}`,
        `.formInstanceId_${b.formInstanceId}`,
      );
    },
  },
];
