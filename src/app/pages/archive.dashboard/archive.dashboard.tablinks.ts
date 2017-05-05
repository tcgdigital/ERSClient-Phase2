import { ITabLinkInterface } from '../../shared';

export const TAB_LINKS: ITabLinkInterface[] = [
    {
        id: 'AffectedPeople',
        title: 'Affected People',
        icon: 'fa fa-apple fa-2x',
        url: '/pages/archivedashboard/people',
        selected: true,
        hidden: false,
        order: 1
    }, {
        id: 'AffectedObjects',
        title: 'Affected Cargo',
        icon: 'fa fa-chrome fa-2x',
        url: '/pages/archivedashboard/cargo',
        selected: false,
        hidden: false,
        order: 2
    }, {
        id: 'Actionables',
        title: 'Checklists',
        icon: 'fa fa-edge fa-2x',
        url: '/pages/archivedashboard/actionable',
        selected: false,
        hidden: false,
        order: 3
    }, {
        id: 'BroadcastMessages',
        title: 'Broadcast Messages',
        icon: 'fa fa-envira fa-2x',
        url: '/pages/archivedashboard/broadcast',
        selected: false,
        hidden: false,
        order: 5
    }, {
        id: 'PresidentMessages',
        title: 'President Messages',
        icon: 'fa fa-firefox fa-2x',
        url: '/pages/archivedashboard/presidentMessage',
        selected: false,
        hidden: false,
        order: 6
    }, {
        id: 'MediaManagement',
        title: 'Media Management',
        icon: 'fa fa-medium fa-2x',
        url: '/pages/archivedashboard/media',
        selected: false,
        hidden: false,
        order: 7
    }, {
        id: 'Demand',
        title: 'Demand',
        icon: 'fa fa-linux fa-2x',
        url: '/pages/archivedashboard/demand',
        selected: false,
        hidden: false,
        order: 8
    }, {
        id: 'OtherQuery',
        title: 'Other Query',
        icon: 'fa fa-windows fa-2x',
        url: '/pages/archivedashboard/otherQuery',
        selected: false,
        hidden: false,
        order: 9
    }, {
        id: 'CrewQuery',
        title: 'Crew Query',
        icon: 'fa fa-twitter fa-2x',
        url: '/pages/archivedashboard/crewQuery',
        selected: false,
        hidden: false,
        order: 10
    }
] as ITabLinkInterface[];