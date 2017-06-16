export interface IMenu {
    title: string;
    url?: string;
    icon?: string;
    selected?: boolean;
    expanded?: boolean;
    order?: number;
    skip?: boolean;
    target?: string;
    command?: string;
}

export interface IMenuData {
    menu: IMenu;
}

export interface IMenuItem {
    path: string;
    data: IMenuData;
    children: IMenuItem[];
}

export interface IMenuStructure {
    path: string;
    paths: string[];
    data: IMenuData;
    children: IMenuItem[];
    route: IMenuItem;
}