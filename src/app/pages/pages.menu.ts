import { IMenuItem } from '../shared/components/sidemenu';

export const PAGES_MENU: IMenuItem[] = <IMenuItem[]>[
    // export const PAGES_MENU = [
    {
        path: 'pages',
        children: [
            {
                path: 'dashboard',
                data: {
                    menu: {
                        title: 'Dashboard',
                        icon: 'fa fa-home fa-lg',
                        selected: true,
                        expanded: false,
                        order: 0
                    }
                }
            },
            {
                path: 'masterdata',
                data: {
                    menu: {
                        title: 'Master Data',
                        icon: 'fa fa-home fa-lg',
                        selected: false,
                        expanded: false,
                        order: 0
                    }
                },
                children: [
                    {
                        path: 'department',
                        data: {
                            menu: {
                                title: 'Department',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'checklist',
                        data: {
                            menu: {
                                title: 'Checklist',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'demandtype',
                        data: {
                            menu: {
                                title: 'Demand Type',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    },
                    {
                        path: 'emergencytype',
                        data: {
                            menu: {
                                title: 'Emergenct Type',
                                icon: 'fa fa-home fa-lg',
                                selected: false,
                                expanded: false,
                            }
                        }
                    }
                ]
            }
        ]
    }
];