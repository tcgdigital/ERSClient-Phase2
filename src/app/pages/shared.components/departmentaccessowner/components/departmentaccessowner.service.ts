import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DepartmentAccessOwnerModel } from './departmentaccessowner.model';
import { IDepartmentAccessOwnerService } from './IDepartmentAccessOwnerService';
import {
    ResponseModel, DataService, DataServiceFactory,
    DataProcessingService, IServiceInretface,
    RequestModel, WEB_METHOD, GlobalConstants,
    ServiceBase, BaseModel
} from '../../../../shared';

@Injectable()
export class DepartmentAccessOwnerService extends ServiceBase<DepartmentAccessOwnerModel> 
implements IDepartmentAccessOwnerService {
    private _batchDataService: DataService<DepartmentAccessOwnerModel>;
    
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'DepartmentAccessOwnerMappings');
        let option: DataProcessingService = new DataProcessingService();

        option = new DataProcessingService();
        option.EndPoint = GlobalConstants.BATCH;
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentAccessOwnerModel>('', option);
    }

    public GetDependentDepartmentAccessOwners(departmentId: number): Observable<ResponseModel<DepartmentAccessOwnerModel>> {
        return this._dataService.Query()
            .Expand('DepartmentOwner($select=DepartmentName)','DepartmentDependent($select=DepartmentName)')
            .Filter(`DepartmentOwnerId eq ${departmentId}`)
            .OrderBy('CreatedOn desc')
            .Execute();
    }

}