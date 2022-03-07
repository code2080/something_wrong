// GENERATORS
import { GenerateActivityValueColumns } from "./activityValues";
import { GenerateTimingColumns } from "./timing";

// TYPES
import { ActivityDesign } from '../../../../Models/ActivityDesign.model';
import { ISSPColumn } from "Components/SSP/Types";


/**
 * @function createColumnsFromDesign
 * @description generates the necessary table columns for an activity table based on the form's mapping design
 * @param {ActivityDesign} design
 * @returns {ISSPColumn[]}
 */
export const generateColumnsFromDesign = ({ design: _design }: { design: any }): ISSPColumn[] => {
  // Ensure a valid design
  const design = new ActivityDesign(_design || {});

  // Generate activity value columns
  const activityValueColumns = GenerateActivityValueColumns(design);

  // Generate the timing columns
  const timingColumns = GenerateTimingColumns[design.timing.mode](design);

  return [
    ...timingColumns,
    ...activityValueColumns,
  ];
};