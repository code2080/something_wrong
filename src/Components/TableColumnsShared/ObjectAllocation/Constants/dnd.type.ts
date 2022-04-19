export enum EDraggableTypes {
  OBJECT = 'OBJECT',
}

export interface TDraggedItemProps {
  extId: string;
  fromTrack: string | number;
  type: EDraggableTypes.OBJECT;
  rowId: string;
}
