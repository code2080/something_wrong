import { fireEvent, screen, waitFor } from '@testing-library/react';
import ParameterCascader from '../ParameterCascader';
import '@testing-library/jest-dom';
import { renderWithState } from '../../../../Utils/test.utils';

const mockParamFields = {
  room: {
    'room.campus': 'Campus',
    'room.buildning': 'Hus',
    'room.buildning_eng': 'Hus (eng)',
    'room.id': 'Id',
    'general.objectcomment': 'Info',
    'room.payee': 'Lokalägare',
    'room.name': 'Namn',
    'room.name_eng': 'Namn (eng)',
    'room.city': 'Ort',
    'room.seats': 'Platser',
    'room.examprice': 'Pris per plats',
    'general.id': 'ReferenceID',
    'general.title': 'ReferenceName',
    'room.examseats': 'Tentaplatser',
    'room.type': 'Typ',
    'room.type_eng': 'Typ (eng)',
    'room.reservationtype': 'Typ av bokning',
    'room.url': 'URL',
    'room.equipment': 'Utrustning',
    'room.equipment_eng': 'Utrustning (eng)',
    'room.floor': 'Våning',
  },
  courseevt: {
    'courseevt.id': 'Anmälningskod',
    'courseevt.groupcategory': 'Gruppkategori',
    'courseevt.groupname': 'Gruppnamn',
    'courseevt.groupname_eng': 'Gruppnamn (eng)',
    'courseevt.uniqueid': 'Id',
    'general.objectcomment': 'Info',
    'courseevt.account': 'Kostnadsställe',
    'courseevt.coursecode': 'Kurskod',
    'coursecode+groupname_ref': 'Kurskod + Gruppnamn',
    'courseevt.points': 'Kurspoäng',
    'courseevt.coursename': 'Namn',
    'courseevt.coursename_eng': 'Namn (eng)',
    'general.department': 'Organisation',
    'general.department_eng': 'Organisation (eng)',
    'courseevt.project': 'Projekt',
    'general.id': 'ReferenceID',
    'general.title': 'ReferenceName',
    'courseevt.startsemester': 'Starttermin',
    'courseevt.startweek': 'Startvecka',
    'courseevt.teachingform': 'Undervisningsform',
    'courseevt.teachingpace': 'Undervisningstakt',
  },
  equipment: {
    'equipment.id': 'Id',
    'general.objectcomment': 'Info',
    'equipment.name': 'Namn',
    'equipment.name_eng': 'Namn (eng)',
    'room.city': 'Ort',
    'general.id': 'ReferenceID',
    'general.title': 'ReferenceName',
    'equipment.reservationtype': 'Typ av bokning',
    'equipment.payee': 'Ägare',
  },
  activity: {
    'general.objectcomment': 'Info',
    'activity.id': 'Namn',
    'activity.id_eng': 'Namn (eng)',
    'general.id': 'ReferenceID',
    'general.title': 'ReferenceName',
  },
  person_staff: {
    'person.employmentform': 'Anställningsform',
    'person.email': 'E-post',
    'person.lastname': 'Efternamn',
    'person.subdepartment': 'Enhet',
    'person.invoicereference': 'Fakturareferens',
    'person.firstname': 'Förnamn',
    'general.objectcomment': 'Info',
    'person.fullname': 'Namn',
    'general.department': 'Organisation',
    'general.department_eng': 'Organisation (eng)',
    'general.id': 'ReferenceID',
    'general.title': 'ReferenceName',
    'person.id': 'Signatur',
    'person.phone': 'Telefon',
    'person.title': 'Titel',
    'person.annualhours': 'Årsarbetstid',
  },
};

const mockActivityDesignObj = {
  room: [['601048afea0edb00206dae62', '601048afea0edb00206dae69']],
  courseevt: [['601048afea0edb00206dae62', 'groups']],
  equipment: [['601048afea0edb00206dae62', '601048afea0edb00206dae6d']],
  activity_teach: [['601048afea0edb00206dae62', '601048afea0edb00206dae6b']],
  person_staff: [['601048afea0edb00206dae62', '601048afea0edb00206dae67']],
};

