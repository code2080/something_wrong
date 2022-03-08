// COMPONENTS
import FilterOptions from "../FilterOptions"

// HELPERS
import { toActivityStatusDisplay } from "Components/ActivitySSPFilters/helpers"

// TYPES
import { EActivityStatus } from "Types/ActivityStatus.enum"

type Props = {
  onChange: (updValue: any) => void;
};

const StatusFilterItem = ({ onChange }: Props) => {
  return (
    <FilterOptions
      options={Object.keys(EActivityStatus).map((key) => ({
        label: toActivityStatusDisplay(key),
        value: key,
      }))}
      label='Status'
      onChange={onChange}
    />
  );
};

export default StatusFilterItem;