import { useDrag } from 'react-dnd'
// COMPONENTS
import { ObjectLabel } from "Components/Label";

// STYLES
import './index.scss';

// TYPES
import { EDraggableTypes, TDraggedItemProps } from '../../Constants/dnd.type';

type Props = {
  extId: string;
  track: string | number;
};

const AllocationObject = ({ extId, track }: Props) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type: EDraggableTypes.OBJECT,
    item: { extId, fromTrack: track } as TDraggedItemProps,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className="object-allocation--item--object"
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <ObjectLabel extId={extId} />
    </div>
  );
};

export default AllocationObject;