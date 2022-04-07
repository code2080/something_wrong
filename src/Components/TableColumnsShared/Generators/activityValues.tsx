import { useSelector } from 'react-redux';

// REDUX
import { Field, selectIndexedExtIdLabel } from 'Redux/TE/te.selectors';

// COMPONENTS
import ColumnWrapper from 'Components/TableColumnsShared/ActivityValue/ColumnWrapper';

// TYPES
import { ISSPColumn } from 'Components/SSP/Types';
import { TActivity } from 'Types/Activity/Activity.type';

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
      const newCol: ISSPColumn = {
        title: columnTitles[`${field}_${extId}`],
        key: extId,
        render: (activity: TActivity) => (
          <ColumnWrapper
            activity={activity}
            type='values'
            prop={extId}
            mapping={design}
          />
        ),
      };
      return [...allColumns, newCol];
    },
    [],
  );
};

export const GenerateActivityValueColumns = (design: any) => {
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

  return activityValueColumns;
};
