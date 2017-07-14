import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ChecklistTrailModel } from './checklist.trail.model';
import {
    ResponseModel, DataService, DataServiceFactory,
    DataProcessingService, IServiceInretface,
    RequestModel, WEB_METHOD, GlobalConstants, ICompletionStatusType,
    ServiceBase, BaseModel, UtilityService
} from '../../../../shared';

@Injectable()
export class ChecklistTrailService
    extends ServiceBase<ChecklistTrailModel> {
        private _batchDataService: DataService<ChecklistTrailModel>;
    /**
     * Creates an instance of BroadcastService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf BroadcastService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'ChecklistTrails');
         let option: DataProcessingService = new DataProcessingService();

        option = new DataProcessingService();
        option.EndPoint = GlobalConstants.BATCH;
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<ChecklistTrailModel>('', option);
    }

    CreateChecklistTrail(checklistTrailModel:ChecklistTrailModel): Observable<ChecklistTrailModel> {
        return this._dataService.Post(checklistTrailModel)
            .Execute()
            .map((data: ChecklistTrailModel) => {
                return data;
            });
    }

     public BatchOperation(data: any[]): Observable<ResponseModel<BaseModel>> {
        const requests: Array<RequestModel<BaseModel>> = [];
        data.forEach((x) => {
            requests.push(new RequestModel<any>
                (`/odata/ChecklistTrails`, WEB_METHOD.POST, x));
        });
        return this._batchDataService.BatchPost<BaseModel>(requests).Execute();
    }

    public GetTrailByActionableId(actionId: number): Observable<ResponseModel<ChecklistTrailModel>> {
        return this._dataService.Query()
            .Filter(`ActionId eq ${actionId}`)
            .Execute();
    }

    // Query(departmentId: number, incidentId: number): Observable<ResponseModel<ChecklistTrailModel>> {
    //     return this._dataService.Query()
    //         .Expand('DepartmentBroadcasts($expand=Department($select=DepartmentId,DepartmentName))')
    //         .Filter(`InitiateDepartmentId eq ${departmentId} and IncidentId eq ${incidentId}`)
    //         .Execute();
    // }

    // GetLatest(departmentId: number, incidentId: number): Observable<ResponseModel<BroadCastModel>> {
    //     let initiateDepartmentProjection: string = 'DepartmentId,DepartmentName,Description,ContactNo';
    //     let boradcastProjection: string = 'BroadcastId,Message,InitiateDepartmentId,IncidentId,IsSubmitted,SubmittedBy,SubmittedOn,CreatedOn,ActiveFlag,CreatedBy,UpdatedOn,Priority';

    //     return this._dataService.Query()
    //         .Expand(`InitiateDepartment($select= ${initiateDepartmentProjection})`)
    //         .Filter(`IncidentId eq ${incidentId} and IsSubmitted eq true and DepartmentBroadcasts/any(x: x/DepartmentId eq ${departmentId})`)
    //         .OrderBy(`Priority,SubmittedOn desc`).Top(`3`)
    //         .Select(boradcastProjection)
    //         .Execute();
    // }

    //  GetPublished(incidentId: number): Observable<ResponseModel<BroadCastModel>> {
    //     let initiateDepartmentProjection: string = 'DepartmentId,DepartmentName,Description,ContactNo';
    //     let departmentBroadcastsProjection: string = 'DepartmentBroadcastId';
    //     let departmentProjection: string = 'DepartmentId,DepartmentName,Description,ContactNo';
    //     let boradcastProjection: string = 'BroadcastId,Message,InitiateDepartmentId,IncidentId,IsSubmitted,SubmittedBy,SubmittedOn,CreatedOn,Priority';
    //     let expand: string = `InitiateDepartment($select= ${initiateDepartmentProjection}),DepartmentBroadcasts($select=${departmentBroadcastsProjection};$expand=Department($select=${departmentProjection}))`;

    //     return this._dataService.Query()
    //         .Expand(expand)
    //         .Filter(`IncidentId eq ${incidentId} and IsSubmitted eq true`)
    //         .OrderBy(`SubmittedOn desc`)
    //         .Select(boradcastProjection)
    //         .Execute();
    // }
}