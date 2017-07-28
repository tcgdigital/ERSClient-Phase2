import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { MediaModel, MediaReleaseTemplate } from './media.model';
import { IMediaService } from './IMediaService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase, DataProcessingService
} from '../../../../shared';


@Injectable()
export class MediaService
    extends ServiceBase<MediaModel>
    implements IMediaService {

    /**
     * Creates an instance of MediaQueryService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf MediaQueryService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Mediaqueries');
    }

    /**
     * Get Media Quries of selected department and incident
     * 
     * @param {number} departmentId 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<MediaQueryModel>>} 
     * 
     * @memberOf MediaQueryService
     */
    Query(departmentId: number, incidentId: number): Observable<ResponseModel<MediaModel>> {
        return this._dataService.Query()
            // .Filter(`InitiateDepartmentId eq ${departmentId} and IncidentId eq ${incidentId}`)
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }

    /**
     * Get latest Media Quries of selected incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<MediaQueryModel>>} 
     * 
     * @memberOf MediaQueryService
     */
    GetLatest(incidentId: number): Observable<ResponseModel<MediaModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and IsPublished eq true`)
            .OrderBy('PublishedOn desc')
            .Top('1').Execute();
    }

    /**
     * Get published Media Quries of selected incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<MediaQueryModel>>} 
     * 
     * @memberOf MediaQueryService
     */
    GetPublished(incidentId: number): Observable<ResponseModel<MediaModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and IsPublished eq true`)
            .OrderBy('PublishedOn desc')
            .Execute();
    }

    GetContentFromTemplate(incidentId: number, departmentId: number, templateId: number): Observable<MediaReleaseTemplate> {
        let option = new DataProcessingService();
        let _templateService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<MediaReleaseTemplate>
            ('TemplateMediaPresident', `GetContentFromTemplate/${incidentId}/${departmentId}/${templateId}`, option);
        return _templateService.Get(incidentId.toString())
            .Execute();
    }
}