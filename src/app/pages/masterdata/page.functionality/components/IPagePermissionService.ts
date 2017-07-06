import { Observable } from 'rxjs/Rx';
import { PagePermissionModel } from './page.functionality.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IPagePermissionService extends IServiceInretface<PagePermissionModel> {
    GetFilter(deptId: string): Observable<ResponseModel<PagePermissionModel>>;
}