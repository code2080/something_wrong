import { capitalize, startCase } from 'lodash';
import React from 'react';

import { REPLACED_KEY } from './FilterModal.constants';

const FilterItemLabel = ({ label, render }: { label: string, render?: (label) => string }) => {
  const splitted = label.split('.');
  const firstStr = splitted.shift();
  const renderLabel = (label: string) => {
    if (typeof render === 'function') {
      return label.split('.').map(item => {
        const labelDisplay = render(item);
        return typeof labelDisplay === 'string' ? labelDisplay : item;
      }).join(' > ').replaceAll(REPLACED_KEY, '.');
    }
    return label.replaceAll('.', ' > ').replaceAll(REPLACED_KEY, '.');
  }

  return (
    <b>
      {capitalize(startCase(renderLabel(firstStr || '')))}
      {splitted.length ? renderLabel(['', ...splitted].join('.')) : null}
    </b>
  );
};

export default FilterItemLabel;
