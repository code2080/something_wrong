import { capitalize, startCase } from 'lodash';
import { reparseKey } from './FilterModal.helper';

const FilterItemLabel = ({
  label,
  render,
}: {
  label: string;
  render?: (label) => string;
}) => {
  const splitted = label.split('.');
  const firstStr = splitted.shift();
  const renderLabel = (label: string) => {
    if (typeof render === 'function') {
      return reparseKey(
        label
          .split('.')
          .map((item) => {
            const labelDisplay = render(item);
            return typeof labelDisplay === 'string' ? labelDisplay : item;
          })
          .join(' > '),
      );
    }
    return reparseKey(label.split('.').join(' > '));
  };

  return (
    <b>
      {capitalize(startCase(renderLabel(firstStr || '')))}
      {splitted.length ? renderLabel(['', ...splitted].join('.')) : null}
    </b>
  );
};

export default FilterItemLabel;
