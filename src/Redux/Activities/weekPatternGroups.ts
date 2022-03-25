import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { TWeekPatternGroup } from 'Types/Activity/WeekPatternGroup.type';
import { IState } from 'Types/State.type';

export const weekPatternGroupSelector =
  (wpgId: string) =>
  (state: IState): TWeekPatternGroup | undefined =>
    state.activities.data[EActivityGroupings.WEEK_PATTERN].map[
      wpgId
    ] as unknown as TWeekPatternGroup | undefined;

export const selectActivityTypeForWeekPatternGroup =
  (wpgId: string, formId: string) => (state: IState) => {
    try {
      // Get the form
      const form = state.forms.map[formId];
      // Find the relevant section
      const weekPatternSection = form?.sections.find((section: any) => {
        return !!(
          section.activityTemplatesSettings?.duration &&
          section.activityTemplatesSettings?.datasource &&
          section.activityTemplatesSettings?.weekPicker
        );
      });

      // Get the element id
      const {
        activityTemplatesSettings: { datasource },
      } = weekPatternSection;

      // Now get the week pattern group
      const wpg =
        state.activities.data[EActivityGroupings.WEEK_PATTERN].map[wpgId];

      // Find the activity value
      const activityValue = wpg?.values.find(
        (el) => el.elementId === datasource,
      );

      // Return its value
      return activityValue?.value;
    } catch {
      return undefined;
    }
  };
