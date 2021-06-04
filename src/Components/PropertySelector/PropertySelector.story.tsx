import PropSelector from './index';
import _ from 'lodash';
import { useState } from 'react';

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

export const SubmitterExample = (args) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<{
    [property: string]: string[];
  }>({});

  const input = {
    submitter: [
      {
        value: '6093a60ecdb17300258c7ae4',
        label: 'Submitter A',
      },
      {
        value: '6093a60ecdb17300258c7ae5',
        label: 'Submitter B',
      },
    ],
    tag: [
      {
        value: '6093a60ecdb17300258c7235',
        label: 'Tag A',
      },
    ],
    primaryObject: [
      {
        value: 'courseevt_BI1143-40049-VT2021',
        label: 'BI1143-40049',
      },
    ],
  };

  const availProps = Object.keys(input).map((key) => ({
    label: _.startCase(key),
    value: key,
  }));

  const availableSubmitters = selectedProperty
    ? input[selectedProperty as string].filter(
        ({ value }) => !selectedValues[selectedProperty]?.includes(value),
      )
    : [];

  const selectedSubmitters = Object.entries(selectedValues).map(
    ([property, values]) => ({
      ...availProps.find((prop) => prop.value === property),
      children: values.map((val) =>
        input[property].find((v) => v.value === val),
      ),
    }),
  );

  return (
    <div style={{ display: 'flex' }}>
      <PropSelector
        {...args}
        properties={availProps}
        onSelect={(selected) => setSelectedProperty(selected)}
        selectedPropertyValue={selectedProperty}
        emptyText='No filter properties available'
        title='Available properties'
      />
      <PropSelector
        {...args}
        properties={availableSubmitters}
        onSelect={(value) =>
          setSelectedValues({
            ...selectedValues,
            [selectedProperty as string]: [
              ...(selectedValues[selectedProperty as string] ?? []),
              value,
            ],
          })
        }
        emptyText={
          selectedProperty
            ? 'No more values available'
            : 'Select a property to see available filter values'
        }
        title='Available filters'
      />
      <PropSelector
        {...args}
        properties={selectedSubmitters}
        onSelect={(removedValue) => {
          const obj = Object.entries(selectedValues).reduce<any>(
            (newSelected, [property, values]) => ({
              ...newSelected,
              [property]: [
                ...(newSelected[property] || []),
                ...values.filter((val) => val !== removedValue),
              ],
            }),
            {},
          );
          setSelectedValues(obj);
        }}
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

SubmitterExample.args = {};

export const FiltersV2 = (args) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<{
    [property: string]: string[];
  }>({});

  const input = {
    submitter: [
      {
        value: '6093a60ecdb17300258c7ae4',
        label: 'Submitter A',
      },
      {
        value: '6093a60ecdb17300258c7ae5',
        label: 'Submitter B',
      },
    ],
    tag: [
      {
        value: '6093a60ecdb17300258c7235',
        label: 'Tag A',
      },
    ],
    // room: [
    //   {
    //     value: 'room.seats',
    //     label: 'Seats',
    //     children: [
    //       {
    //         value: 25,
    //         label: '25',
    //       },
    //     ],
    //   },
    //   {
    //     value: 'room.campus',
    //     label: 'Campus',
    //     children: [{ value: 'Ultuna', label: 'Ultuna' }],
    //   },

    //   {
    //     value: 'MHusSal2011',
    //     label: 'Sal 2011',
    //   },
    // ],
    // primaryObject: [
    //   {
    //     value: 'courseevt_BI1143-40049-VT2021',
    //     label: 'BI1143-40049',
    //   },
    // ],
    // fields: [
    //   {
    //     value: 'res.comment',
    //     label: 'Comment',
    //     children: [
    //       {
    //         value: 'Ska ha extra nånting',
    //         label: 'Ska ha extra nånting',
    //       },
    //       {
    //         value: 'Ta med egen hund!',
    //         label: 'Ta med egen hund!',
    //       },
    //     ],
    //   },
    //   {
    //     value: 'res.internalComment',
    //     label: 'Internal comment',
    //     children: [
    //       {
    //         value: 'Vill ha en grön projektor',
    //         label: 'Vill ha en grön projektor',
    //       },
    //     ],
    //   },
    //   {
    //     value: 'technical',
    //     label: 'Needs technical support',
    //     children: [
    //       {
    //         value: 'true',
    //         label: 'Yes',
    //       },
    //       {
    //         value: 'false',
    //         label: 'No',
    //       },
    //     ],
    //   },
    // ],
  };

  const availProps = [
    ...Object.keys(input).map((key) => ({
      label: _.startCase(key),
      value: key,
    })),
    ...[
      {
        value: 'objects',
        label: 'Objects',
        children: [
          {
            value: 'primaryObject',
            label: 'Primary object',
          },
          {
            value: 'room',
            label: 'Room',
          },
          {
            value: 'person.teacher',
            label: 'Teacher',
          },
        ],
      },

      {
        value: 'fields',
        label: 'Reservation fields',
        children: [
          {
            value: 'res.comment',
            label: 'Comment',
          },
          {
            value: 'res.internalComment',
            label: 'Internal comment',
          },
          {
            value: 'technical',
            label: 'Needs technical support',
          },
        ],
      },
    ],
  ];

  const availableSubmitters = selectedProperty
    ? input[selectedProperty as string]?.filter(
        ({ value }) => !selectedValues[selectedProperty]?.includes(value),
      ) || []
    : [];

  const selectedSubmitters = Object.entries(selectedValues).map(
    ([property, values]) => ({
      ...availProps.find((prop) => prop.value === property),
      children: values.map((val) =>
        input[property].find((v) => v.value === val),
      ),
    }),
  );

  return (
    <div style={{ display: 'flex' }}>
      <PropSelector
        {...args}
        properties={availProps}
        onSelect={(selected) => setSelectedProperty(selected)}
        selectedPropertyValue={selectedProperty}
        emptyText='No filter properties available'
        title='Available properties'
      />
      <PropSelector
        {...args}
        properties={availableSubmitters}
        onSelect={(value) =>
          setSelectedValues({
            ...selectedValues,
            [selectedProperty as string]: [
              ...(selectedValues[selectedProperty as string] ?? []),
              value,
            ],
          })
        }
        emptyText={
          selectedProperty
            ? 'No more values available'
            : 'Select a property to see available filter values'
        }
        title='Available filters'
      />
      <PropSelector
        {...args}
        properties={selectedSubmitters}
        onSelect={(removedValue) => {
          const obj = Object.entries(selectedValues).reduce<any>(
            (newSelected, [property, values]) => ({
              ...newSelected,
              [property]: [
                ...(newSelected[property] || []),
                ...values.filter((val) => val !== removedValue),
              ],
            }),
            {},
          );
          setSelectedValues(obj);
        }}
        emptyText='No filters selected'
        title='Selected filters'
      />
    </div>
  );
};

FiltersV2.args = {};
