import { Observable } from 'rxjs/Rx';
import { InvolvePartyModel, AffectedModel } from '../../../shared.components';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IAffectedObjectsService extends IServiceInretface<InvolvePartyModel> {
    GetFilterByIncidentId(incidentId): Observable<ResponseModel<InvolvePartyModel>>;

    FlattenAffactedObjects(involvedParty: InvolvePartyModel): AffectedObjectsToView[];

    MapAffectedPeopleToSave(affectedObjectsForVerification):AffectedObjectModel[];

    CreateBulkObjects(entities: AffectedObjectModel[]): Observable<AffectedObjectModel[]>;

    GetCommunicationByAWB(id: number): Observable<ResponseModel<AffectedObjectModel>>;
}