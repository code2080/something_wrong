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
  submissions: any; // @todo improve
  forms: any; // @todo improve
  activities: ISSPReducerState;
  tags: ISimpleAPIState;
  integration: {
    mappedObjectsLabel: any;
    mappedObjectTypes: any;
    mappedFieldsLabel: any;
    reservationModes: any;
  };
  reservationModes: any; // @todo improve
}
