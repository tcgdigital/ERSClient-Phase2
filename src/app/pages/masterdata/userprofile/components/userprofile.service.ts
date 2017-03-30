import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { UserProfileModel } from './userProfile.model';
import { ServiceBase, DataServiceFactory } from '../../../../shared';

@Injectable()
export class UserProfileService extends ServiceBase<UserProfileModel>{

    /**
    * Creates an instance of UserProfileService.
    * @param {DataServiceFactory} dataServiceFactory 
    * 
    * @memberOf UserProfileService
    */
    constructor(dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'UserProfiles');
    }
}