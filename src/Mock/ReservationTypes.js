export const reservationTypes = {
  class: "typenode",
  extid: "Alla",
  id: 1,
  name: "Alla",
  subtypes: [
    {
      class: "typenode",
      extid: "accinfo",
      id: 227,
      name: "Accounting info"
    },
    {
      class: "typenode",
      description:
        "Activities is a parent type for several underlying types of acitivities. This type is not used in any template.",
      extid: "activity",
      id: 198,
      name: "Activities",
      subtypes: [
        {
          class: "typenode",
          extid: "activity_evt",
          id: 221,
          name: "Activity"
        },
        {
          class: "typenode",
          extid: "eqact",
          id: 214,
          name: "Equipment activity"
        },
        {
          class: "typenode",
          extid: "rbactivity",
          id: 199,
          name: "Lokalbokningsaktivitet"
        },
        {
          class: "typenode",
          extid: "cause",
          id: 201,
          name: "Orsak"
        },
        {
          class: "typenode",
          extid: "teachact",
          id: 200,
          name: "Teaching activity"
        },
        {
          class: "typenode",
          extid: "rbactivity_web",
          id: 224,
          name: "Webbokningsaktivitet"
        }
      ]
    },
    {
      class: "typenode",
      extid: "activity_iac",
      id: 229,
      name: "Activity (IAC)"
    },
    {
      class: "typenode",
      description: " ",
      extid: "availgrp_room",
      id: 226,
      name: "Avail. group (room)"
    },
    {
      class: "typenode",
      extid: "availgrp_user",
      id: 225,
      name: "Avail. group (user)"
    },
    {
      class: "typenode",
      extid: "course",
      id: 183,
      name: "Course"
    },
    {
      class: "typenode",
      extid: "coursepart",
      id: 184,
      name: "Course module"
    },
    {
      class: "typenode",
      extid: "customerref",
      id: 218,
      name: "Customer ref."
    },
    {
      class: "typenode",
      extid: "equipment",
      id: 213,
      name: "Equipment"
    },
    {
      class: "typenode",
      extid: "event",
      id: 216,
      name: "Event"
    },
    {
      class: "typenode",
      extid: "eventtype",
      id: 217,
      name: "Event type"
    },
    {
      class: "typenode",
      extid: "headcount",
      id: 223,
      name: "Headcount"
    },
    {
      class: "typenode",
      extid: "renter",
      id: 195,
      name: "Hyrestagare",
      subtypes: [
        {
          class: "typenode",
          extid: "organization",
          id: 196,
          name: "Cost center"
        },
        {
          class: "typenode",
          extid: "customer",
          id: 197,
          name: "Customer"
        }
      ]
    },
    {
      class: "typenode",
      extid: "user_iac",
      id: 228,
      name: "IAC Staff"
    },
    {
      class: "typenode",
      extid: "evt_option",
      id: 220,
      name: "Option"
    },
    {
      class: "typenode",
      extid: "person",
      id: 187,
      name: "Person",
      subtypes: [
        {
          class: "typenode",
          extid: "staff",
          id: 188,
          name: "Staff"
        },
        {
          class: "typenode",
          extid: "student",
          id: 189,
          name: "Student"
        }
      ]
    },
    {
      class: "typenode",
      extid: "persongroup",
      id: 190,
      name: "Persongrupp",
      subtypes: [
        {
          class: "typenode",
          extid: "studentgroup",
          id: 191,
          name: "Student group"
        },
        {
          class: "typenode",
          extid: "studentgroupOpt",
          id: 192,
          name: "Studentgrupp-valfri"
        },
        {
          class: "typenode",
          extid: "subgroup",
          id: 193,
          name: "Sub group"
        },
        {
          class: "typenode",
          extid: "subgroupOpt",
          id: 194,
          name: "Undergrupp-valfri"
        }
      ]
    },
    {
      class: "typenode",
      extid: "rooms",
      id: 209,
      name: "Rooms",
      subtypes: [
        {
          class: "typenode",
          extid: "room",
          id: 182,
          name: "Room"
        },
        {
          class: "typenode",
          extid: "roompart",
          id: 215,
          name: "Room part"
        },
        {
          class: "typenode",
          extid: "room_abstract",
          id: 210,
          name: "Room planning"
        }
      ]
    },
    {
      class: "typenode",
      extid: "theme",
      id: 219,
      name: "Theme"
    }
  ]
};
