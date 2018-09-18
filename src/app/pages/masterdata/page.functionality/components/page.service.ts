import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { PageModel, PageHierarchyModel, PagePermissionModel } from './page.functionality.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    IServiceInretface,
    NameValue
} from '../../../../shared';

@Injectable()
export class PageService implements IServiceInretface<PageModel>{

    private _dataServiceForPage: DataService<PageModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        this._dataServiceForPage = this.dataServiceFactory
            .CreateServiceWithOptions<PageModel>('Pages', option);
    }

    GetAll(): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query().Execute();
    }

    GetPagesOrderBySortOrder(): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query()
            .Expand('ParentPage($select=PageName)')
            .Filter('ActiveFlag eq CMS.DataModel.Enum.ActiveFlag\'Active\'')
            .OrderBy('ModuleName,ParentPageId,PageName,SortOrder')
            .Execute();
    }

    GetFilter(filter: string): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query()
            .Filter(filter)
            .Execute();
    }

    GetPageHierarchy(): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query()
            .Filter('ActiveFlag eq CMS.DataModel.Enum.ActiveFlag\'Active\'')
            .OrderBy('Type, ModuleName, SortOrder, ParentPageId, PageName')
            .Select(`PageId, PageName, PageCode, ModuleName, Type, ParentPageId`)
            .Execute()
    }

    // pageHierarchys: PageHierarchyModel[];
    PreparePageHierarchyData(pages: PageModel[], pagePermissions: PagePermissionModel[], parentId: number = null): PageHierarchyModel[] {
        let pageHierarchys: PageHierarchyModel[] = [];
        let parents: PageModel[] = pages.filter(x => x.ParentPageId == parentId);

        parents.forEach((parent: PageModel) => {
            // let children: PageHierarchyModel[] = this.PreparePageHierarchyData
            //     (pages.filter((child: PageModel) => child.ParentPageId == parent.PageId), pagePermissions, parent.PageId);

            let children: PageHierarchyModel[] = this.PreparePageHierarchyData
                (pages, pagePermissions, parent.PageId);

            let pageHierarchy = new PageHierarchyModel();
            pageHierarchy.id = parent.PageId;
            pageHierarchy.text = parent.PageName;
            pageHierarchy.Type = parent.Type;
            pageHierarchy.ModuleName = parent.ModuleName;
            //pageHierarchy.Page = page;

            const pagePermission: PagePermissionModel = pagePermissions.find(pp => pp.PageId == parent.PageId);
            if(pagePermission){
                pageHierarchy.CanView = pagePermission.CanView;
                pageHierarchy.CanEdit = pagePermission.CanEdit;
                pageHierarchy.CanDelete = pagePermission.CanDelete;
                pageHierarchy.OnlyHOD = pagePermission.OnlyHOD;
            }

            pageHierarchy.hasChildren = (children != undefined && children.length > 0);
            if (pageHierarchy.hasChildren)
                pageHierarchy.children = children;
            else
                pageHierarchy.children = [];

            pageHierarchys.push(pageHierarchy);
        });

        return pageHierarchys;
    }


    Get(id: string | number): Observable<PageModel> {
        const entity: PageModel = new PageModel();
        return Observable.of(entity);
    }

    Create(entity: PageModel): Observable<PageModel> {
        return Observable.of(entity);
    }

    CreateBulk(entities: PageModel[]): Observable<PageModel[]> {
        return Observable.of(entities);
    }

    Update(entity: PageModel): Observable<PageModel> {
        return Observable.of(entity);
    }

    UpdateWithHeader(entity: PageModel, header: NameValue<string>): Observable<PageModel> {
        return Observable.of(entity);
    }

    Delete(key: number): void { }

    GetDepartmentsByPageCode(pageCode: string): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query()
            .Filter(`PageCode eq '${pageCode}'`)
            .Expand('PagePermissions ($expand = Department)')
            .Execute();
    }
}