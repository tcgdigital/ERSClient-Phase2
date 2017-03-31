import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { MediaReleaseWidgetModel } from './mediaRelease.widget.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';

@Injectable()
export class MediaReleaseWidgetService {
     private _dataService: DataService<MediaReleaseWidgetModel>;

     /**
      * Creates an instance of MediaReleaseWidgetService.
      * @param {DataServiceFactory} dataServiceFactory 
      * 
      * @memberOf MediaReleaseWidgetService
      */
     constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<MediaReleaseWidgetModel>('Mediaqueries', option);
    }

    /**
     * Get All Media Release By Incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<MediaReleaseWidgetModel[]>} 
     * 
     * @memberOf MediaReleaseWidgetService
     */
    GetAllMediaReleaseByIncident(incidentId: number): Observable<MediaReleaseWidgetModel[]> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and IsPublished eq true and PublishedOn ne null`)
            .OrderBy(`PublishedOn desc`)
            .Execute()
            .map(x => x.Records);
    }
}