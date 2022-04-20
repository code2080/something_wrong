import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// REDUX
import { batchOperationValues } from 'Redux/Activities';

// COMPONENTS
import TrackItem from './Components/TrackItem';

// UTILS
import { createValuesOperationData } from './utils';

// STYLES
import './index.scss';

// TYPES
import {
  EActivityBatchOperation,
  TActivityBatchOperation,
} from 'Types/Activity/ActivityBatchOperations.type';

type Props = {
  rowId: string;
  activityIdsPerTrack: string[][];
  connectedObjects: Record<string, string[]>;
  typeExtId: string;
};

const ObjectAllocation = ({
  rowId,
  activityIdsPerTrack,
  connectedObjects,
  typeExtId,
}: Props) => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const onMoveObject = (
    fromTrack: number | string,
    toTrack: number | string,
    extId: string,
    fromRowId: string,
  ) => {
    if (
      fromTrack === toTrack || // Can't move to same track
      fromRowId !== rowId || // Can't move to another row
      (connectedObjects[toTrack] || []).includes(extId) // Can't move an object that already exists on the track it's being moved to
    )
      return;

    const removalData =
      fromTrack === 'unallocated'
        ? []
        : createValuesOperationData('REMOVE', activityIdsPerTrack[(fromTrack as number) - 1], typeExtId, extId);
    const allocationData =
      toTrack === 'unallocated'
        ? []
        : createValuesOperationData('ADD', activityIdsPerTrack[(toTrack as number) - 1], typeExtId, extId);
    const batchOp: TActivityBatchOperation = {
      type: EActivityBatchOperation.VALUES,
      data: [...removalData, ...allocationData],
    };
    console.log({ batchOp });
    dispatch(batchOperationValues(formId as string, batchOp));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='object-allocation--wrapper'>
        {Object.keys(connectedObjects)
          .filter((track) => track !== 'unallocated')
          .map((track) => (
            <TrackItem
              key={track}
              track={track}
              label={`Track ${track}`}
              objects={connectedObjects[track]}
              onMoveItem={onMoveObject}
              rowId={rowId}
            />
          ))}
        <TrackItem
          rowId={rowId}
          track='unallocated'
          label='Unallocated'
          objects={connectedObjects.unallocated || []}
          onMoveItem={onMoveObject}
        />
      </div>
    </DndProvider>
  );
};

export default ObjectAllocation;
