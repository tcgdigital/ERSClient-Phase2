import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserProfileModel } from './userProfile.model';
import { ServiceBase, DataServiceFactory, ResponseModel } from '../../../../shared';
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
    constructor(dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'UserProfiles');
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
}