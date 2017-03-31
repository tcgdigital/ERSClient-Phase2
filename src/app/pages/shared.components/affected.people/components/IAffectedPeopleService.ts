import { Observable } from 'rxjs/Rx';
import { IServiceInretface, ResponseModel } from '../../../../shared';
import { InvolvePartyModel } from '../../../shared.components';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';

export interface IAffectedPeopleService extends IServiceInretface<AffectedPeopleModel> {
    FlattenAffectedPeople(involvedParty: InvolvePartyModel): AffectedPeopleToView[];

    MapAffectedPeople(affectedPeopleForVerification): AffectedPeopleModel[];

    GetAffectedPeopleCount(incidentId: number): Observable<number>;

    GetAffectedCrewCount(incidentId: number): Observable<number>;

    FlattenAffectedPeople(involvedParty: InvolvePartyModel): any;
    
    CreateBulk(entities: AffectedPeopleModel[]): Observable<AffectedPeopleModel[]>;
}