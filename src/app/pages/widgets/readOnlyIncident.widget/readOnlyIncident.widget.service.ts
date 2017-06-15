import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { IncidentModel } from "../../incident/components/incident.model";

import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';


@Injectable()
export class ReadOnlyIncidentWidgetService {
    private _dataService: DataService<IncidentModel>;

    /**
     * Creates an instance of PresidentMessageWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf PresidentMessageWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);
    }

    /**
     * Get All President Message By Incident Id
     * 
     * @param {number} incidentId 
     * @returns {Observable<PresidentMessageWidgetModel[]>} 
     * 
     * @memberOf PresidentMessageWidgetService
     */
    GetIncidentByIncidentId(incidentId: number): Observable<IncidentModel> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId}`)
            .Expand('InvolvedParties($expand=Flights)')
            .Execute()
            .map(x => x.Records[0]);
    }
   
}