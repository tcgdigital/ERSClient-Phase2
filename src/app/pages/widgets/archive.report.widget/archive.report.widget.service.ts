import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ArchiveReportWidgetModel } from './archive.report.widget.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';


@Injectable()
export class ArchiveReportWidgetService {
    private _dataService: DataService<ArchiveReportWidgetModel>;

    /**
     * Creates an instance of BroadcastWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf BroadcastWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<ArchiveReportWidgetModel>('Broadcasts', option);
    }

    
}