import { Observable } from 'rxjs/Rx';
import { AffectedPeopleModel, AffectedPeopleToView } from './affected.people.model';
import { } from '../../../shared.components';
import { IServiceInretface, ResponseModel } from '../../../../shared';
import { InvolvePartyModel } from '../../../shared.components';
import { CasualtySummeryModel } from '../../../widgets/casualty.summary.widget';


export interface IAffectedPeopleService extends IServiceInretface<AffectedPeopleModel> {
    FlattenAffectedPeople(involvedParty: InvolvePartyModel): AffectedPeopleToView[];

    MapAffectedPeople(affectedPeopleForVerification): AffectedPeopleModel[];

    GetAffectedPeopleCount(incidentId: number): Observable<number>;

    GetAffectedCrewCount(incidentId: number): Observable<number>;

    FlattenAffectedPeople(involvedParty: InvolvePartyModel): any;

    CreateBulk(entities: AffectedPeopleModel[]): Observable<AffectedPeopleModel[]>;

    GetDeceasedPeopleCount(incidentId: number): Observable<number>;

    GetReunitedPeopleCount(incidentId: number): Observable<number>;

    GetMinorInjuryPeopleCount(incidentId: number): Observable<number>;

    GetCriticalPeopleCount(incidentId: number): Observable<number>;

    GetImmediateCarePeopleCount(incidentId: number): Observable<number>;

    GetCasualtyStatus(incidentId: number): Observable<CasualtySummeryModel>;
}