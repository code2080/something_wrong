import { useDrop } from 'react-dnd';

// COMPONENTS
import AllocationObject from '../AllocationObject';

// STYLES
import './index.scss';

// TYPES
import {
  createEDraggableTypesForRow,
  EDraggableTypes,
  TDraggedItemProps,
} from '../../Constants/dnd.type';

type Props = {
  track: string | number;
  label: string;
  objects: string[];
  rowIndex: number;
  onMoveItem: (
    fromTrack: number | string,
    toTrack: number | string,
    extId: string,
  ) => void;
};

const TrackItem = ({ track, label, objects, rowIndex, onMoveItem }: Props) => {
  const acceptType = createEDraggableTypesForRow(
    EDraggableTypes.OBJECT,
    rowIndex,
  );

  const onDrop = (track: number | string, item: TDraggedItemProps) => {
    onMoveItem(item.fromTrack, track, item.extId);
  };

  const [dropProps, dropRef] = useDrop<TDraggedItemProps, void, any>(
    {
      accept: acceptType,
      drop: (item) => onDrop(track, item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    },

    // [track],
  );

  return (
    <div ref={dropRef} className='object-allocation--item'>
      <div className='object-allocation--item--label'>{label}</div>
      <div className='object-allocation--item--objects'>
        {objects.map((el) => (
          <AllocationObject
            extId={el}
            key={el}
            track={track}
            acceptType={acceptType}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackItem;
