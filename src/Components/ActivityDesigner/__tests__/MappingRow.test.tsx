import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import _ from 'lodash';
import MappingRow from '../MappingRow';

describe('MappingRow tests', () => {
  const props = {
    teProp: 'Room',
    mappingOptions: [
      {
        value: 'scopedObject',
        label: 'Primary object',
      },
      {
        value: '60e44c208e17d40023a34c59',
        label: 'Untitled connected section',
        disabled: false,
        children: [
          {
            value: 'templates',
            label: 'Activity template',
          },
          {
            value: 'groups',
            label: 'Groups',
          },
          {
            value: '60e44c208e17d40023a34c53',
            label: 'Titel',
          },
          {
            value: '60e44c208e17d40023a34c54',
            label: 'Kommentar',
          },
          {
            value: '60e44c208e17d40023a34c55',
            label: 'Lärare',
          },
          {
            value: '60e44c208e17d40023a34c56',
            label: 'Aktivitet',
          },
          {
            value: '60e44c208e17d40023a34c57',
            label: 'Rum',
          },
          {
            value: '60e44c208e17d40023a34c58',
            label: 'Utrustning',
          },
        ],
      },
    ],
    onChangeMapping: _.noop,
    onRemoveTEProp: _.noop,
  };

  it('renders tooltip', async () => {
    render(
      <div id='te-prefs-lib'>
        <MappingRow
          {...props}
          formMapping={[
            ['60e44c208e17d40023a34c59', '60e44c208e17d40023a34c57'],
          ]}
        />
      </div>,
    );
    fireEvent.mouseOver(screen.getByText('Untitled connected section / Rum'));
    await waitFor(() => screen.getByRole('tooltip'));

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Untitled connected section / Rum',
    );
  });
});
