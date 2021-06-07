import PropSelector from './index';
import _ from 'lodash';
import { useState } from 'react';

export default {
  title: 'Activity Manager/Components/PropertySelector',
  component: PropSelector,
  argTypes: {},
};

// export const PropertySelector = (args) => {
//   const availableProps = [
//     {
//       value: 'tag',
//       label: 'Tag',
//     },
//     {
//       value: 'submitter',
//       label: 'Submitter',
//     },
//     {
//       value: 'primaryObject',
//       label: 'Primary Object',
//     },
//   ];
//   const availableValues = [
//     {
//       value: 'OD101',
//       label: 'Odling i lådbil 101',
//     },
//     {
//       value: 'C-M2011',
//       label: 'Bästa kursen i stan',
//     },
//   ];

//   const selectedValues = [
//     {
//       value: 'primaryObject',
//       label: 'Primary Object',
//       children: [
//         {
//           value: 'C-M2022',
//           label: 'Sämsta kursen i stan',
//         },
//       ],
//     },
//   ];
//   return (
//     <div style={{ display: 'flex' }}>
//       <PropSelector
//         {...args}
//         properties={availableProps}
//         // onSelect={onSelectProperty}
//         selectedPropertyValue={args.selectedProperty}
//         emptyText='No filter properties available'
//         title='Available properties'
//       />
//       <PropSelector
//         {...args}
//         properties={availableValues}
//         // onSelect={onAddFilterValue}
//         emptyText={
//           args.selectedProperty
//             ? 'No more values available'
//             : 'Select a property to see available filter values'
//         }
//         title='Available filters'
//       />
//       <PropSelector
//         {...args}
//         properties={selectedValues}
//         // onSelect={onRemoveFilterValue}
//         emptyText='No filters selected'
//         title='Selected filters'
//       />
//     </div>
//   );
// };

// export const SubmitterExample = (args) => {
//   const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
//   const [selectedValues, setSelectedValues] = useState<{
//     [property: string]: string[];
//   }>({});

//   const input = {
//     submitter: [
//       {
//         value: '6093a60ecdb17300258c7ae4',
//         label: 'Submitter A',
//       },
//       {
//         value: '6093a60ecdb17300258c7ae5',
//         label: 'Submitter B',
//       },
//     ],
//     tag: [
//       {
//         value: '6093a60ecdb17300258c7235',
//         label: 'Tag A',
//       },
//     ],
//     primaryObject: [
//       {
//         value: 'courseevt_BI1143-40049-VT2021',
//         label: 'BI1143-40049',
//       },
//     ],
//   };

//   const availProps = Object.keys(input).map((key) => ({
//     label: _.startCase(key),
//     value: key,
//   }));

//   const availableSubmitters = selectedProperty
//     ? input[selectedProperty as string].filter(
//         ({ value }) => !selectedValues[selectedProperty]?.includes(value),
//       )
//     : [];

//   const selectedSubmitters = Object.entries(selectedValues).map(
//     ([property, values]) => ({
//       ...availProps.find((prop) => prop.value === property),
//       children: values.map((val) =>
//         input[property].find((v) => v.value === val),
//       ),
//     }),
//   );

//   return (
//     <div style={{ display: 'flex' }}>
//       <PropSelector
//         {...args}
//         properties={availProps}
//         onSelect={(selected) => setSelectedProperty(selected)}
//         selectedPropertyValue={selectedProperty}
//         emptyText='No filter properties available'
//         title='Available properties'
//       />
//       <PropSelector
//         {...args}
//         properties={availableSubmitters}
//         onSelect={(value) =>
//           setSelectedValues({
//             ...selectedValues,
//             [selectedProperty as string]: [
//               ...(selectedValues[selectedProperty as string] ?? []),
//               value,
//             ],
//           })
//         }
//         emptyText={
//           selectedProperty
//             ? 'No more values available'
//             : 'Select a property to see available filter values'
//         }
//         title='Available filters'
//       />
//       <PropSelector
//         {...args}
//         properties={selectedSubmitters}
//         onSelect={(removedValue) => {
//           const obj = Object.entries(selectedValues).reduce<any>(
//             (newSelected, [property, values]) => ({
//               ...newSelected,
//               [property]: [
//                 ...(newSelected[property] || []),
//                 ...values.filter((val) => val !== removedValue),
//               ],
//             }),
//             {},
//           );
//           setSelectedValues(obj);
//         }}
//         emptyText='No filters selected'
//         title='Selected filters'
//       />
//     </div>
//   );
// };

