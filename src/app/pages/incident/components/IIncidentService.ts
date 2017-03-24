
import { Observable } from 'rxjs/Rx';
import { IncidentModel } from './incident.model';
import { InvolvePartyModel } from '../../shared.components';
import { IServiceInretface, ResponseModel } from '../../../shared';

export interface IIncidentService extends IServiceInretface<IncidentModel> {

    CreateInvolveParty(entity: InvolvePartyModel): Observable<InvolvePartyModel>;
}