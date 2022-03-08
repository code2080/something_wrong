// COMPONENTS
import FilterOptions from "../FilterOptions"

// HELPERS
import { toActivityStatusDisplay } from "Components/ActivitySSPFilters/helpers"

// TYPES
import { EActivityStatus } from "Types/ActivityStatus.enum"

type Props = {
  onChange: (updValue: any) => void;
  value?: string[];
};

const StatusFilterItem = ({ onChange, value }: Props) => {
  return (
    <FilterOptions
      options={Object.keys(EActivityStatus).map((key) => ({
        label: toActivityStatusDisplay(key),
        value: key,
      }))}
      label='Status'
      onChange={onChange}
      value={value as any}
    />
  );
};

export default StatusFilterItem;