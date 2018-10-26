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
    public ParentPageId?: number;
    public ModuleName: string;
    public ID: string;
    public URL: string;
    public Type: string;
    public Selected: boolean;
    public Hidden: boolean;
    public SortOrder?: number;

    public ParentPage?: PageModel;
    public ChildPages?: PageModel[];
    public PagePermissions?: PagePermissionModel[];
}

export class PagesForDepartmentModel extends BaseModel {
    public PageId: number;
    public PageName: string;
    public PageCode: string;
    public ParentPageId?: number;
    public ParentPageName: string;
    public ModuleName: string;
    public Summery: string;
    public ID: string;
    public URL: string;
    public Type: string;
    public Selected: boolean;
    public Hidden: boolean;
    public SortOrder: string;
    public AllowView: boolean;
    public OnlyForHod: boolean;
    public isAllowView: boolean;
    public isOnlyHOD: boolean;
    public isDisabled: boolean;
}

export class PagesPermissionMatrixModel extends BaseModel {
    public PageId: number;
    public PageCode: string;
    public PageName: string;
    public CanView: boolean;
    public CanEdit: boolean;
    public CanDelete: boolean;
    public OnlyHOD: boolean;
    public ParentPageId?: number;
    public ModuleName: string;
    public ID: string;
    public URL: string;
    public Type: string;
    public Selected: boolean;
    public Hidden: boolean;
    public IsHod: boolean;
    public DepartmentId: number;
}

export class PageHierarchyModel {
    public id: number;
    public text: string;
    public pageCode: string;
    public checked: boolean;
    public hasChildren: boolean;
    public children: PageHierarchyModel[];

    public CanView: boolean;
    public CanEdit: boolean;
    public CanDelete: boolean;
    public OnlyHOD: boolean;
    public Type: string;
    public ModuleName: string;
    // public Page: PageModel;

    constructor() {
        this.CanView = false;
        this.CanEdit = false;
        this.CanDelete = false;
        this.OnlyHOD = false;
    }
}