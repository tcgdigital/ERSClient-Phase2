import { Observable } from 'rxjs/Rx';
import { CommunicationLogModel } from './communicationlog.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface ICommunicationLogService extends IServiceInretface<CommunicationLogModel> {
   
}