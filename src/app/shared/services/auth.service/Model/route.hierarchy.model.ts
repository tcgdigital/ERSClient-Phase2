import { IRouteHierarchy } from '../route.hierarchy.interface'

export const ROUTING_HIERARCHY: IRouteHierarchy[] = <IRouteHierarchy[]> [
    {
        id: 'Dashboard',
        title: 'Dashboard',
        icon: 'fa fa-home fa-lg',
        url: '/pages/dashboard/people',
        selected: true,
        hidden: false,
        order: 1,
        level: 1,
        children: [
            {
                id: 'AffectedPeople',
                title: 'Search PDA',
                icon: 'fa fa-apple fa-2x',
                url: '/pages/dashboard/people',
                selected: true,
                hidden: false,
                order: 1,
                level: 2,
                children: [
                    {
                        id: 'SearchPaxItems',
                        title: 'Passenger Directly Affected',                       
                        url: '/pages/dashboard/people/detail',
                        selected: true,
                        hidden: false,
                        order: 1,
                        level: 3,
                    }, {

                        id: 'VerifyPaxManifest',
                        title: 'Verify Passenger Manifest',                       
                        url: '/pages/dashboard/people/verify',
                        selected: true,
                        hidden: false,
                        order: 2,
                        level: 4
                    }
                ]
            },{
                id: 'AffectedObjects',
                title: 'Search Cargo',
                icon: 'fa fa-chrome fa-2x',
                url: '/pages/dashboard/cargo',
                selected: true,
                hidden: false,
                order: 2,
                level: 5,
                children: [
                    {
                        id: 'ViewSearchCargo',
                        title: 'Cargo',                       
                        url: '/pages/dashboard/cargo/detail',
                        selected: true,
                        hidden: false,
                        order: 3,
                        level: 6,
                    }, {

                        id: 'VerifyCargoManifest',
                        title: 'Verify Cargo Manifest',                       
                        url: '/pages/dashboard/cargo/verify',
                        selected: true,
                        hidden: false,
                        order: 4,
                        level: 7,
                    }
                ]
            },{
                id: 'ViewUpdateOwnDeptSpecificCheckList',
                title: 'Actionable',
                icon: 'fa fa-edge fa-2x',
                url: '/pages/dashboard/actionable',
                selected: true,
                hidden: false,
                order: 3,
                level: 8,
                children: [
                    {
                        id: 'ActiveCheckLists',
                        title: 'Open Actionable',                       
                        url: '/pages/dashboard/actionable/open',
                        selected: true,
                        hidden: false,
                        order: 5,
                        level: 9,
                    }, {

                        id: 'ClosedCheckLists',
                        title: 'Closed Actionable',                       
                        url: '/pages/dashboard/actionable/close',
                        selected: true,
                        hidden: false,
                        order: 6,
                        level: 10,
                    }
                ]
            },{
                id: 'LogCallerEnquiry',
                title: 'Call Centers',
                icon: 'fa fa-drupal fa-2x',
                url: '/pages/dashboard/callCentre',
                selected: true,
                hidden: false,
                order: 4,
                level: 11,
            },{
                id: 'ViewBroadCast',
                title: 'Broadcast Messages',
                icon: 'fa fa-envira fa-2x',
                url: '/pages/dashboard/broadcast',
                selected: true,
                hidden: false,
                order: 5,
                level: 12,
            },{
                id: 'ViewPresidentMessage',
                title: 'President Messages',
                icon: 'fa fa-firefox fa-2x',
                url: '/pages/dashboard/presidentMessage',
                selected: true,
                hidden: false,
                order: 6,
                level: 13,
            },{
                id: 'ViewPressRelease',
                title: 'Media Management',
                icon: 'fa fa-medium fa-2x',
                url: '/pages/dashboard/media',
                selected: true,
                hidden: false,
                order: 7,
                level: 14,
                children: [
                    {
                        id: 'ViewMediaQueries',
                        title: 'Media Query',                       
                        url: '/pages/dashboard/media/query',
                        selected: true,
                        hidden: false,
                        order: 7,
                        level: 15,
                    }, {

                        id: 'ViewMediaRelease',
                        title: 'Media Release',                       
                        url: '/pages/dashboard/media/release',
                        selected: true,
                        hidden: false,
                        order: 8,
                        level: 16,
                    }
                ]
            },{
                id: 'ViewDemands',
                title: 'Demand',
                icon: 'fa fa-linux fa-2x',
                url: '/pages/dashboard/demand',
                selected: true,
                hidden: false,
                order: 8,
                level: 17,
                children: [
                    {
                        id: 'ViewDepartmentSpecificDemands',
                        title: 'Assigned To Me',                       
                        url: '/pages/dashboard/demand/assigned',
                        selected: true,
                        hidden: false,
                        order: 9,
                        level: 18,
                    }, {

                        id: 'RaiseDepartmentSpecificDemands',
                        title: 'My Demands',                       
                        url: '/pages/dashboard/demand/own',
                        selected: true,
                        hidden: false,
                        order: 10,
                        level: 19,
                    }, {

                        id: 'ApproveDemandsRequireApproval',
                        title: 'Approval Pending',                       
                        url: '/pages/dashboard/demand/approval',
                        selected: true,
                        hidden: false,
                        order: 11,
                        level: 20,
                    }, {

                        id: 'CompletedDepartmentSpecificDemands',
                        title: 'Completed',                       
                        url: '/pages/dashboard/demand/completed',
                        selected: true,
                        hidden: false,
                        order: 12,
                        level: 21,
                    }
                ]
            },{
                id: 'ViewOtherQueries',
                title: 'Other Queries',
                icon: 'fa fa-windows fa-2x',
                url: '/pages/dashboard/otherQuery',
                selected: true,
                hidden: false,
                order: 9,
                level: 22
            },{
                id: 'ViewCrewQueries',
                title: 'Other Queries',
                icon: 'fa fa-twitter fa-2x',
                url: '/pages/dashboard/crewQuery',
                selected: true,
                hidden: false,
                order: 10,
                level: 23
            }
        ]
    },{
        id: 'MasterDataMgmt',
        title: 'Master Data Management',
        icon: 'fa fa-database fa-lg',
        url: '/pages/masterdata',
        selected: true,
        hidden: false,
        order: 2,
        level: 1,
        Children: [
            {
                id: 'UpdateMasterDataForDepartments',
                title: 'Department',
                icon: 'fa fa-apple fa-2x',
                url: '/pages/masterdata/department',
                selected: true,
                hidden: false,
                order: 1,
                level: 2
            },{
                id: 'UpdateAllDepartmentChecklist',
                title: 'Check List',
                icon: 'fa fa-chrome fa-2x',
                url: '/pages/masterdata/checklist',
                selected: true,
                hidden: false,
                order: 2,
                level: 3
            },{
                id: 'UpdateMasterDataForDemandTypes',
                title: 'Demand Type',
                icon: 'fa fa-edge fa-2x',
                url: '/pages/masterdata/demandtype',
                selected: true,
                hidden: false,
                order: 3,
                level: 4
            },{
                id: 'UpdateMasterDataForEmergencyTypes',
                title: 'Emergency Types',
                icon: 'fa fa-drupal fa-2x',
                url: '/pages/masterdata/emergencytype',
                selected: true,
                hidden: false,
                order: 4,
                level: 5
            },{
                id: 'UpdateMasterDataForQuickLinks',
                title: 'Quick Links',
                icon: 'fa fa-envira fa-2x',
                url: '/pages/masterdata/emergencytype',
                selected: true,
                hidden: false,
                order: 5,
                level: 6
            },{
                id: 'EmergencyDepartment',
                title: 'Emergency Department Mapping',
                icon: 'fa fa-firefox fa-2x',
                url: '/pages/masterdata/emergencydepartment',
                selected: true,
                hidden: false,
                order: 6,
                level: 7
            },{
                id: 'UpdateMasterDataForEventSpecificNotificationTemplate',
                title: 'Notification Template',
                icon: 'fa fa-medium fa-2x',
                url: '/pages/masterdata/template',
                selected: true,
                hidden: false,
                order: 7,
                level: 8
            },{
                id: 'UpdateMasterDataForUserDepartmentMapping',
                title: 'User Permission',
                icon: 'fa fa-linux fa-2x',
                url: '/pages/masterdata/template',
                selected: true,
                hidden: false,
                order: 8,
                level: 9
            },{
                id: 'UpdateMasterDataForFunctionalityAccessMapping',
                title: 'Department Functionality Mapping',
                icon: 'fa fa-windows fa-2x',
                url: '/pages/masterdata/departmentfunctionality',
                selected: true,
                hidden: false,
                order: 9,
                level: 10
            },{
                id: 'ActivateSupportMembersAndAssignRoles',
                title: 'User Profile',
                icon: 'fa fa-twitter fa-2x',
                url: '/pages/masterdata/departmentfunctionality',
                selected: true,
                hidden: false,
                order: 10,
                level: 11
            }
        ]
    },{
        id: 'IniciateCrisis',
        title: 'Emergency Initiation',
        icon: 'fa fa-bell fa-lg',
        url: '/pages/incident',
        selected: true,
        hidden: false,
        order: 3,
        level: 1
    },{
        id: 'IniciateNotifyDepartment',
        title: 'Notify Team',
        icon: 'fa fa-bullhorn fa-lg',
        url: '/pages/notifypeople',
        selected: true,
        hidden: false,
        order: 3,
        level: 1
    }

];