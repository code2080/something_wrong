import PropSelector from './index';

export default {
  title: 'Activity Manager/Components/PropertySelector',
  component: PropSelector,
  argTypes: {},
};

export const PropertySelector = (args) => {
  const availableProps = [
    {
      value: 'tag',
      label: 'Tag',
    },
    {
      value: 'submitter',
      label: 'Submitter',
    },
    {
      value: 'primaryObject',
      label: 'Primary Object',
    },
  ];
  const availableValues = [
    {
      value: 'OD101',
      label: 'Odling i lådbil 101',
    },
    {
      value: 'C-M2011',
      label: 'Bästa kursen i stan',
    },
  ];

  const selectedValues = [
    {
      value: 'primaryObject',
      label: 'Primary Object',
      children: [
        {
          value: 'C-M2022',
          label: 'Sämsta kursen i stan',
        },
      ],
    },
  ];
  return (
    <div style={{ display: 'flex' }}>
      <PropSelector
        {...args}
        properties={availableProps}
        // onSelect={onSelectProperty}
        selectedPropertyValue={args.selectedProperty}
        emptyText='No filter properties available'
        title='Available properties'
      />
      <PropSelector
        {...args}
        properties={availableValues}
        // onSelect={onAddFilterValue}
        emptyText={
          args.selectedProperty
            ? 'No more values available'
            : 'Select a property to see available filter values'
        }
        title='Available filters'
      />
      <PropSelector
        {...args}
        properties={selectedValues}
        // onSelect={onRemoveFilterValue}
        emptyText='No filters selected'
        title='Selected filters'
      />
    </div>
  );
};

PropertySelector.args = {
  onSelect: (val) => console.log(val),
  emptyText: 'No more values available',
  selectedProperty: 'primaryObject',
};