const myMock = jest.fn();
const mockOperators = ['>', '>=', '=', '=<', '<'];

const mockParamFormElements = [
  { value: 'scopedObject', label: 'Primary object' },
  {
    value: '601048afea0edb00206dae62',
    label: 'Untitled connected section',
    disabled: false,
    children: [
      { value: 'templates', label: 'Activity template' },
      { value: 'groups', label: 'Groups' },
      { value: '601048afea0edb00206dae63', label: 'Titel' },
      { value: '601048afea0edb00206dae65', label: 'Kommentar' },
      { value: '601048afea0edb00206dae67', label: 'Lärare' },
      { value: '601048afea0edb00206dae69', label: 'Rum' },
      { value: '601048afea0edb00206dae6b', label: 'Aktivitet' },
      { value: '601048afea0edb00206dae6d', label: 'Utrustning' },
    ],
  },
];

describe('Testing parameter cascader', () => {
  it('Test rendering of cascader', () => {
    renderWithState(
      <ParameterCascader
        paramFields={mockParamFields}
        paramFormElements={mockParamFormElements}
        availableOperators={mockOperators}
        activityDesignObj={mockActivityDesignObj}
        oldParameters={undefined}
        onUpdate={myMock}
        operator={'='}
        constraintId={'testing'}
      />,
    );
  });

  it('Test example user flow', async () => {
    renderWithState(
      <ParameterCascader
        paramFields={mockParamFields}
        paramFormElements={mockParamFormElements}
        availableOperators={mockOperators}
        activityDesignObj={mockActivityDesignObj}
        oldParameters={undefined}
        onUpdate={myMock}
        operator={'='}
        constraintId={'testing'}
      />,
      {
        initialState: {
          te: { extIdProps: { types: { room: { label: 'Room' } } } },
        },
      },
    );
    const parameterSelectors = screen.getAllByPlaceholderText('Please select');

    expect(parameterSelectors.length === 2);

    fireEvent.click(parameterSelectors[0]);
    const formOption = screen.getByText('Form');
    await waitFor(() => formOption);
    expect(formOption).toBeInTheDocument();

    fireEvent.click(formOption);
    const primaryObjectOption = screen.getByText('Primary object');
    await waitFor(() => primaryObjectOption);
    expect(primaryObjectOption).toBeInTheDocument();

    fireEvent.click(primaryObjectOption);
    await waitFor(() =>
      expect(screen.getByText('Form / Primary object')).toBeInTheDocument(),
    );

    fireEvent.click(parameterSelectors[1]);
    const objectOption = screen.getByText('Objects');
    await waitFor(() => objectOption);

    fireEvent.click(objectOption);
    const roomOption = screen.getByText('Room');
    await waitFor(() => roomOption);

    fireEvent.click(roomOption);
    const seatsOption = screen.getByText('Platser');
    await waitFor(() => seatsOption);

    fireEvent.click(seatsOption);
    await waitFor(() =>
      expect(screen.getByText('Objects / Room / Platser')).toBeInTheDocument(),
    );
  });

  it('informs about missing activity design', async () => {
    renderWithState(
      <ParameterCascader
        paramFields={{}}
        paramFormElements={{}}
        availableOperators={[]}
        activityDesignObj={{}}
        constraintId='testing'
        oldParameters={undefined}
        operator='='
        onUpdate={myMock}
      />,
    );
    const sel = screen.getAllByPlaceholderText('Please select');

    fireEvent.click(sel[0]);
    const missingActivityDesignText = screen.getByText(
      'Missing Activity Design',
    );
    await waitFor(() => missingActivityDesignText);
    expect(missingActivityDesignText).toBeInTheDocument();
  });
});
