import React from 'react';
import IconFormType from './IconFormType';

export default {
  title: 'Activity Manager Frontend/Components/FormType/Icon',
  component: IconFormType,
  argTypes: {
    type: {
      name: 'Form type',
      defaultValue: 'regular',
      description: 'Is the form regular, or availability?',
      type: { name: 'string', required: true },
      table: {
        type: {
          summary: 'enum',
          detail: "'regular' | 'availability'",
        },
        defaultValue: {
          summary: 'regular'
        },
      },
      control: {
        type: 'select',
        options: [
          'regular',
          'availability'
        ]
      }
    }
  }
};

export const Icon = (args) => <IconFormType {...args} />;
