import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentClosureModel } from './department.closure.model';
import { IDepartmentClosureService } from './IDepartmentClosureService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';


@Injectable()
export class DepartmentClosureService extends ServiceBase<DepartmentClosureModel> implements IDepartmentClosureService {

    private _departmentClosureService: DataService<DepartmentClosureModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'DepartmentClosures');
        let option = new DataProcessingService();
    }


    GetAllByIncident(incidentId: number): Observable<ResponseModel<DepartmentClosureModel>> {
        return this._dataService.Query()
            .Expand("Department")
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }

    getAllbyIncidentandDepartment(incidentId, departmentId): Observable<ResponseModel<DepartmentClosureModel>> {
        return this._dataService.Query()
            .Select('ClosureReport,ClosureRemark')
            .Filter(`IncidentId eq ${incidentId}  and DepartmentId eq ${departmentId}`)
            .Execute();
    }
}