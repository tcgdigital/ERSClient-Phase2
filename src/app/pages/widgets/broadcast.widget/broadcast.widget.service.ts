import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { BroadcastWidgetModel } from './broadcast.widget.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';


@Injectable()
export class BroadcastWidgetService {
    private _dataService: DataService<BroadcastWidgetModel>;

    /**
     * Creates an instance of BroadcastWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf BroadcastWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<BroadcastWidgetModel>('Broadcasts', option);
    }

    /**
     * Get Latest Broadcasts (Top 3) By Incident And Department
     * 
     * @param {number} departmentId 
     * @param {number} incidentId 
     * @returns {Observable<BroadcastWidgetModel[]>} 
     * 
     * @memberOf BroadcastWidgetService
     */
    GetLatestBroadcastsByIncidentAndDepartment(departmentId: number, incidentId: number): Observable<BroadcastWidgetModel[]> {
        let initiateDepartmentProjection: string = 'DepartmentId,DepartmentName,Description,ContactNo';
        let boradcastProjection: string = 'BroadcastId,Message,InitiateDepartmentId,IncidentId,IsSubmitted,SubmittedBy,SubmittedOn,CreatedOn,ActiveFlag,CreatedBy,UpdatedOn,Priority';
        return this._dataService.Query()
            .Expand(`InitiateDepartment($select= ${initiateDepartmentProjection})`)
            .Filter(`IncidentId eq ${incidentId} and IsSubmitted eq true and DepartmentBroadcasts/any(x: x/DepartmentId eq ${departmentId})`)
            .OrderBy(`Priority,SubmittedOn desc`).Top(`3`).Select(boradcastProjection)
            .Execute().map(x=>x.Records);
    }

     /**
      * Get All Published Broadcasts By Incident
      * 
      * @param {number} incidentId 
      * @returns {Observable<BroadcastWidgetModel[]>} 
      * 
      * @memberOf BroadcastWidgetService
      */
     GetAllPublishedBroadcastsByIncident(incidentId: number): Observable<BroadcastWidgetModel[]> {
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
            .Execute()
            .map(x=>x.Records);
    }
}