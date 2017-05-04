import { Observable } from 'rxjs/Rx';
import { IncidentModel } from '../incident';
import { IServiceInretface, ResponseModel } from '../../shared';

export interface IArchiveListService extends IServiceInretface<IncidentModel> {
}