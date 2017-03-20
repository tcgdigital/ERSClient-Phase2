import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { PresidentMessageWidgetModel } from './presidentMessage.widget.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';


@Injectable()
export class PresidentMessageWidgetService {
    private _dataService: DataService<PresidentMessageWidgetModel>;

    /**
     * Creates an instance of PresidentMessageWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf PresidentMessageWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<PresidentMessageWidgetModel>('PresidentsMessages', option);
    }

    /**
     * Get All President Message By Incident Id
     * 
     * @param {number} incidentId 
     * @returns {Observable<PresidentMessageWidgetModel[]>} 
     * 
     * @memberOf PresidentMessageWidgetService
     */
    GetAllPresidentMessageByIncident(incidentId: number): Observable<PresidentMessageWidgetModel[]> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and IsPublished eq true and PublishedOn ne null`)
            .OrderBy(`PublishedOn desc`)
            .Execute()
            .map(x => x.Records);
    }
}