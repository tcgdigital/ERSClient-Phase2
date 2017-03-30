import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BroadCastModel } from './broadcast.model';
import { IBroadcastService } from './IBroadcastService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';

@Injectable()
export class BroadcastService
    extends ServiceBase<BroadCastModel>
    implements IBroadcastService {

    /**
     * Creates an instance of BroadcastService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf BroadcastService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Broadcasts');
    }

    Query(departmentId: number, incidentId: number): Observable<ResponseModel<BroadCastModel>> {
        return this._dataService.Query()
            .Expand('DepartmentBroadcasts($expand=Department($select=DepartmentId,DepartmentName))')
            .Filter(`InitiateDepartmentId eq ${departmentId} and IncidentId eq ${incidentId}`)
            .Execute();
    }

    GetLatest(departmentId: number, incidentId: number): Observable<ResponseModel<BroadCastModel>> {
        let initiateDepartmentProjection: string = 'DepartmentId,DepartmentName,Description,ContactNo';
        let boradcastProjection: string = 'BroadcastId,Message,InitiateDepartmentId,IncidentId,IsSubmitted,SubmittedBy,SubmittedOn,CreatedOn,ActiveFlag,CreatedBy,UpdatedOn,Priority';

        return this._dataService.Query()
            .Expand(`InitiateDepartment($select= ${initiateDepartmentProjection})`)
            .Filter(`IncidentId eq ${incidentId} and IsSubmitted eq true and DepartmentBroadcasts/any(x: x/DepartmentId eq ${departmentId})`)
            .OrderBy(`Priority,SubmittedOn desc`).Top(`3`)
            .Select(boradcastProjection)
            .Execute();
    }

     GetPublished(incidentId: number): Observable<ResponseModel<BroadCastModel>> {
        let initiateDepartmentProjection: string = 'DepartmentId,DepartmentName,Description,ContactNo';
        let departmentBroadcastsProjection: string = 'DepartmentBroadcastId';
        let departmentProjection: string = 'DepartmentId,DepartmentName,Description,ContactNo';
        let boradcastProjection: string = 'BroadcastId,Message,InitiateDepartmentId,IncidentId,IsSubmitted,SubmittedBy,SubmittedOn,CreatedOn,Priority';
        let expand: string = `InitiateDepartment($select= ${initiateDepartmentProjection}),DepartmentBroadcasts($select=${departmentBroadcastsProjection};$expand=Department($select=${departmentProjection}))`;

        return this._dataService.Query()
            .Expand(expand)
            .Filter(`IncidentId eq ${incidentId} and IsSubmitted eq true`)
            .OrderBy(`SubmittedOn desc`)
            .Select(boradcastProjection)
            .Execute();
    }
}