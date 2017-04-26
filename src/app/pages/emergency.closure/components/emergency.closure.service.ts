import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';
import { ReportPath } from './emergency.closure.model';


@Injectable()
export class EmergencyClosureService {
    private _bulkDataService: DataService<any>;
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<any>
            ('EmergencyClosure', 'EmergencyClosureNotificationEmail', option);
    }

    sendNotificationToDepartmentHOD(entities: any[]): Observable<any> {

        return this._bulkDataService.BulkPost(entities).Execute();
    }

    GetEmergencyClosureDocumentPDFPath(incidentId: number): Observable<ReportPath> {
        let option = new DataProcessingService();
        let _reportService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<ReportPath>
            ('Report', `GenerateReportForMailAttachment/${incidentId}`, option);
        return _reportService.Get(incidentId.toString())
            .Execute();
    }

}