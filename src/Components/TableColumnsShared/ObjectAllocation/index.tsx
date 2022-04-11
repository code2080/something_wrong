import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// REDUX
import { batchOperationValues } from 'Redux/Activities';

// COMPONENTS
import TrackItem from "./Components/TrackItem";

// STYLES
import './index.scss';

// TYPES
import { ActivityValueMode } from 'Constants/activityValueModes.constants';
import { ActivityValueType } from 'Constants/activityValueTypes.constants';
import { EActivityBatchOperation, TActivityBatchOperation, TValuesBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';

type Props = {
  activityIdsPerTrack: string[][];
  connectedObjects: Record<string, string[]>;
  typeExtId: string;
};

const ObjectAllocation = ({ activityIdsPerTrack, connectedObjects, typeExtId }: Props) => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const createRemovalData = (fromTrack: number, typeExtId: string) => {
    const activityIds = activityIdsPerTrack[fromTrack - 1];
    const removalData: TValuesBatchOperation[] = activityIds.map((_id) => ({
      _id,
      extId: typeExtId,
      opsType: 'REMOVE',
    }));
    return removalData;
  };

  const createAllocationData = (toTrack: number, typeExtId: string, objectExtId: string) => {
    const activityIds = activityIdsPerTrack[toTrack - 1];
    const removalData: TValuesBatchOperation[] = activityIds.map((_id) => ({
      _id,
      extId: typeExtId,
      opsType: 'ADD',
      payload: {
        type: ActivityValueType.OBJECT,
        extId: typeExtId,
        submissionValue: undefined,
        submissionValueType: ActivityValueType.OBJECT,
        valueMode: ActivityValueMode.ALLOCATED,
        value: [objectExtId], // @todo need to support maybe not patch but multiple objects...
      },
    }));
    return removalData;
  }

  const onMoveObject = (fromTrack: number | string, toTrack: number | string, extId: string) => {
    const removalData = fromTrack === 'unallocated' ? [] : createRemovalData(fromTrack as number, typeExtId);
    const allocationData = toTrack === 'unallocated' ? [] : createAllocationData(toTrack as number, typeExtId, extId);
    const batchOp: TActivityBatchOperation = {
      type: EActivityBatchOperation.VALUES,
      data: [...removalData, ...allocationData],
    };
    console.log(batchOp);
    dispatch(batchOperationValues(formId as string, batchOp));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="object-allocation--wrapper">
          {Object.keys(connectedObjects)
            .filter((track) => track !== 'unallocated')
            .map((track) => (
              <TrackItem
                key={track}
                track={track}
                label={`Track ${track}`}
                objects={connectedObjects[track]}
                onMoveItem={onMoveObject}
              />
            ))
          }
          <TrackItem
            track="unallocated"
            label="Unallocated"
            objects={connectedObjects.unallocated || []}
            onMoveItem={onMoveObject}
          />
      </div>
    </DndProvider>
  );
};

export default ObjectAllocation;
