import { ITabLinkInterface } from '../../shared';

export const TAB_LINKS: ITabLinkInterface[] = <ITabLinkInterface[]>[
    {
        id: 'AffectedPeople',
        title: 'Affected People',
        // icon: 'fa fa-apple fa-2x',
        url: '/pages/dashboard/people',
        selected: true,
        hidden: false,
        order: 1
    }, {
        id: 'AffectedObjects',
        title: 'Affected Cargo',
        // icon: 'fa fa-chrome fa-2x',
        url: '/pages/dashboard/cargo',
        selected: false,
        hidden: false,
        order: 2
    }, {
        id: 'Actionables',
        title: 'Checklists',
        // icon: 'fa fa-edge fa-2x',
        url: '/pages/dashboard/actionable',
        selected: false,
        hidden: false,
        order: 3
    }, {
        //     id: 'CallCenters',
        //     title: 'Call Centers',
        //     // icon: 'fa fa-drupal fa-2x',
        //     url: '/pages/dashboard/callCentre',
        //     selected: false,
        //     hidden: false,
        //     order: 4
        // }, {
        id: 'BroadcastMessages',
        title: 'Broadcast Messages',
        // icon: 'fa fa-envira fa-2x',
        url: '/pages/dashboard/broadcast',
        selected: false,
        hidden: false,
        order: 5
    }, {
        id: 'PresidentMessages',
        title: 'President Messages',
        // icon: 'fa fa-firefox fa-2x',
        url: '/pages/dashboard/presidentMessage',
        selected: false,
        hidden: false,
        order: 6
    }, {
        id: 'MediaManagement',
        title: 'Media Management',
        // icon: 'fa fa-medium fa-2x',
        url: '/pages/dashboard/media',
        selected: false,
        hidden: false,
        order: 7
    }, {
        id: 'Demand',
        title: 'Demand',
        // icon: 'fa fa-linux fa-2x',
        url: '/pages/dashboard/demand',
        selected: false,
        hidden: false,
        order: 8
    }, {
        id: 'OtherQuery',
        title: 'Other Query',
        // icon: 'fa fa-windows fa-2x',
        url: '/pages/dashboard/otherQuery',
        selected: false,
        hidden: false,
        order: 9
    }, {
        id: 'CrewQuery',
        title: 'Crew Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/crewQuery',
        selected: false,
        hidden: false,
        order: 10
    }, {
        id: 'PassengerQuery',
        title: 'Passenger Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/passengerquery',
        selected: false,
        hidden: false,
        order: 9
    }
    , {
        id: 'CargoQuery',
        title: 'Cargo Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/cargoquery',
        selected: false,
        hidden: false,
        order: 10

    }, {
        id: 'MediaQuery',
        title: 'Media Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/mediaquery',
        selected: false,
        hidden: false,
        order: 12
    }, {
        id: 'FutureTravelQuery',
        title: 'Future Travel Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/futuretravelquery',
        selected: false,
        hidden: false,
        order: 13
    }, {
        id: 'GeneralUpdateQuery',
        title: 'General Update Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/generalupdatequery',
        selected: false,
        hidden: false,
        order: 14
    }, {
        id: 'SituationalUpdatesQuery',
        title: 'Situational Updates Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/situationalupdatesquery',
        selected: false,
        hidden: false,
        order: 16
    }, {
        id: 'CustomerDissatisfactionQuery',
        title: 'Customer Dissatisfaction Query',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/dashboard/customerdissatisfactionquery',
        selected: false,
        hidden: false,
        order: 17
    }
];