import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { DataService, DataServiceFactory, DataProcessingService } from '../../../shared/services';
import { GlobalConstants } from '../../../shared/constants/constants';
import { Observable } from 'rxjs/Observable';
import { AccountResponse } from '../../../shared/models';
import { ForgotPasswordModel } from './auth.model';

@Injectable()
export class ForgotPasswordService {
    private _dataService: DataService<any>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        option.EndPoint = GlobalConstants.API;
        option.SkipAuthentication = true;
        option.ExceptionHandler = this.AccountResponseExceptionHandler;

        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix('Accounts', 'ForgotPassword', option);
    }

    AccountResponseExceptionHandler(error: Response): Observable<AccountResponse> {
        return Observable.of(JSON.parse(error.text()) as AccountResponse);
    }

    ResetPassword(forgotPasswordModel: ForgotPasswordModel): Observable<AccountResponse> {
        return this._dataService.JsonPost(forgotPasswordModel)
            .Execute()
            .map((response: any) => {
                return response as AccountResponse;
            }).catch((error: any) => {
                return Observable.of(error as AccountResponse);
            });
    }
}