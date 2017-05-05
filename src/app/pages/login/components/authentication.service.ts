import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AuthRequestModel, AuthResponseModel } from './auth.model';
import { GlobalConstants } from '../../../shared/constants';
import { UtilityService } from '../../../shared/services';

import {
    DataProcessingService,
    DataService,
    DataServiceFactory
} from '../../../shared/services';

@Injectable()
export class AuthenticationService {
    private _dataService: DataService<any>;
    private _isLoggedIn: boolean = false;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        option.EndPoint = GlobalConstants.TOKEN;
        this._dataService = this.dataServiceFactory.CreateServiceWithOptions('', option);
        this._isLoggedIn = !!UtilityService.GetFromSession(GlobalConstants.ACCESS_TOKEN);
    }

    Login(userid: string, passcode: string): Observable<AuthResponseModel> {
        const params: AuthRequestModel = {
            username: userid,
            password: passcode,
            grant_type: 'password',
            client_id: GlobalConstants.CLIENT_ID
        };
        return this._dataService.SimplePost(params)
            .Execute()
            .map((response: AuthResponseModel) => {
                UtilityService.SetToSession(response);
                this._isLoggedIn = true;
                return response;
            });
    }

    Logout() {
        UtilityService.RemoveFromSession(GlobalConstants.ACCESS_TOKEN);
        this._isLoggedIn = false;
    }

    isLoggedIn(): boolean {
        return this._isLoggedIn;
    }
}