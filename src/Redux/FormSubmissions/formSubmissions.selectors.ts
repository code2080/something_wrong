import { createSelector } from 'reselect';
import { compact, isEmpty } from 'lodash';
import { TFormInstance } from '../../Types/FormInstance.type';

type SubmissionState = {
  [formId: string]: {
    list: string[];
    mapped: {
      byId: {
        [formInstanceId: string]: TFormInstance;
      };
    };
    total: number;
  };
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
    (submissions, formId): TFormInstance[] => {
      const formSubmissions = submissions[formId];
      if (isEmpty(formSubmissions)) return [];
      return compact(
        (formSubmissions.list || []).map(
          (id) => formSubmissions.mapped.byId[id],
        ),
      );
    },
  );

export const makeSelectFormInstance = () =>
  createSelector(
    submissionsState,
    (_, { formId, formInstanceId }) => ({ formId, formInstanceId }),
    (submissions, { formId, formInstanceId }): TFormInstance => {
      return submissions[formId]?.mapped.byId[formInstanceId] ?? {};
    },
  );

export const selectFormInstance = (formId, formInstanceId) =>
  createSelector(
    submissionsState,
    (submissions) => submissions[formId]?.mapped.byId[formInstanceId] ?? {},
  );

export const selectFormSubmissions = (
  formId: string,
  submissionIds: string[],
) =>
  createSelector(submissionsState, (submissions) => {
    const formSubmissions = submissions[formId];
    if (!formSubmissions) return [];
    return compact(
      submissionIds.map(
        (submissionId) => formSubmissions.mapped?.byId[submissionId],
      ),
    );
  });

export const selectFormSubmissionIds = (formId: string) =>
  createSelector(submissionsState, (submissions) => {
    const formSubmissions = submissions[formId];
    return formSubmissions?.list || [];
  });

export const selectFormSubmissionsTotal = (formId: string) =>
  createSelector(
    submissionsState,
    (submissions) => submissions[formId]?.total ?? 0,
  );

export const selectAllSubmissionsForForm = (formId: string) =>
  createSelector(
    submissionsState,
    (submissions) => submissions[formId]?.mapped?.byId ?? {},
  );

export const selectAllRecipientsFromSubmissionFromForm =
  (formId: string) => (state: any) => {
    const allSubmissions = Object.values(
      state.submissions[formId]?.mapped?.byId || {},
    );
    const allSubmitters = allSubmissions.reduce(
      (tot: Record<string, string>, submission: any) => ({
        ...tot,
        [submission.recipientId]: submission.submitter || 'Unknown submitter',
      }),
      {},
    );

    return allSubmitters;
  };
