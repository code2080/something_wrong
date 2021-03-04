import React from 'react';

// TYPES
import { TProperty } from '../../Types/property.type';

type Props = {
  property: TProperty,
};

const HeadingItem = ({ property }: Props) => {
  return (
    <div
      className='property-selector--heading'
    >
      {property.label}
    </div>
  );
};

export default HeadingItem;
