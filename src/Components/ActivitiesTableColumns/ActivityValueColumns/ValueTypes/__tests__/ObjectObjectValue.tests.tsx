import { screen } from '@testing-library/dom';
import ObjectObjectValue from '../ObjectObjectValue';
import { renderWithState } from '../../../../../Utils/test.utils';

describe('ObjectObjectValue component tests', () => {
  it('renders with empty parameters', () => {
    renderWithState(<ObjectObjectValue value={[]} />);
  });

  it('renders labels when labels are available', () => {
    renderWithState(<ObjectObjectValue value={['testExtId']} />, {
      initialState: {
        te: {
          extIdProps: {
            objects: {
              testExtId: {
                label: 'TestExtIdLabel',
              },
            },
          },
        },
      },
    });
    screen.getByText('TestExtIdLabel');
  });

  it('renders extId when labels are unavailable', () => {
    renderWithState(<ObjectObjectValue value={['testExtId']} />);
    screen.getByText('testExtId');
  });
});
