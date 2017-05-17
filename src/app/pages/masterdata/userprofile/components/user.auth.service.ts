import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { GlobalConstants } from '../../../../shared/constants';
import { AccountResponse } from '../../../../shared/models';
import { DataService, DataServiceFactory, DataProcessingService } from '../../../../shared/services';
import { UserAuthenticationModel } from './userprofile.model';


@Injectable()
export class UserAuthService {
    private _dataService: DataService<any>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        option.EndPoint = GlobalConstants.API;
        option.ExceptionHandler = this.AccountResponseExceptionHandler;

        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix('Accounts', 'CreateUser', option);
    }

    AccountResponseExceptionHandler(error: Response): Observable<AccountResponse> {
        return Observable.of(JSON.parse(error.text()) as AccountResponse);
    }

    CreateUserAccess(userAuthenticationModel: UserAuthenticationModel): Observable<AccountResponse> {
        return this._dataService.JsonPost(userAuthenticationModel)
            .Execute()
            .map((response: any) => {
                return response as AccountResponse;
            }).catch((error: any) => {
                return Observable.of(error as AccountResponse);
            });
    }
}