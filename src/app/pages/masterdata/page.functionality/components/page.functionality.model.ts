import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../department';

export class PagePermissionModel extends BaseModel {
    public PermissionId: number;
    public DepartmentId: number;
    public PageId: number;
    public CanView: boolean;
    public CanEdit: boolean;
    public CanDelete: boolean;
    public OnlyHOD: boolean;

    public Department?: DepartmentModel;
    public Page?: PageModel;
}

export class PageModel extends BaseModel {
    public PageId: number;
    public PageName: string;
    public PageCode: string;
    public ParentPageId?:number;
    public ModuleName:string;
    public SortOrder?: number;

    public ParentPage?: PageModel;
    public ChildPages?: PageModel[];
    public PagePermissions?: PagePermissionModel[];
}

export class PagesForDepartmentModel extends BaseModel {
    public PageId: number;
    public PageName: string;
    public PageCode: string;
    public ParentPageName:string;
    public ModuleName:string;
    public SortOrder: string;
    public AllowView: boolean;
    public OnlyForHod: boolean;
    public isAllowView: boolean;
    public isOnlyHOD:boolean;
}
