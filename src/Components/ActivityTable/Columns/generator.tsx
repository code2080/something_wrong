import { useSelector } from 'react-redux';

// COMPONENTS
import ColumnWrapper from 'Components/DEPR_ActivitiesTableColumns/new/ColumnWrapper';

// TYPES
import { ActivityDesign } from '../../../Models/ActivityDesign.model';
import { ISSPColumn } from 'Components/SSP/Types';
import { Field, selectIndexedExtIdLabel } from 'Redux/TE/te.selectors';
import { TActivity } from 'Types/Activity.type';

const getAllActivityValuesFromActivityDesign = (
  design: any,
): [Field, string][] => [
  ...Object.keys(design.objects).map(
    (objKey) => ['types', objKey] as [Field, string],
  ),
  ...Object.keys(design.fields).map(
    (fieldKey) => ['fields', fieldKey] as [Field, string],
  ),
];

const generateActivityValueColumns = (
  activityValues: [Field, string][],
  columnTitles: any,
  design: any,
): ISSPColumn[] => {
  return activityValues.reduce<ISSPColumn[]>(
    (allColumns: ISSPColumn[], [field, extId]) => {
      const newCol = {
        title: columnTitles[`${field}_${extId}`],
        key: extId,
        render: (activity: TActivity) => (
          <ColumnWrapper
            activity={activity}
            type='VALUE'
            prop={extId}
            mapping={design}
          />
        ),
      } as ISSPColumn;
      return [...allColumns, newCol];
    },
    [] as ISSPColumn[],
  );
};

/**
 * @function createColumnsFromDesign
 * @description generates the necessary table columns for an activity table based on the form's mapping design
 * @param {ActivityDesign} design
 * @returns {ISSPColumn[]}
 */
export const CreateColumnsFromDesign = ({
  design: _design,
}: {
  design: any;
}): ISSPColumn[] => {
  // Ensure a valid design
  const design = new ActivityDesign(_design || {});

  // Get all the mapped activity values
  const allActivityValues = getAllActivityValuesFromActivityDesign(design);

  // Fetch the relevant column titles from redux
  const columnTitles = useSelector(selectIndexedExtIdLabel(allActivityValues));

  // Generate the activity value columns
  const activityValueColumns = generateActivityValueColumns(
    allActivityValues,
    columnTitles,
    design,
  );

  // Generate the timing columns

  return [...activityValueColumns];
  // return _.compact([
  //   ,
  //   ...TimingColumns[_design.timing.mode](_design, columnPrefix, renderer),
  //   ...activityValueColumns,
  // ]);
};
