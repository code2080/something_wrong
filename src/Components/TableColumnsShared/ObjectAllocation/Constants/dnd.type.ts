import { DragObjectWithType } from 'react-dnd';

export enum EDraggableTypes {
  OBJECT = 'OBJECT',
}

export interface TDraggedItemProps extends DragObjectWithType {
  extId: string;
  fromTrack: string | number;
  type: EDraggableTypes.OBJECT;
}
