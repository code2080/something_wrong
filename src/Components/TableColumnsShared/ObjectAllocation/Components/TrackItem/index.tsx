import { useDrop } from 'react-dnd'

// COMPONENTS
import AllocationObject from "../AllocationObject";

// STYLES
import './index.scss';

// TYPES
import { EDraggableTypes, TDraggedItemProps } from '../../Constants/dnd.type';

type Props = {
  track: string | number;
  label: string;
  objects: string[];
  onMoveItem: (fromTrack: number | string, toTrack: number | string, extId: string) => void;
};

const TrackItem = ({ track, label, objects, onMoveItem }: Props) => {

  const onDrop = (track: number | string, item: TDraggedItemProps) => {
    onMoveItem(item.fromTrack, track, item.extId);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: EDraggableTypes.OBJECT,
    drop: (item) => onDrop(track, item as TDraggedItemProps),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [track]);

  return (
    <div ref={drop} className="object-allocation--item">
      <div className="object-allocation--item--label">
        {label}
      </div>
      <div className="object-allocation--item--objects">
        {objects.map((el) => <AllocationObject extId={el} key={el} track={track} />)}
      </div>
    </div>
  );
};

export default TrackItem;