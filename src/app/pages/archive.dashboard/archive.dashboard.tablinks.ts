import { ITabLinkInterface } from '../../shared';

export const TAB_LINKS: ITabLinkInterface[] = [
    {
        id: 'Actionables',
        title: 'Checklists',
        url: '/pages/archivedashboard/actionable',
        selected: false,
        hidden: false,
        order: 1,
        subtab: [
            {
                id: 'ActivaChecklist',
                title: 'Open Checklist',
                url: './open',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'ClosedChecklist',
                title: 'Closed Checklist',
                url: './close',
                selected: false,
                hidden: false,
                order: 1
            }
        ]
    }, {
        id: 'Demand',
        title: 'Demand',
        url: '/pages/archivedashboard/demand',
        selected: false,
        hidden: false,
        order: 2,
        subtab: [
            {
                id: 'AssignedDemand',
                title: 'Assigned To Me',
                url: './assigned',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'OwnDemand',
                title: 'My Demands',
                url: './own',
                selected: false,
                hidden: false,
                order: 2
            }, {
                id: 'PendingDemand',
                title: 'Approval Pending',
                url: './approval',
                selected: false,
                hidden: false,
                order: 3
            }, {
                id: 'CompletedDemand',
                title: 'Completed',
                url: './completed',
                selected: false,
                hidden: false,
                order: 4
            }
        ]
    }, {
        id: 'AffectedPeople',
        title: 'Affected People',
        url: '/pages/archivedashboard/people',
        selected: true,
        hidden: false,
        order: 3,
        subtab: [
            {
                id: 'AffectedPeople',
                title: 'Affected People',
                url: './detail',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'VerifyAffectedPeople',
                title: 'Verify Affected People',
                url: './verify',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'GroundVictims',
        title: 'Ground Victims',
        url: '/pages/archivedashboard/groundmembers',
        selected: false,
        hidden: false,
        order: 4
    }, {
        id: 'AffectedCargo', //'AffectedObjects',
        title: 'Affected Cargo',
        url: '/pages/archivedashboard/cargo',
        selected: false,
        hidden: false,
        order: 5,
        subtab: [
            {
                id: 'Cargo',
                title: 'Cargo',
                url: './detail',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'VerifyCargo',
                title: 'Verify Cargo',
                url: './verify',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'BroadcastMessages',
        title: 'Broadcast Messages',
        url: '/pages/archivedashboard/broadcast',
        selected: false,
        hidden: false,
        order: 6
    }, {
        id: 'PresidentMessages',
        title: 'President Messages',
        url: '/pages/archivedashboard/presidentMessage',
        selected: false,
        hidden: false,
        order: 7,
        subtab: [
            {
                id: 'PresidentMessageRelease',
                title: 'President Message Release',
                url: './release',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'PresidentMessagePendingApprovals',
                title: 'Pending Approvals',
                url: './approvalpending',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'MediaManagement',
        title: 'Media Messages',
        url: '/pages/archivedashboard/media',
        selected: false,
        hidden: false,
        order: 8,
        subtab: [
            {
                id: 'MediaMessageRelease',
                title: 'Media Release',
                url: './release',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'MediaMessagePendingApprovals',
                title: 'Pending Approvals',
                url: './approvalpending',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'PassengerQuery',
        title: 'Passenger Query',
        url: '/pages/archivedashboard/passengerquery',
        selected: false,
        hidden: false,
        order: 9,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'CrewQuery',
        title: 'Crew Query',
        url: '/pages/archivedashboard/crewQuery',
        selected: false,
        hidden: false,
        order: 10,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'GroundVictimQuery',
        title: 'Ground Victim Query',
        url: '/pages/archivedashboard/groundvictimquery',
        selected: false,
        hidden: false,
        order: 11,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedCalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'CargoQuery',
        title: 'Cargo Query',
        url: '/pages/archivedashboard/cargoquery',
        selected: false,
        hidden: false,
        order: 12,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'MediaQuery',
        title: 'Media Query',
        url: '/pages/archivedashboard/mediaquery',
        selected: false,
        hidden: false,
        order: 13,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'GeneralUpdateQuery',
        title: 'General Update Query',
        url: '/pages/archivedashboard/generalupdatequery',
        selected: false,
        hidden: false,
        order: 14,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'SituationalUpdatesQuery',
        title: 'Situational Updates Query',
        url: '/pages/archivedashboard/situationalupdatesquery',
        selected: false,
        hidden: false,
        order: 15,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'FutureTravelQuery',
        title: 'Future Travel Query',
        url: '/pages/archivedashboard/futuretravelquery',
        selected: false,
        hidden: false,
        order: 16,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'CustomerDissatisfactionQuery',
        title: 'Customer Dissatisfaction Query',
        url: '/pages/archivedashboard/customerdissatisfactionquery',
        selected: false,
        hidden: false,
        order: 17,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }, {
        id: 'OtherQuery',
        title: 'Other Query',
        url: '/pages/archivedashboard/otherQuery',
        selected: false,
        hidden: false,
        order: 18,
        subtab: [
            {
                id: 'ReceivedCalls',
                title: 'Received Calls',
                url: './receivedCalls',
                selected: false,
                hidden: false,
                order: 1
            }, {
                id: 'AssignedCalls',
                title: 'Assigned Calls',
                url: './assignedcalls',
                selected: false,
                hidden: false,
                order: 2
            }
        ]
    }
] as ITabLinkInterface[];
