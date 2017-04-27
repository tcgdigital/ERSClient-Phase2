import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IncidentModel } from '../incident';
import { IArchiveListService } from './IArchiveListService';
import { ArchiveDashboardListModel } from "./archive.dashboard.list.model";
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../shared';

@Injectable()
export class ArchiveListService extends ServiceBase<IncidentModel> implements IArchiveListService {

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Incidents');

    }

    public GetAllClosedIncidents(): Observable<ResponseModel<IncidentModel>> {
        return this._dataService.Query()
        .Expand('EmergencyType')
        .Filter(`ClosedOn ne null`)
        .Execute();
    }

}