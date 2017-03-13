import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { PresidentMessageModel } from './presidentMessage.model';
import { IPresidentMessageService } from './IPresidentMessageService'
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';


@Injectable()
export class PresidentMessageService
    extends ServiceBase<PresidentMessageModel>
    implements IPresidentMessageService {

    /**
     * Creates an instance of PresidentMessageService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf PresidentMessageService
     */
    constructor(dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'PresidentsMessages')
    }

    /**
     * Get President Messages of selected department and incident
     * 
     * @param {number} departmentId 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<PresidentMessageModel>>} 
     * 
     * @memberOf PresidentMessageService
     */
    Query(departmentId: number, incidentId: number): Observable<ResponseModel<PresidentMessageModel>> {
        return this._dataService.Query()
            .Filter(`InitiateDepartmentId eq ${departmentId} and IncidentId eq ${incidentId}`)
            .Execute();
    }

    /**
     * Get latest President Messages of selected incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<PresidentMessageModel>>} 
     * 
     * @memberOf PresidentMessageService
     */
    GetLatest(incidentId: number): Observable<ResponseModel<PresidentMessageModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and IsPublished eq true`)
            .OrderBy(`PublishedOn desc`).Top(`1`).Execute();
    }

    /**
     * Get published President Messages of selected incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<PresidentMessageModel>>} 
     * 
     * @memberOf PresidentMessageService
     */
    GetPublished(incidentId: number): Observable<ResponseModel<PresidentMessageModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and IsPublished eq true`)
            .OrderBy(`PublishedOn desc`).Execute();
    }
}