import { Observable } from 'rxjs/Rx';
import { CommunicationLogModel } from './communicationlog.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface ICommunicationLogService extends IServiceInretface<CommunicationLogModel> {

    CreateCommunicationLog(communicationLogModel: CommunicationLogModel): Observable<CommunicationLogModel>;

    GetLogByAffectedPersonId(affectedPersonId: number): Observable<ResponseModel<CommunicationLogModel>>;
   
}