import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EnquiryModel } from './call.centre.model';
import {
    RequestModel,
    ResponseModel,
    BaseModel,
    WEB_METHOD,
    DataProcessingService,
    DataService,
    DataServiceFactory,
    GlobalConstants,
    IServiceInretface
} from '../../../../shared';

@Injectable()
export class EnquiryService implements IServiceInretface<EnquiryModel> {
    private _dataService: DataService<EnquiryModel>;
   // private _batchDataService: DataService<BaseModel>;

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<EnquiryModel>('Enquiries', option);
    }

    GetAll(): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query()           
            .Execute();
    }

    Get(id: string | number): Observable<EnquiryModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: EnquiryModel): Observable<EnquiryModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: EnquiryModel[]): Observable<EnquiryModel[]> {
        return Observable.of(entities);
    }

    Update(entity: EnquiryModel): Observable<EnquiryModel> {
        return Observable.of(entity);
    }

    Delete(entity: EnquiryModel): void {
    }

 }