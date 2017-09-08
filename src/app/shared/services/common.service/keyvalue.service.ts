import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import {    
    DataServiceFactory,
    ServiceBase
} from '../data.service';
import { ResponseModel } from "../../../shared";
import { KeyValueModel } from "../../models/keyvalue.model";

@Injectable()
export class KeyValueService extends ServiceBase<KeyValueModel>{
    /**
     * Creates an instance of FileStoreService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf FileStoreService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'KeyValues');
    }
    public GetValue(key: string): Observable<ResponseModel<KeyValueModel>>{
        return this._dataService.Query().Filter(`Key eq '${key}'`)
        .Execute()
    }

}