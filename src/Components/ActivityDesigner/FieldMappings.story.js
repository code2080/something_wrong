import React from 'react';
import FieldMapping from './FieldMapping';

export default {
  title: 'Activity Manager Frontend/Components/ActivityDesigner/Field/Mapping',
  component: FieldMapping,
};

export const Mapping = () => {
  return <FieldMapping onChange={(updatedMapping) => console.log({ updatedMapping })} />;
};
