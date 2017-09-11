import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CommunicationLogModel } from './communicationlog.model';
import { ICommunicationLogService } from './ICommunicationLogService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../../shared';


@Injectable()
export class CommunicationLogService extends ServiceBase<CommunicationLogModel> implements ICommunicationLogService {
   
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Communications');
        const option: DataProcessingService = new DataProcessingService();
    }

    CreateCommunicationLog(communicationLogModel: CommunicationLogModel): Observable<CommunicationLogModel> {
        return this._dataService.Post(communicationLogModel)
            .Execute()
            .map((data: CommunicationLogModel) => {
                return data;
            });
    }

    GetLogByAffectedPersonId(affectedPersonId: number): Observable<ResponseModel<CommunicationLogModel>> {
        return this._dataService.Query()
            .Filter(`AffectedPersonId eq ${affectedPersonId}`)
            .OrderBy('CreatedOn desc')
            .Execute();
    }

}