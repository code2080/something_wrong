import { TActivityTag } from './ActivityTag.type';
import { ISSPReducerState } from './SSP.type';

export interface IState {
  activitiesNew: ISSPReducerState;
  integration: {
    mappedObjectsLabel: any;
    mappedObjectTypes: any;
    mappedFieldsLabel: any;
    reservationModes: any;
  };
  reservationModes: any;
  activityTags: Record<string, TActivityTag[]>;
}
