import ObjectObjectValue from '../ObjectObjectValue';
import { renderWithState } from '../../../../../Utils/test.utils';

describe('ObjectObjectValue component tests', () => {
  it('renders with empty parameters', () => {
    renderWithState(<ObjectObjectValue value={[]} />);
  });
});
