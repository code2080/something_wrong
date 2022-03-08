import { REPLACED_KEY } from 'Components/ActivitySSPFilters/constants';
import { capitalize, startCase } from 'lodash';

const FilterItemLabel = ({
  selectedFilterProperty,
  getLabelForFilterOption,
}: {
  selectedFilterProperty: string;
  getLabelForFilterOption: (filterProperty: string, id?: string) => string;
}) => {
  const keyForLabel = selectedFilterProperty.split(REPLACED_KEY).pop() as string;
  const label = getLabelForFilterOption(keyForLabel);

  return (
    <b>
      {/* {capitalize(startCase(renderLabel(firstStr || '')))}
      {splitted.length ? renderLabel(['', ...splitted].join('.')) : null} */}
      {capitalize(startCase(label))}
    </b>
  );
};

export default FilterItemLabel;
