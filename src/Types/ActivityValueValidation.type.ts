export interface ActivityValueValidationResult {
  status: string;
  errorCode?: string | null;
  errorMessage?: string | null;
}

export interface ActivityValueValidation {
  activityId: string;
  result: ActivityValueValidationResult;
}
