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
    // private _dataService: DataService<DemandTypeModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'DemandTypes');
        // let option: DataProcessingService = new DataProcessingService();
        // this._dataService = this.dataServiceFactory
        //     .CreateServiceWithOptions<DemandTypeModel>('DemandTypes', option);
    }

    GetAll(): Observable<ResponseModel<DemandTypeModel>> {
        return this._dataService.Query()
            .Expand('ApproverDepartment($select=DepartmentName , DepartmentId)')
            .Execute();
    }

    GetAllApproverDepartment(): Observable<NameValue<number>[]> {

        return this.GetAll()
            .map(x => x.Records)
            .map(x => {
                let approverDepartments: NameValue<number>[] = [];
                x.forEach(y => {
                    if (y.ApproverDepartment && approverDepartments.find(z => { return z.Value === y.ApproverDepartment.DepartmentId }) == null) {
                        approverDepartments.push(new NameValue<number>(y.ApproverDepartment.DepartmentName, y.ApproverDepartment.DepartmentId));
                    }
                })
                return approverDepartments;
            })
    }

    GetQuery(query: string): Observable<ResponseModel<DemandTypeModel>> {
        return this._dataService.Query()
            .Filter(query)
            .Expand('ApproverDepartment($select=DepartmentName , DepartmentId)')
            .Execute();
    }

    // Get(id: string | number): Observable<DemandTypeModel> {
    //     return this._dataService.Get(id.toString()).Execute();
    // }

    // Create(entity: DemandTypeModel): Observable<DemandTypeModel> {
    //     return this._dataService.Post(entity).Execute();
    // }

    // CreateBulk(entities: DemandTypeModel[]): Observable<DemandTypeModel[]> {
    //     return Observable.of(entities);
    // }

    // Update(entity: DemandTypeModel): Observable<DemandTypeModel> {
    //     let key: string = entity.DemandTypeId.toString()
    //     return this._dataService.Patch(entity, key)
    //         .Execute();
    // }

    // Delete(entity: DemandTypeModel): void {
    // }
}