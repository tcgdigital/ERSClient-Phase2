import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ArchiveDocumentTypeModel } from '../../widgets/archive.upload.widget';

import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';


@Injectable()
export class ArchiveDocumentTypeService {
    private _dataService: DataService<ArchiveDocumentTypeModel>;

    /**
     * Creates an instance of BroadcastWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf BroadcastWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<ArchiveDocumentTypeModel>('ArchieveDocumentTypes', option);
    }

    public GetByIncident(incidentId:number):Observable<ResponseModel<ArchiveDocumentTypeModel>>{
        return this._dataService.Query()
        .Filter(`IncidentId eq ${incidentId}`)
        .Execute();
    }

    
}