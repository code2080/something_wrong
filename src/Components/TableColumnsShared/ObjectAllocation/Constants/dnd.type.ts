import { DragObjectWithType } from 'react-dnd';

export enum EDraggableTypes {
  OBJECT = 'OBJECT',
}

export interface TDraggedItemProps extends DragObjectWithType {
  extId: string;
  fromTrack: string | number;
  /** EDraggableTypes.OBJECT + a number */
  type: string;
}

/** Creates an indetifier that can be used as ID for dragable items that should
 * only be able to be dropped within their row */
export const createEDraggableTypesForRow = (
  type: EDraggableTypes,
  rowIndex: number,
): string => `${type}${rowIndex}`;
