import { Activity as ActivityClass } from '../../te-data-models/src/models';

export class Activity extends ActivityClass {
  updateScopedObject(scopedObject) {
    this.scopedObject = scopedObject;
  }
}
