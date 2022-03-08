// import { IDefaultPaginatedState } from "./SSP.type";
import {TActivityTag} from "./ActivityTag.type"

export interface IState {
  // activitiesNew: IDefaultPaginatedState;
  activitiesNew: any;
  integration: {
    mappedObjectsLabel: any;
    mappedObjectTypes: any;
    mappedFieldsLabel: any;
    reservationModes: any;
  };
  reservationModes: any;
  activityTags: Record<string, TActivityTag[]>;
}