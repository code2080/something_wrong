export const reservationFields = [
  {
    class: "fielddef",
    editable: true,
    extid: "evtres.price_act",
    id: 111,
    kind: 2,
    length: 8,
    listable: true,
    name: "Price - avtivity",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    categories: ["10797500011", "10797500013", "10797500015"],
    class: "fielddef",
    editable: true,
    extid: "evtres.actnr_activity",
    filter: "[0-9]",
    id: 108,
    kind: 9,
    length: 11,
    listable: true,
    name: "Activity nr - activity",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "evtres.price_room",
    id: 113,
    kind: 2,
    length: 50,
    listable: true,
    name: "Price - room",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    categories: ["10797500013"],
    class: "fielddef",
    editable: true,
    extid: "evtres.actnr_room",
    filter: "[0-9]",
    id: 110,
    kind: 9,
    length: 11,
    listable: true,
    name: "Activity nr - room",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "evtres.price_extras",
    id: 112,
    kind: 2,
    length: 8,
    listable: true,
    name: "Price-extras",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "evtres.actnr_extras",
    filter: "[0-9]",
    id: 109,
    kind: 9,
    length: 11,
    listable: true,
    name: "Activity nr - extras",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "user_text",
    id: 2,
    kind: 2,
    length: 31,
    listable: true,
    name: "Title",
    reference_fields: [
      {
        class: "fieldid",
        extid: "",
        id: 90
      }
    ],
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.locationComment",
    id: 115,
    kind: 2,
    length: 63,
    listable: true,
    name: "Location Comment",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.externalTeacher",
    id: 82,
    kind: 2,
    length: 63,
    listable: true,
    name: "External teacher",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "general.url",
    id: 23,
    kind: 4,
    length: 125,
    listable: true,
    name: "URL",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.comment",
    id: 12,
    kind: 6,
    length: 500,
    name: "Public comment",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    categories: ["1", "0"],
    class: "fielddef",
    default_value: "0",
    editable: true,
    extid: "reservation.attention",
    id: 158,
    kind: 7,
    listable: true,
    name: "Manual debit",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.internalComment",
    id: 65,
    kind: 6,
    length: 255,
    name: "Internal comment",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.literatureInfo",
    id: 164,
    kind: 6,
    length: 500,
    name: "Literature",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.eventStructure",
    id: 163,
    kind: 6,
    length: 255,
    name: "Event structure",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "timeedit_reservation_text_ref",
    id: 90,
    kind: 10,
    listable: true,
    name: "Reservation text",
    reference_fields: [
      {
        class: "fieldid",
        extid: "",
        id: 2
      }
    ],
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.extradebit_vh",
    id: 106,
    kind: 2,
    length: 128,
    multiple: true,
    name: "Extradebitering",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    categories: [
      "      0 -   999",
      " 1000 -  1999",
      " 2000 -  2999",
      " 3000 -  3999",
      " 4000 -  4999",
      " 5000 -  5999",
      " 6000 -  6999",
      " 7000 -  7999",
      " 8000 -  8999",
      " 9000 -  9999"
    ],
    class: "fielddef",
    default_value: "0",
    editable: true,
    extid: "reservation.headcount",
    id: 107,
    kind: 1,
    listable: true,
    max: 9999,
    name: "Headcount",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.coursecode",
    id: 131,
    kind: 2,
    length: 10,
    listable: true,
    name: "Course code (LTH)",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.contactinfo",
    id: 132,
    kind: 6,
    length: 255,
    name: "Contact info",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.iac_internalComment",
    id: 154,
    kind: 6,
    length: 255,
    name: "Internal comment*",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    description: "Description of field...",
    editable: true,
    extid: "reservation.iac_public_comment",
    id: 155,
    kind: 6,
    length: 255,
    name: "Additional Information",
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    class: "fielddef",
    editable: true,
    extid: "reservation.accountstring",
    id: 161,
    kind: 2,
    length: 50,
    listable: true,
    name: "Konteringssträng",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  },
  {
    categories: [
      "      0 -  1695",
      " 1696 -  3391",
      " 3392 -  5087",
      " 5088 -  6783",
      " 6784 -  8479",
      " 8480 -  10175",
      " 10176 -  11871",
      " 11872 -  13567",
      " 13568 -  15263",
      " 15264 -  16959"
    ],
    class: "fielddef",
    default_value: "0",
    editable: true,
    extid: "reservation.reservationcost",
    id: 162,
    kind: 1,
    listable: true,
    max: 999999,
    name: "Belopp",
    searchable: true,
    sum_type: {
      class: "typeid",
      extid: "",
      id: 0
    }
  }
];
