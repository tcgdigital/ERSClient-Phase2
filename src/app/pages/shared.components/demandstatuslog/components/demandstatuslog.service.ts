import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { DemandStatusLogModel } from "./demandstatuslog.model";
import {
    ServiceBase,
    ResponseModel,
    DataServiceFactory
} from '../../../../shared';


@Injectable()

export class DemandStatusLogService extends ServiceBase<DemandStatusLogModel> {

    
    constructor(private dataServiceFactory: DataServiceFactory) {
            super(dataServiceFactory, 'DemandStatusLogs');
    }

    GetAll(): Observable<ResponseModel<DemandStatusLogModel>> {
        return this._dataService.Query()
            .Expand('Incident,Demand')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllByIncident(incidentId:number): Observable<ResponseModel<DemandStatusLogModel>> {
        return this._dataService.Query()
            .Expand('Incident,Demand')
            .Filter(`IncidentId eq ${incidentId}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllByIncidentRequesterDepartment(incidentId:number,departmentId:number): Observable<ResponseModel<DemandStatusLogModel>> {
        return this._dataService.Query()
            .Expand("Demand,RequesterDepartment")
            .Filter(`RequesterDepartmentId eq ${departmentId} and IncidentId eq ${incidentId}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

     GetAllByIncidentTargetDepartment(incidentId:number,departmentId:number): Observable<ResponseModel<DemandStatusLogModel>> {
        return this._dataService.Query()
            .Expand("Demand,TargetDepartment")
            .Filter(`TargetDepartmentId eq ${departmentId} and IncidentId eq ${incidentId}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }


    

    
}