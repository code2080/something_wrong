import noop from 'lodash/noop';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import last from 'lodash/last';
import TimingMapping from '../TimingMapping';
import { renderWithState } from '../../../Utils/test.utils';
import { activityTimeModes } from '../../../Constants/activityTimeModes.constants';

describe('TimingMapping tests', () => {
  const expectAntOption = (optionElement?: HTMLElement) => {
    if (!optionElement) {
      fail('Could not find element');
    }
    const antdSelectOptionClass = 'ant-select-item-option';

    const optionButtonDiv = Object.values(
      optionElement.closest(`.${antdSelectOptionClass}`)?.classList ?? {},
    );

    const expectedValue = expect(optionButtonDiv);
    return {
      not: {
        toBeDisabled: () =>
          expectedValue.not.toContain(`${antdSelectOptionClass}-disabled`),
      },
      toBeDisabled: () =>
        expectedValue.toContain(`${antdSelectOptionClass}-disabled`),
    };
  };

  const minimumProps = {
    onChange: noop,
    formSections: [],
    mapping: { timing: { mode: activityTimeModes.SEQUENCE } },
  };
  it('minimal props for rendering', () => {
    renderWithState(<TimingMapping {...minimumProps} />);
  });

  it('allows all modes if calendar section is available', async () => {
    renderWithState(
      <TimingMapping
        {...minimumProps}
        formSections={[{ elements: [], isConnected: true }]}
        mapping={{ ...minimumProps.mapping, objects: {}, fields: {} }}
      />,
    );

    const seqButton = screen.getByText('Sequence');
    fireEvent.mouseDown(seqButton);

    await waitFor(() => screen.getByText('Exact'));
    expectAntOption(screen.getByText('Exact')).not.toBeDisabled();
    expectAntOption(screen.getByText('Timeslots')).not.toBeDisabled();
    expectAntOption(last(screen.getAllByText('Sequence'))).not.toBeDisabled();
  });

  it('only allows sequence mode if calendar section is not available', async () => {
    renderWithState(
      <TimingMapping
        {...minimumProps}
        formSections={[{ isConnected: false, elements: [] }]}
        mapping={{
          ...minimumProps.mapping,
          objects: {},
          fields: {},
        }}
      />,
    );

    const seqButton = screen.getByText('Sequence');
    fireEvent.mouseDown(seqButton);

    await waitFor(() => screen.getByText('Exact'));
    expectAntOption(screen.getByText('Exact')).toBeDisabled();
    expectAntOption(screen.getByText('Timeslots')).toBeDisabled();
    expectAntOption(last(screen.getAllByText('Sequence'))).not.toBeDisabled();
  });

  // APP-246 tests!
  /*
  Given a calendar section with duration element, and some other elements of other types
  and timing mapping mode = sequence | timeslot

  Then length should only show the duration element
  
  *******
  Given a calendar section and timing mode = timeslot | exact

  The start and end time selection should only contain 
  <calendar section>  > start time
                      > end time.
  */

  /**
   * APP-253 test spec!
   * Given a section with calendar section with name "Test calendar section"
   * and timing mode = exact | timeslots
   *
   * Clicking start time dropdown
   *   -> Click Test calendar section
   *       => click start time
   *
   * Same alternatives for end time but with end time
   */
});
