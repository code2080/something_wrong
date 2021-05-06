import { useState } from 'react';
import FieldMapping from './FieldMapping';

export default {
  title: 'Activity Manager/Components/ActivityDesigner/Field/Mapping',
  component: FieldMapping,
  argTypes: {
    mapping: {
      control: false,
    },
    onChange: {
      control: false,
    },
    fieldOptions: {
      control: {
        type: 'object',
      },
    },
    mappingOptions: {
      control: {
        type: 'object',
      },
    },
  },
};
const fieldOptions = [
  { value: 'res.title', label: 'Title' },
  { value: 'res.internalcomment', label: 'Internal comment' },
];
const mappingOptions = (disabled) => [
  { value: 'scopedObject', label: 'Primary object' },
  { value: 'groups', label: 'Groups' },
  { value: 'template', label: 'Activity Template' },
  {
    value: '5f4f4df052717b0020dd1748',
    label: 'Activities section',
    disabled,
    children: [
      {
        value: '5f4f4df052717b0020dd1749',
        label: 'Course activity',
      },
    ],
  },
];

export const Mapping = (args) => {
  const [mapping, setMapping] = useState({});
  return <FieldMapping {...args} onChange={setMapping} mapping={mapping} />;
};

Mapping.args = {
  fieldOptions,
  mappingOptions: mappingOptions(!!Mapping?.args?.disabled),
};
