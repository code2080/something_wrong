import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TimeSlotColumn from '../TimeSlotColumn';

describe('Timeslot column component tests', () => {
  const mockTimeslots = {
    morning: {
      label: 'Morning slot',
      startTime: '2021-07-05T06:00:00.000Z',
      endTime: '2021-07-05T08:00:00.000Z',
    },
    noon: {
      label: 'Noon slot',
      startTime: '2021-03-11T08:00:00.000Z',
      endTime: '2021-03-11T10:00:00.000Z',
    },
    afternoon: {
      label: 'Afternoon slot',
      startTime: '2021-04-12T10:00:00.000Z',
      endTime: '2021-04-12T12:00:00.000Z',
    },
  };

  const mockMorningEvent = {
    startTime: '2021-11-30T07:00:00Z',
    endTime: '2021-11-30T09:00:00Z',
  };

  it('renders the correct timeslot', () => {
    render(
      <TimeSlotColumn
        timeslots={[mockTimeslots.morning, mockTimeslots.noon]}
        event={mockMorningEvent}
      />,
    );
    expect(screen.getByText('Morning slot')).toBeInTheDocument();
    expect(screen.queryByText('Noon slot')).not.toBeInTheDocument();
  });

  it('renders the correct time in the tooltip', async () => {
    render(
      <div id='te-prefs-lib'>
        <TimeSlotColumn
          timeslots={[mockTimeslots.morning, mockTimeslots.noon]}
          event={mockMorningEvent}
        />
      </div>,
    );

    fireEvent.mouseOver(screen.getByText('Morning slot'));

    await waitFor(() => screen.getByRole('tooltip'));
    expect(
      screen.getByText('Timeslot Morning slot: 08:00 - 10:00'),
    ).toBeInTheDocument();
  });

  it('shows error message for not found timeslot', async () => {
    render(
      <div id='te-prefs-lib'>
        <TimeSlotColumn
          timeslots={[mockTimeslots.afternoon, mockTimeslots.noon]}
          event={mockMorningEvent}
        />
      </div>,
    );
    fireEvent.mouseOver(screen.getByText('N/A'));

    await waitFor(() => screen.getByRole('tooltip'));
    expect(screen.getByText('Timeslot could not be found')).toBeInTheDocument();
    expect(screen.queryByText('Noon slot')).not.toBeInTheDocument();
    expect(screen.queryByText('Afternoon slot')).not.toBeInTheDocument();
  });
});
