import { Observable } from 'rxjs/Rx';
import { InvolvePartyModel, AffectedModel, EnquiryModel } from '../../../shared.components';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import { ResponseModel, IServiceInretface, NameValue } from '../../../../shared';

export interface IAffectedObjectsService extends IServiceInretface<InvolvePartyModel> {
    GetFilterByIncidentId(incidentId): Observable<ResponseModel<InvolvePartyModel>>;

    FlattenAffactedObjects(involvedParty: InvolvePartyModel): AffectedObjectsToView[];

    MapAffectedPeopleToSave(affectedObjectsForVerification, userid: number): AffectedObjectModel[];

    CreateBulkObjects(entities: AffectedObjectModel[]): Observable<AffectedObjectModel[]>;

    GetCommunicationByAWB(id: number): Observable<ResponseModel<AffectedObjectModel>>;

    UpdateStatus(entity: AffectedObjectModel, key?: number): Observable<AffectedObjectModel>;

    UpdateStatusWithHeader(entity: AffectedObjectModel, key: number, header: NameValue<string>): Observable<AffectedObjectModel>;

    GetCallerListForAffectedObject(affectedObjectId: number): Observable<ResponseModel<EnquiryModel>>;
}