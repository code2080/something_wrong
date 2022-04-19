import { useDrag } from 'react-dnd';
// COMPONENTS
import { ObjectLabel } from 'Components/Label';

// STYLES
import './index.scss';

// TYPES
import { EDraggableTypes } from '../../Constants/dnd.type';

type Props = {
  rowId: string;
  extId: string;
  track: string | number;
};

const AllocationObject = ({ extId, track, rowId }: Props) => {
  const [dragProps, dragRef] = useDrag({
    type: EDraggableTypes.OBJECT,
    item: { extId, fromTrack: track, rowId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`object-allocation--item--object ${
        track === 'unallocated' ? 'unallocated' : 'allocated'
      }`}
      style={{
        opacity: dragProps.isDragging ? 0.5 : 1,
      }}
    >
      <ObjectLabel extId={extId} />
    </div>
  );
};

export default AllocationObject;