// PropertySelector.args = {
//   onSelect: (val) => console.log(val),
//   emptyText: 'No more values available',
//   selectedProperty: 'primaryObject',
// };

// SubmitterExample.args = {};

// export const FiltersV2 = (args) => {
//   const [selectedProperty, setSelectedProperty] =
//     useState<{ parent?: string; selected: string } | null>(null);
//   const [selectedValues, setSelectedValues] = useState<{
//     [property: string]: string[] | { [type: string]: string[] };
//   }>({});

//   const input = {
//     submitter: [
//       {
//         value: '6093a60ecdb17300258c7ae4',
//         label: 'Submitter A',
//       },
//       {
//         value: '6093a60ecdb17300258c7ae5',
//         label: 'Submitter B',
//       },
//     ],
//     tag: [
//       {
//         value: '6093a60ecdb17300258c7235',
//         label: 'Tag A',
//       },
//     ],
//     primaryObject: [
//       {
//         value: 'courseevt_BI1143-40049-VT2021',
//         label: 'BI1143-40049',
//       },
//     ],

//     objects: [
//       {
//         value: 'room',
//         label: 'Room',
//         children: [
//           {
//             value: 'MHusSal2011',
//             label: 'Sal 2011',
//           },
//         ],
//       },
//       {
//         value: 'tag',
//         label: 'Tag',
//         children: [
//           {
//             value: 'tagA',
//             label: 'Steinis best tag',
//           },
//         ],
//       },
//     ],
//     // room: [
//     //   {
//     //     value: 'room.seats',
//     //     label: 'Seats',
//     //     children: [
//     //       {
//     //         value: 25,
//     //         label: '25',
//     //       },
//     //     ],
//     //   },
//     //   {
//     //     value: 'room.campus',
//     //     label: 'Campus',
//     //     children: [{ value: 'Ultuna', label: 'Ultuna' }],
//     //   },

//     //   {
//     //     value: 'MHusSal2011',
//     //     label: 'Sal 2011',
//     //   },
//     // ],
//     // primaryObject: [
//     //   {
//     //     value: 'courseevt_BI1143-40049-VT2021',
//     //     label: 'BI1143-40049',
//     //   },
//     // ],
//     // fields: [
//     //   {
//     //     value: 'res.comment',
//     //     label: 'Comment',
//     //     children: [
//     //       {
//     //         value: 'Ska ha extra nånting',
//     //         label: 'Ska ha extra nånting',
//     //       },
//     //       {
//     //         value: 'Ta med egen hund!',
//     //         label: 'Ta med egen hund!',
//     //       },
//     //     ],
//     //   },
//     //   {
//     //     value: 'res.internalComment',
//     //     label: 'Internal comment',
//     //     children: [
//     //       {
//     //         value: 'Vill ha en grön projektor',
//     //         label: 'Vill ha en grön projektor',
//     //       },
//     //     ],
//     //   },
//     //   {
//     //     value: 'technical',
//     //     label: 'Needs technical support',
//     //     children: [
//     //       {
//     //         value: 'true',
//     //         label: 'Yes',
//     //       },
//     //       {
//     //         value: 'false',
//     //         label: 'No',
//     //       },
//     //     ],
//     //   },
//     // ],
//   } as {
//     [property: string]: {
//       value: string;
//       label: string;
//       children?: { value: string; label: string }[];
//     }[];
//   };

//   const output = {
//     submitter: ['idA', 'idB', 'idC'],
//     tag: ['idA', 'idB', 'idC'],
//     primaryObject: ['idA', 'idB', 'idC'],
//     objects: {
//       room: ['idA', 'idB', 'idC'],
//       tag: ['idA', 'idB', 'idC'],
//     },
//   };

