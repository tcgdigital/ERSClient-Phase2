import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { ActionableStatusLogModel } from "./actionablestatuslog.model";
import {
    ServiceBase,
    ResponseModel,
    DataServiceFactory
} from '../../../../shared';


@Injectable()

export class ActionableStatusLogService extends ServiceBase<ActionableStatusLogModel> {

    /**
     * Creates an instance of AffectedService.
     * @param {DataServiceFactory} dataServiceFactory 
     * @param {InvolvePartyService} involvedPartyService 
     * 
     * @memberOf AffectedService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
            super(dataServiceFactory, 'ActionableStatusLogs');
    }

    GetAll(): Observable<ResponseModel<ActionableStatusLogModel>> {
        return this._dataService.Query()
            .Expand('Incident,CheckList,Actionable')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllByIncident(incidentId:number): Observable<ResponseModel<ActionableStatusLogModel>> {
        return this._dataService.Query()
            .Expand('Incident,CheckList,Actionable')
            .Filter(`IncidentId eq ${incidentId}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllByIncidentDepartment(incidentId:number,departmentId:number): Observable<ResponseModel<ActionableStatusLogModel>> {
        return this._dataService.Query()
            .Expand("Actionable")
            .Filter(`Actionable/DepartmentId eq ${departmentId} and IncidentId eq ${incidentId}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }
}