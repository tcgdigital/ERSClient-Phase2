import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { OrganizationModel } from './organization.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';


@Injectable()
export class OrganizationService {
    private _dataService: DataService<OrganizationModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<OrganizationModel>('Organizations', option);
    }

    GetAllOrganizations(): Observable<ResponseModel<OrganizationModel>> {
        return this._dataService.Query()
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllActiveOrganizations(): Observable<ResponseModel<OrganizationModel>> {
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }
   
}