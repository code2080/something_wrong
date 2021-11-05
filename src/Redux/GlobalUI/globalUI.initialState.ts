import { EFormDetailTabs } from '../../Types/FormDetailTabs.enum';

export default {
  breadcrumbs: [] as any,
  spotlightPositionInfo: null as any,
  tableViews: {} as any,
  openedModals: {
    formInstanceSchedulingProcess: null as any,
  },
  selectedFormDetailTab: EFormDetailTabs.SUBMISSIONS,
  selectedFormDetailSubmission: null as any,
  tabHistory: [] as any,
  activitySorting: {} as any,
  paginationParams: { page: 1, limit: 10, totalPages: 1 } as {
    page: Number;
    limit: Number;
    totalPages?: Number;
  },
  jointTeaching: [] as any,
  selectedActivities: {},
};
