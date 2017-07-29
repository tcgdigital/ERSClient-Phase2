import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserProfileModel } from './userProfile.model';
import { InvalidUserProfileModel } from './invalid.userprofile.model'
import { ServiceBase, DataServiceFactory, ResponseModel, DataService, DataProcessingService } from '../../../../shared';
import { IUserProfileService } from './IUserProfileService';

@Injectable()
export class UserProfileService extends ServiceBase<UserProfileModel>
    implements IUserProfileService {

    /**
    * Creates an instance of UserProfileService.
    * @param {DataServiceFactory} dataServiceFactory 
    * 
    * @memberOf UserProfileService
    */
    private _dataServiceInvalidRecords: DataService<InvalidUserProfileModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'UserProfiles');

        let option: DataProcessingService = new DataProcessingService();
        this._dataServiceInvalidRecords = this.dataServiceFactory
            .CreateServiceWithOptions<InvalidUserProfileModel>('InvalidUserProfileRecords', option);
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

    GetForDirectory(): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query()
            .Select('UserProfileId,UserId,Name,MainContact,AlternateContact')
            .Filter('isActive eq true')
            .Execute();
    }

    GetDepartmentPages(userprofileId: number) : Observable<ResponseModel<UserProfileModel>>{
        return this._dataService.Query()
            .Select('UserProfileId')
            .Expand('UserPermissions($select=DepartmentId,UserId;$expand=Department($select=DepartmentId;$expand=Permissions($select=DepartmentId,PageId)))')
            .Filter(`UserProfileId eq ${userprofileId}`)
            .Execute();
    }

    GetAllUsers(): Observable<ResponseModel<UserProfileModel>>{
        return this._dataService.Query()
        .Select('UserId,Name,Email,EmployeeId,MainContact,AlternateContact,isActive,isVolunteered,PassportNumber,PassportValidity,Nationality,Gender,VisaRecords,VoluterPreferenceRecords,TrainingDetails,NOKDetails')
        //.Expand('VisaDetails, VolunterPreferences, TrainingRecords, NextOfKins')
        .Execute();
    }

    GetAllInvalidRecords(): Observable<ResponseModel<InvalidUserProfileModel>> {
        return this._dataServiceInvalidRecords.Query()
        .Execute();
    }
}