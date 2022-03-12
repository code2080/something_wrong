import { TActivityTag } from './ActivityTag.type';
import { ISSPReducerState } from './SSP.type';

export interface ISimpleAPIResult {
  results: any[],
  page: number;
  limit: number;
  totalPages: number;
}

export interface ISimpleAPIState {
  loading: boolean;
  hasErrors: boolean;
  results: any[];
  map: Record<string, any>;
}

export interface IState {
  submissions: any;
  forms: any;
  activitiesNew: ISSPReducerState;
  tags: ISimpleAPIState;
  integration: {
    mappedObjectsLabel: any;
    mappedObjectTypes: any;
    mappedFieldsLabel: any;
    reservationModes: any;
  };
  reservationModes: any;
  activityTags: Record<string, TActivityTag[]>;
}
