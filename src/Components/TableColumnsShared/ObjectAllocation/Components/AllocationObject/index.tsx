import { useDrag } from 'react-dnd';
// COMPONENTS
import { ObjectLabel } from 'Components/Label';

// STYLES
import './index.scss';

// TYPES
import { EDraggableTypes, TDraggedItemProps } from '../../Constants/dnd.type';

type Props = {
  extId: string;
  track: string | number;
};

const AllocationObject = ({ extId, track }: Props) => {
  /** Todo: Complains about types a lot, come back to this */
  const [dragProps, dragRef] = useDrag({
    // type: EDraggableTypes.OBJECT,
    item: { extId, fromTrack: track, type: EDraggableTypes.OBJECT },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className='object-allocation--item--object'
      style={{
        opacity: dragProps.isDragging ? 0.5 : 1,
      }}
    >
      <ObjectLabel extId={extId} />
    </div>
  );
};

export default AllocationObject;
