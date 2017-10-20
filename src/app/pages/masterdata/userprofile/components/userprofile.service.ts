import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserProfileModel, UserPerrmissionModel, PagePerrmissionModel } from './userProfile.model';
import { InvalidUserProfileModel } from './invalid.userprofile.model';
import { ServiceBase, DataServiceFactory, ResponseModel, DataService, DataProcessingService } from '../../../../shared';
import { IUserProfileService } from './IUserProfileService';

@Injectable()
export class UserProfileService extends ServiceBase<UserProfileModel>
    implements IUserProfileService {

    private _dataServiceInvalidRecords: DataService<InvalidUserProfileModel>;
    private _checkPermissionService: DataService<any>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'UserProfiles');

        const option: DataProcessingService = new DataProcessingService();
        this._dataServiceInvalidRecords = this.dataServiceFactory
            .CreateServiceWithOptions<InvalidUserProfileModel>('InvalidUserProfileRecords', option);

        this._checkPermissionService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix('PagePermissionMatrix', 'CheckUserHasPermission', option);
    }

    GetQuery(query: string): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query()
            .Filter(query).Execute();
    }

    GetAllActiveWithContact(): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query()
            .Filter(`MainContact ne null and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Execute();
    }

    GetAllActiveWithContactAlternet(): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query()
            .Select(`Name,UserProfileId`)
            .Filter(`MainContact ne null and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Execute();
    }

    GetForDirectory(): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query()
            .Select('UserProfileId,UserId,Name,MainContact,AlternateContact,isActive')
            .Filter('isActive eq true')
            .Execute();
    }

    GetDepartmentPages(userprofileId: number): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query()
            .Select('UserProfileId')
            .Expand('UserPermissions($select=DepartmentId,UserId;$expand=Department($select=DepartmentId;$expand=Permissions($select=DepartmentId,PageId)))')
            .Filter(`UserProfileId eq ${userprofileId}`)
            .Execute();
    }

    GetAllUsers(): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query()
            .Select('UserProfileId,UserId,Name,Email,EmployeeId,MainContact,AlternateContact,isActive,ActiveFlag,isVolunteered,PassportNumber,PassportValidity,Nationality,Gender,VisaRecords,VoluterPreferenceRecords,TrainingDetails,NOKDetails')
            .OrderBy('Name')
            .Top('200')
            .Execute();
    }

    GetAllInvalidRecords(): Observable<ResponseModel<InvalidUserProfileModel>> {
        return this._dataServiceInvalidRecords.Query()
            .Select('UserId,Name,Email,EmployeeId,DepartmentName,MainContact,AlternateContact,PassportDetails,Nationality,Gender,VisaDetails,TrainingDetails,NOKDetails,ErrorReason')
            .OrderBy('Name')
            .Execute();
    }

    CheckUserHasPermission(userProfileId: number): Observable<boolean> {
        return this._checkPermissionService.SimpleGet(`/${userProfileId}`)
            .Execute()
            .map((response: any) => {
                debugger;
                return response as boolean;
            });
    }
}