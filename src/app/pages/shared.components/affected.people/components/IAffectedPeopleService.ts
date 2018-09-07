import { Observable } from 'rxjs/Rx';
import { AffectedPeopleModel, AffectedPeopleToView } from './affected.people.model';
import { } from '../../../shared.components';
import { IServiceInretface, ResponseModel } from '../../../../shared';
import { InvolvePartyModel } from '../../../shared.components';
import { CasualtySummeryModel } from '../../../widgets/casualty.summary.widget';


export interface IAffectedPeopleService extends IServiceInretface<AffectedPeopleModel> {
    FlattenAffectedPeople(involvedParty: InvolvePartyModel): AffectedPeopleToView[];

    MapAffectedPeople(affectedPeopleForVerification, userid: number): AffectedPeopleModel[];

    GetAffectedPeopleCount(incidentId: number): Observable<number>;

    GetAffectedCrewCount(incidentId: number): Observable<number>;

    FlattenAffectedPeople(involvedParty: InvolvePartyModel): any;

    CreateBulk(entities: AffectedPeopleModel[]): Observable<AffectedPeopleModel[]>;

    GetDeceasedPeopleCount(incidentId: number): Observable<number>;

    GetMissingPeopleCount(incidentId: number): Observable<number>;

    GetInjuredPeopleCount(incidentId: number): Observable<number>;

    GetUninjuredPeopleCount(incidentId: number): Observable<number>;

    GetOtherPeopleCount(incidentId: number): Observable<number>;

    GetCasualtyStatus(incidentId: number): Observable<CasualtySummeryModel>;

    GetCommunicationByPDA(id: number): Observable<ResponseModel<AffectedPeopleModel>>;

    GetCoPassangers(AffectedPersonId: number): Observable<ResponseModel<AffectedPeopleModel>>;

    GetCurrentCareMember(affectedPersonId: number, careMemberId: number)
        : Observable<ResponseModel<AffectedPeopleModel>>;

    GetAllAffectedPeopleIdsByIncidentId(incidentId: number)
        : Observable<ResponseModel<AffectedPeopleModel>>;
}