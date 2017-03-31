import { Observable } from 'rxjs/Rx';

import { EnquiryModel, QueryModel } from './call.centre.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IEnquiryService extends IServiceInretface<EnquiryModel> {
    MapQuery(enquiryModel: EnquiryModel[]): QueryModel[];

    getOtherQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>>;

    getCrewQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>>;

    getMediaQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>>;

    GetEnquiredAffectedPeopleCount(incidentId: number): Observable<number>;

    GetEnquiredAffectedCrewCount(incidentId: number): Observable<number>;
}