//   const availProps = [
//     ...Object.entries(input).map(([key, values]) => ({
//       label: _.startCase(key),
//       value: key,
//       children: values.some((val) => val.children) && values,
//     })),
//     ...[
//       // {
//       //   value: 'objects',
//       //   label: 'Objects',
//       //   children: [
//       //     {
//       //       value: 'primaryObject',
//       //       label: 'Primary object',
//       //     },
//       //     {
//       //       value: 'room',
//       //       label: 'Room',
//       //     },
//       //     {
//       //       value: 'person.teacher',
//       //       label: 'Teacher',
//       //     },
//       //   ],
//       // },
//       // {
//       //   value: 'fields',
//       //   label: 'Reservation fields',
//       //   children: [
//       //     {
//       //       value: 'res.comment',
//       //       label: 'Comment',
//       //     },
//       //     {
//       //       value: 'res.internalComment',
//       //       label: 'Internal comment',
//       //     },
//       //     {
//       //       value: 'technical',
//       //       label: 'Needs technical support',
//       //     },
//       //   ],
//       // },
//     ],
//   ];

//   const availableSubmittersInput =
//     (selectedProperty &&
//       (selectedProperty?.parent
//         ? _.find(input[selectedProperty.parent], [
//             'value',
//             selectedProperty.selected,
//           ])?.children
//         : input[selectedProperty.selected])) ??
//     [];

//   const availableSubmitters =
//     availableSubmittersInput?.filter(
//       ({ value }) =>
//         !selectedValues[selectedProperty?.selected || '']?.includes(value),
//     ) || [];

//   const selectedSubmitters = Object.entries(selectedValues).map(
//     ([property, values]) => ({
//       ...availProps.find((prop) => prop.value === property),
//       children: values.map((val) =>
//         input[property].find((v) => v.value === val),
//       ),
//     }),
//   );

//   return (
//     <div style={{ display: 'flex' }}>
//       <PropSelector
//         {...args}
//         properties={availProps}
//         onSelect={(selected) => setSelectedProperty(selected)}
//         selectedPropertyValue={selectedProperty}
//         emptyText='No filter properties available'
//         title='Available properties'
//       />
//       <PropSelector
//         {...args}
//         properties={availableSubmitters}
//         onSelect={(value) =>
//           selectedProperty &&
//           setSelectedValues(
//             selectedProperty.parent
//               ? {
//                   ...selectedValues,
//                   [selectedProperty.parent]: [
//                     // ...(selectedValues[selectedProperty.parent] ?? []),
//                     value.selected,
//                   ],
//                 }
//               : {
//                   ...selectedValues,
//                   [selectedProperty.selected]: [
//                     // ...(selectedValues[selectedProperty.selected] ?? []),
//                     value.selected,
//                   ],
//                 },
//           )
//         }
//         emptyText={
//           selectedProperty
//             ? 'No more values available'
//             : 'Select a property to see available filter values'
//         }
//         title='Available filters'
//       />
//       <PropSelector
//         {...args}
//         properties={selectedSubmitters}
//         onSelect={(removedValue) => {
//           const obj = Object.entries(selectedValues).reduce<any>(
//             (newSelected, [property, values]) => ({
//               ...newSelected,
//               [property]: [
//                 ...(newSelected[property] || []),
//                 ...values.filter((val) => val !== removedValue.selected),
//               ],
//             }),
//             {},
//           );
//           setSelectedValues(obj);
//         }}
//         emptyText='No filters selected'
//         title='Selected filters'
//       />
//     </div>
//   );
// };

// FiltersV2.args = {};

type SelectedValues = Partial<{
  submitter: string[];
  tag: string[];
  primaryObject: string[];
  objects: {
    [typeExtId: string]: (string | { fieldExtId: string; values: string[] })[];
  };
  fields: {
    [fieldExtId: string]: string[];
  };
}>;

type Selection = {
  parent?: string;
  selected: string;
};

