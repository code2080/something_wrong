export const reservationTemplates = {
  'scheduling': {
    name: 'Scheduling',
    objects: [
      'room',
      'professor',
      'course',
    ],
    fields: ['comment'],
    propSettings: {
      'room': { mandatory: true },
      'professor': { mandatory: true },
      'course': { mandatory: true },
      'comment': { mandatory: false },
    }
  },
  'room-block': {
    name: 'Room block',
    objects: ['room'],
    fields: ['comment'],
    propSettings: {
      'room': { mandatory: true },
      'comment': { mandatory: false },
    }
  },
};
