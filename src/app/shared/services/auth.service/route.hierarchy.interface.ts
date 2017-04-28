export interface IRouteHierarchy {
    id: string;
    title: string;
    description?: string;
    url: string;
    icon?: string;
    selected: boolean;
    hidden: boolean;
    order: number;
    level: number;

    children? : IRouteHierarchy[]
}