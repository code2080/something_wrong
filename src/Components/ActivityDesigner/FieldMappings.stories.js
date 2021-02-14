import React from 'react';
import FieldMapping from './FieldMapping';

export default {
  title: 'PrefsLib2'
};

export const FieldMappings = () => {
  return <FieldMapping onChange={(updatedMapping) => console.log({ updatedMapping })} />;
};
