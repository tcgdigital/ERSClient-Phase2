import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { DataService, DataServiceFactory, DataProcessingService } from '../../../../shared/services';
import { GlobalConstants } from '../../../../shared/constants';
import { ChangePasswordModel } from './change.password.model';
import { Observable } from 'rxjs/Observable';
import { AccountResponse } from '../../../../shared/models';


@Injectable()
export class ChangePasswordService {
    private _dataService: DataService<any>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        option.EndPoint = GlobalConstants.API;
        option.ExceptionHandler = this.AccountResponseExceptionHandler;

        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix('Accounts', 'ChangePassword', option);
    }

    AccountResponseExceptionHandler(error: Response): Observable<AccountResponse> {
        return Observable.of(JSON.parse(error.text()) as AccountResponse);
    }

    ChangePassword(changePasswordModel: ChangePasswordModel): Observable<AccountResponse> {
        return this._dataService.JsonPost(changePasswordModel)
            .Execute()
            .map((response: any) => {
                return response as AccountResponse;
            }).catch((error: any) => {
                return Observable.of(error as AccountResponse);
            });
    }
}