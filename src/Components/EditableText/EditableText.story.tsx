import { InferProps } from 'prop-types';
import { useState } from 'react';
import EditText from './EditableText';

export default {
  title: 'Activity Manager/Components/EditableText',
  component: EditText,
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
};

export const EditableText = (args: InferProps<typeof EditText.propTypes>) => {
  const [value, setValue] = useState<string | null>(null);
  return <EditText {...args} value={value} onChange={setValue} />;
};

EditableText.args = {};
