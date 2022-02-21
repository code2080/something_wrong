import { createSelector } from 'reselect';
import _ from 'lodash';
import { sortTime } from '../../Components/TableColumns/Helpers/sorters';
import { TFormInstance } from '../../Types/FormInstance.type';

type SubmissionState = {
  [formId: string]: { [formInstanceId: string]: TFormInstance };
};

export const submissionsState = (state): SubmissionState =>
  state.submissions || {};

export const makeSelectSubmissions = (): ((
  state: any,
  formId: string,
) => any) =>
  createSelector(
    submissionsState,
    (_, formId: string) => formId,
    (submissions, formId) => {
      const submissionsForForm = submissions[formId] || {};
      return _.flatMap<TFormInstance>(submissionsForForm).sort(
        (a: any, b: any) => sortTime(a.updatedAt, b.updatedAt),
      );
    },
  );

export const makeSelectFormInstance = () =>
  createSelector(
    submissionsState,
    (_, { formId, formInstanceId }) => ({ formId, formInstanceId }),
    (submissions, { formId, formInstanceId }): TFormInstance => {
      const submissionsForForm = submissions[formId] || {};
      return submissionsForForm[formInstanceId] || {};
    },
  );
