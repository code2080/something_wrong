import { useDrop } from 'react-dnd';

// COMPONENTS
import AllocationObject from '../AllocationObject';

// STYLES
import './index.scss';

// TYPES
import { EDraggableTypes, TDraggedItemProps } from '../../Constants/dnd.type';
import { useMemo } from 'react';

type Props = {
  rowId: string;
  track: string | number;
  label: string;
  objects: string[];
  onMoveItem: (
    fromTrack: number | string,
    toTrack: number | string,
    extId: string,
    rowId: string,
  ) => void;
};

const TrackItem = ({ rowId, track, label, objects, onMoveItem }: Props) => {
  const onDrop = (track: number | string, item: TDraggedItemProps) => {
    onMoveItem(item.fromTrack, track, item.extId, item.rowId);
  };

  const [dropProps, dropRef] = useDrop<TDraggedItemProps, void, any>(
    {
      accept: EDraggableTypes.OBJECT,
      drop: (item) => onDrop(track, item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        item: monitor.getItem(),
      }),
    },
  );

  const classNames = useMemo(() => {
    if (!dropProps.isOver) return '';
    if (dropProps.item.rowId !== rowId) return 'hover-forbidden';
    if (dropProps.item.fromTrack === track) return 'hover-own';
    if (objects.includes(dropProps.item.extId)) return 'hover-forbidden';
    if (track === 'unallocated') return 'hover-unallocated';
    return 'hover';
  }, [dropProps, track, rowId, objects]);

  return (
    <div ref={dropRef} className={`object-allocation--item ${classNames}`}>
      <div className='object-allocation--item--label'>{label}</div>
      <div className='object-allocation--item--objects'>
        {objects.map((el) => (
          <AllocationObject extId={el} key={el} track={track} rowId={rowId} />
        ))}
      </div>
    </div>
  );
};

export default TrackItem;
