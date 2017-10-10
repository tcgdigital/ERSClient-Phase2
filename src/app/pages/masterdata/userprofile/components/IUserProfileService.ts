import { Observable } from 'rxjs/Rx';
import { UserProfileModel } from './userprofile.model';
import { IServiceInretface, ResponseModel, BaseModel } from '../../../../shared';

export interface IUserProfileService extends IServiceInretface<UserProfileModel> {
    GetQuery(query: string): Observable<ResponseModel<UserProfileModel>>;

    GetAllActiveWithContact(): Observable<ResponseModel<UserProfileModel>>;

    GetAllActiveWithContactAlternet(): Observable<ResponseModel<UserProfileModel>>

    GetForDirectory(): Observable<ResponseModel<UserProfileModel>>;

    GetDepartmentPages(userprofileId: number): Observable<ResponseModel<UserProfileModel>>;
}