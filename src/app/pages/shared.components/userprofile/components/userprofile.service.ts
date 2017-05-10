import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserProfileModel } from './userprofile.model';
import { IUserProfileService } from './IUserProfileService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';


@Injectable()
export class UserProfileService  extends ServiceBase<UserProfileModel>  implements IUserProfileService {

    /**
     * Creates an instance of MediaQueryService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf MediaQueryService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'UserProfiles');
    }


}