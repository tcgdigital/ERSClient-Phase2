import { Observable } from 'rxjs/Rx';
import { PagePermissionModel, PagesPermissionMatrixModel } from './page.functionality.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IPagePermissionService extends IServiceInretface<PagePermissionModel> {
    GetFilter(deptId: string):
        Observable<ResponseModel<PagePermissionModel>>;

    GetPagePermissionMatrix(userId: number):
        Observable<PagesPermissionMatrixModel[]>;

    GetPermissionByDepartmentId(departmentId: number):
        Observable<ResponseModel<PagePermissionModel>>;

    CreateBulkByDepartmentId(entities: PagePermissionModel[], departmentId: number):
        Observable<PagePermissionModel[]>
}