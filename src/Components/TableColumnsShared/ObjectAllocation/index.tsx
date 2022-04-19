import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// REDUX
import { batchOperationValues } from 'Redux/Activities';

// COMPONENTS
import TrackItem from './Components/TrackItem';

// STYLES
import './index.scss';

// TYPES
import { ActivityValueMode } from 'Constants/activityValueModes.constants';
import { ActivityValueType } from 'Constants/activityValueTypes.constants';
import {
  EActivityBatchOperation,
  TActivityBatchOperation,
  TValuesBatchOperation,
} from 'Types/Activity/ActivityBatchOperations.type';

type Props = {
  activityIdsPerTrack: string[][];
  connectedObjects: Record<string, string[]>;
  typeExtId: string;
  rowIndex: number;
};

const ObjectAllocation = ({
  activityIdsPerTrack,
  connectedObjects,
  typeExtId,
  rowIndex,
}: Props) => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const createRemovalData = (fromTrack: number, typeExtId: string) => {
    const activityIds = activityIdsPerTrack[fromTrack - 1];
    const unsetData: TValuesBatchOperation[] = activityIds.map((_id) => ({
      _id,
      extId: typeExtId,
      opsType: 'UNSET',
    }));
    return unsetData;
  };

  const createAllocationData = (
    toTrack: number,
    typeExtId: string,
    objectExtId: string,
  ) => {
    const activityIds = activityIdsPerTrack[toTrack - 1];
    const setData: TValuesBatchOperation[] = activityIds.map((_id) => ({
      _id,
      extId: typeExtId,
      opsType: 'SET',
      payload: {
        type: ActivityValueType.OBJECT,
        extId: typeExtId,
        submissionValue: undefined,
        submissionValueType: ActivityValueType.OBJECT,
        valueMode: ActivityValueMode.ALLOCATED,
        value: [objectExtId], // @todo need to support maybe not patch but multiple objects...
      },
    }));
    return setData;
  };

  const onMoveObject = (
    fromTrack: number | string,
    toTrack: number | string,
    extId: string,
  ) => {
    const removalData =
      fromTrack === 'unallocated'
        ? []
        : createRemovalData(fromTrack as number, typeExtId);
    const allocationData =
      toTrack === 'unallocated'
        ? []
        : createAllocationData(toTrack as number, typeExtId, extId);
    const batchOp: TActivityBatchOperation = {
      type: EActivityBatchOperation.VALUES,
      data: [...removalData, ...allocationData],
    };
    console.log(batchOp);
    dispatch(batchOperationValues(formId, batchOp));
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
              rowIndex={rowIndex}
            />
          ))}
        <TrackItem
          track='unallocated'
          label='Unallocated'
          objects={connectedObjects.unallocated || []}
          onMoveItem={onMoveObject}
          rowIndex={rowIndex}
        />
      </div>
    </DndProvider>
  );
};

export default ObjectAllocation;
