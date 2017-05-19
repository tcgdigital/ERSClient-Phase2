import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandTypeModel } from './demandtype.model';
import { IDemandTypeService } from './IDemandTypeService';
import { DepartmentModel } from '../../department';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, ServiceBase, NameValue
} from '../../../../shared';

@Injectable()
export class DemandTypeService extends ServiceBase<DemandTypeModel> implements IDemandTypeService {

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'DemandTypes');
    }

    GetAll(): Observable<ResponseModel<DemandTypeModel>> {
        return this._dataService.Query()
            .Expand('ApproverDepartment($select=DepartmentName , DepartmentId)')
            .Execute();
    }

    GetAllApproverDepartment(): Observable<Array<NameValue<number>>> {
        return this.GetAll()
            .map((x) => x.Records).map((x) => {
                const approverDepartments: Array<NameValue<number>> = new Array<NameValue<number>>();

                x.forEach((y) => {
                    if (y.ApproverDepartment && approverDepartments
                        .find((z) => z.Value === y.ApproverDepartment.DepartmentId) == null) {
                        approverDepartments.push(new NameValue<number>(y.ApproverDepartment.DepartmentName, y.ApproverDepartment.DepartmentId));
                    }
                });
                return approverDepartments;
            });
    }

    GetQuery(query: string): Observable<ResponseModel<DemandTypeModel>> {
        return this._dataService.Query()
            .Filter(query).Expand('ApproverDepartment($select=DepartmentName , DepartmentId)')
            .Execute();
    }
}