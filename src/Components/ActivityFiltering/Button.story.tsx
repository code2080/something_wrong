import { useState } from 'react';
import FilterButton from './Button';

export default {
  title: 'Activity Manager/Components/ActivityFiltering/Button',
  component: FilterButton,
  argTypes: {
    onChange: {
      controls: {
        disabled: true,
      },
    },
    isActive: {
      controls: {
        disabled: true,
      },
    },
  },
};

export const Button = (args) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <FilterButton
      {...args}
      isActive={isActive}
      onClick={() => setIsActive(!isActive)}
    />
  );
};

Button.args = {
  isActive: true,
};
