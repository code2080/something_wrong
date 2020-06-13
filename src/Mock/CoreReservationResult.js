// result are all the results, as the TimeEdit server reports them. Preferences is probably not interested in this parameter
// failures are all the failed activities, each paired with its result from TimeEdit
// newIds are the reservation IDs created. Perhaps they too should be paired with activities?
// Perhaps the result should simply be successes and failures, both in the same style as failures now?
export const coreReservationResult = {
  result: [{ reservation: 'Bokningen är ofullständig', references: [-9011] }],
  failures: [
    {
      result: { reservation: 'Bokningen är ofullständig', references: [-9011] },
      inData: {
        startTime: '2020-12-28T11:00:00.000Z',
        endTime: '2020-12-28T12:00:00.000Z',
        objects: [{ typeExtId: 'course', objectExtIds: 'course.AE1111' }],
        fields: [{ fieldExtId: 'activity.comment', value: 'New event' }]
      }
    }
  ],
  newIds: []
};

const failedResult = ({ reservation: 'Bokningen är ofullständig', references: [-9011] });
const failure = ({
  result: { reservation: 'Bokningen är ofullständig', references: [-9011] },
  inData: {
    startTime: '2020-12-28T11:00:00.000Z',
    endTime: '2020-12-28T12:00:00.000Z',
    objects: [{ typeExtId: 'course', objectExtIds: 'course.AE1111' }],
    fields: [{ fieldExtId: 'activity.comment', value: 'New event' }]
  }
});

export const coreReservationResults = reservations => ({
  result: reservations.map(() => failedResult),
  failures: reservations.map(() => failure),
  newIds: [],
});
