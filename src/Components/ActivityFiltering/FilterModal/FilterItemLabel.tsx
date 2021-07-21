import { capitalize, startCase } from 'lodash';
import React from 'react';

import { REPLACED_KEY } from './FilterModal.constants';

const FilterItemLabel = ({ label }: { label: string }) => {
  const splitted = label.split('.');
  const firstStr = splitted.shift();
  const renderLabel = (label: string) => label.replaceAll('.', ' > ').replaceAll(REPLACED_KEY, '.')
  return (
    <b>
      {capitalize(startCase(renderLabel(firstStr || '')))}
      {splitted.length ? (
        renderLabel(['', ...splitted].join('.'))
      ) : null}
    </b>
  );
};

export default FilterItemLabel;
