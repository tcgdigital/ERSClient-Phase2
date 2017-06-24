import { ITabLinkInterface } from '../../shared';

export const TAB_LINKS: ITabLinkInterface[] = <ITabLinkInterface[]>[
    {
        id: 'department',
        title: 'Department',
        // icon: 'fa fa-apple fa-2x',
        url: '/pages/masterdata/department',
        selected: true,
        hidden: false,
        order: 1
    }, {
        id: 'checklist',
        title: 'Checklist',
        // icon: 'fa fa-chrome fa-2x',
        url: '/pages/masterdata/checklist',
        selected: false,
        hidden: false,
        order: 2
    }, {
        id: 'demandtype',
        title: 'Demand Type',
        // icon: 'fa fa-edge fa-2x',
        url: '/pages/masterdata/demandtype',
        selected: false,
        hidden: false,
        order: 3
    }, {
        id: 'emergencytype',
        title: 'Crisis Type',
        // icon: 'fa fa-drupal fa-2x',
        url: '/pages/masterdata/emergencytype',
        selected: false,
        hidden: false,
        order: 4
    }, {
        id: 'quicklink',
        title: 'Quicklink',
        // icon: 'fa fa-envira fa-2x',
        url: '/pages/masterdata/quicklink',
        selected: false,
        hidden: false,
        order: 5
    }, {
        id: 'emergencydepartment',
        title: 'Crisis Department Mapping',
        // icon: 'fa fa-firefox fa-2x',
        url: '/pages/masterdata/emergencydepartment',
        selected: false,
        hidden: false,
        order: 6
    }, {
        id: 'template',
        title: 'Template',
        // icon: 'fa fa-medium fa-2x',
        url: '/pages/masterdata/template',
        selected: false,
        hidden: false,
        order: 7
    }, {
        id: 'userpermission',
        title: 'Userpermission',
        // icon: 'fa fa-linux fa-2x',
        url: '/pages/masterdata/userpermission',
        selected: false,
        hidden: false,
        order: 8
    }, {
        id: 'departmentfunctionality',
        title: 'Department Functionality Mapping',
        // icon: 'fa fa-windows fa-2x',
        url: '/pages/masterdata/departmentfunctionality',
        selected: false,
        hidden: false,
        order: 9
    }, {
        id: 'userprofile',
        title: 'Userprofile',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/masterdata/userprofile',
        selected: false,
        hidden: false,
        order: 10
    }, {
        
        id: 'emergencylocation',
        title: 'Affected Station',
        // icon: 'fa fa-twitter fa-2x',
        url: '/pages/masterdata/affectedstation',
        selected: false,
        hidden: false,
        order: 11   
    }
];