export const FiltersV3 = (args) => {
  const output = {
    submitter: ['idA', 'idB', 'idC'],
    tag: ['idA', 'idB', 'idC'],
    primaryObject: ['idA', 'idB', 'idC'],
    objects: {
      room: ['idA', 'idB', 'idC'],
      tag: ['idA', 'idB', 'idC'],
    },
  } as { [prop: string]: string[] | { [prop: string]: string[] } };

  const filterMap = {
    submitter: {
      kalle: ['actitityB'],
    },
    tag: {
      tagA: ['actitityB'],
    },
    objects: {
      room: {
        SALM1011: ['actitityB'],
      },
    },
    reservationFields: {
      rescomment: {
        Testarlite: ['ActivityA'],
      },
    },
    objectFields: {
      room: {
        roomtype: {
          Datorsal: ['ActivityA'],
        },
      },
    },
  };

  const filterQuery = {
    submitter: ['kalle'],
    tag: ['tagA'],
    objects: {
      room: ['SALM1011', { id: 'roomtype', values: ['Datorsal'] }],
    },

    fields: {
      rescomment: ['Testarlite'],
    },
  };
  const actualData = {
    objects: {
      room: [
        {
          type: 'room.type',
          values: ['Testar lite bara'],
        },
        'MHusSal2011',
      ],
      tag: ['tagA'],
    },
    fields: {
      'res.comment': ['Testar lite', 'Testar inte alls'],
    },
    submitter: ['6093a60ecdb17300258c7ae4', '6093a60ecdb17300258c7ae5'],
    tag: ['6093a60ecdb17300258c7235'],
    primaryObject: ['courseevt_BI1143-40049-VT2021'],
  };
  const res = Object.entries(actualData).flatMap(([prop, values]) => {
    if (!values) return [];
    if (Array.isArray(values)) {
      // Array of values
      return values.flatMap((value) => filterMap[prop][value]);
    } else {
      return Object.entries(values).flatMap(([type, vals]) =>
        vals.flatMap((valOrFilter) => {
          if (typeof valOrFilter === 'string') {
            return filterMap[prop]?.[type]?.[valOrFilter];
          } else {
            return valOrFilter.values.flatMap(
              (v) => filterMap?.objectFields?.[type][valOrFilter.id][v],
            );
          }
        }),
      );
    }
  });

  const result = ['ActivityA', 'ActivityB'];

  // switch (selectedProperty.parent) {
  //   case undefined: {
  //     return [...selectedValues[selectedProperty.selected], selection.selected];
  //   }
  //   case 'object': {
  //     break;
  //   }
  //   case 'fields': {
  //     break;
  //   }
  // }
  // Object.entries(asd) => [prop, values]

  const crazyOutput = {
    undefined: {
      submitter: {
        undefined: ['submitterA'],
      },
      tag: {
        undefined: ['tagA'],
      },
    },
    objects: {
      room: {
        undefined: ['roomABC'],
        roomtype: ['datorsal'],
      },
    },
  };

  const outputWithFilters = {
    submitter: ['idA', 'idB', 'idC'],
    tag: ['idA', 'idB', 'idC'],
    primaryObject: ['idA', 'idB', 'idC'],
    objects: [
      {
        type: 'room',
        values: [
          'idA',
          'idB',
          'idC',
          { id: 'room.type', values: ['Computer Lab', 'Auditorium'] },
        ],
      },
      { type: 'tag', values: ['idA', 'idB', 'idC'] },
    ],
    fields: [
      { type: 'comment', values: ['test'] },
      { type: 'needstechnical', values: ['1', '0'] },
      { type: 'seats', values: ['120', '10'] },
    ],
    // {
    //   room: [
    //     'idA',
    //     'idB',
    //     'idC',
    //     { id: 'room.type', values: ['Computer Lab', 'Auditorium'] },
    //   ],
    //   tag: ['idA', 'idB', 'idC'],
    // },
    // fields: {
    //   comment: ['test'],
    //   needstechincal: ['1', '0'],
    //   seats: ['120', '10'],
    // },
  };
  //  as SelectedValues;

  const [selectedProperty, setSelectedProperty] =
    useState<Selection | null>(null);
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});

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
    objects: [
      {
        value: 'room',
        label: 'Room',
        children: [
          {
            value: 'MHusSal2011',
            label: 'Sal 2011',
          },
          {
            value: 'room.type',
            label: 'Type',
            children: [
              {
                value: 'Testar lite bara',
                label: 'Testar lite bara',
              },
            ],
          },
        ],
      },
      {
        value: 'tag',
        label: 'Tag',
        children: [
          {
            value: 'tagA',
            label: 'Steinis best tag',
          },
        ],
      },
    ],
    fields: [
      {
        value: 'res.comment',
        label: 'Comment',
        children: [
          {
            value: 'Testar lite',
            label: 'Testar lite',
          },
          {
            value: 'Testar inte alls',
            label: 'Testar inte alls',
          },
        ],
      },
    ],
  } as {
    [property: string]: {
      value: string;
      label: string;
      children?: { value: string; label: string }[];
    }[];
  };

  const getSimpleProp = (prop) => ({
    label: _.startCase(prop),
    value: prop,
  });

  const getNestedProp = (prop) => (values) => ({
    ...getSimpleProp(prop),
    children: values.map((vals) => _.omit(vals, 'children')),
  });

  const nestedProps = ['fields', 'objects'];

  const availProps = Object.entries(input).map(([property, values]) =>
    nestedProps.includes(property)
      ? getNestedProp(property)(values)
      : getSimpleProp(property),
  );

  const getAvailableValues = (input, property: Selection) => {
    return property.parent
      ? _.find(input[property.parent], ['value', property.selected])
          ?.children ?? []
      : input[property.selected];
  };

  const availableSubmitters = selectedProperty
    ? getAvailableValues(input, selectedProperty)
    : [];

  const handleSelectValue = (selection: Selection) => {
    if (!selectedProperty) return;

    const insertValue = (currentValues, newValue): any[] =>
      currentValues.find((val) => val.type === newValue.type)
        ? currentValues.map((val) =>
            val.type === newValue.type
              ? {
                  ...val,
                  values: _.uniq([...val.values, ...newValue.values]),
                }
              : val,
          )
        : [...currentValues, newValue];

    const selectedValue = selection.parent
      ? { type: selection.parent, values: [selection.selected] }
      : selection.selected;

    const nextSelectedValues = selectedProperty.parent
      ? {
          ...selectedValues,
          [selectedProperty.parent]: {
            ...(selectedValues[selectedProperty.parent] || {}),
            [selectedProperty.selected]: [
              ...(typeof selectedValue === 'string'
                ? _.uniq([
                    ...(selectedValues[selectedProperty.parent]?.[
                      selectedProperty.selected
                    ] || []),
                    selectedValue,
                  ])
                : insertValue(
                    selectedValues[selectedProperty.parent]?.[
                      selectedProperty.selected
                    ] || [],
                    selectedValue,
                  )),
            ],
          },
        }
      : ({
          ...selectedValues,
          [selectedProperty.selected]: _.uniq([
            ...(selectedValues[selectedProperty.selected] || []),
            selection.selected,
          ]),
        } as SelectedValues);

    const handleDeselectValue = (deselected: Selection) => {};

    // const newSelectedValues = selectedProperty.parent
    //   ? {
    //       ...selectedValues,
    //       [selectedProperty.parent]: {
    //         ...(selectedValues[selectedProperty.parent] ?? []),
    //         [selectedProperty.selected]: _.uniq([
    //           ...(selectedValues[selectedProperty.parent]?.[
    //             selectedProperty.selected
    //           ] ?? []),

    //           selection.parent
    //             ? { type: selection.parent, value: selection.selected }
    //             : selection.selected,
    //         ]),
    //       },
    //     }
    //   : {
    //       ...selectedValues,
    //       [selectedProperty.selected]: _.uniqBy(
    //         [
    //           ...(selectedValues[selectedProperty.selected] ?? []),
    //           selection.parent
    //             ? { type: selection.parent, value: selection.selected }
    //             : selection.selected,
    //         ],
    //         (leftVal, rightVal) =>
    //           leftVal?.type === rightVal?.type && leftVal?.value,
    //       ),
    //     };
    setSelectedValues(nextSelectedValues);
  };

  const selectedSubmitters = [];
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
        onSelect={handleSelectValue}
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
        onSelect={(removedValue) => removedValue}
        emptyText='No filters selected'
        title='Selected filters'
      />
    </div>
  );
};

FiltersV3.args = {};
