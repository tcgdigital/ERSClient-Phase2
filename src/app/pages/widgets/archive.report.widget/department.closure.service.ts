import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DepartmentClosureModel } from './archive.report.widget.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';


@Injectable()
export class DepartmentClosureService {
    private _dataService: DataService<DepartmentClosureModel>;

    /**
     * Creates an instance of BroadcastWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf BroadcastWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentClosureModel>('DepartmentClosures', option);
    }

    public GetAllByIncident(incidentId:number):Observable<ResponseModel<DepartmentClosureModel>>{
        return this._dataService.Query()
        .Expand('Department')
        .Filter(`IncidentId eq ${incidentId}`)
        .Execute();
    }

    
}