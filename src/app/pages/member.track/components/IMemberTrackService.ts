import { Observable } from 'rxjs/Rx';
import { MemberCurrentEngagementModel,MemberEngagementTrackModel } from './member.track.model';
import { InvolvePartyModel } from '../../shared.components';
import { IServiceInretface, ResponseModel } from '../../../shared';

export interface IMemberTrackService extends IServiceInretface<MemberCurrentEngagementModel> {

    GetAllByIncidentDepartment(incidentId: number, departmentId: number): Observable<ResponseModel<MemberCurrentEngagementModel>>;

    CreateMemberTrack(memberTrackModel: MemberEngagementTrackModel): Observable<MemberEngagementTrackModel>;

    UpdateMemberTrack(memberTrackModel: MemberEngagementTrackModel,key: number): Observable<MemberEngagementTrackModel>;

    GetAllHistory(userId : number,departmentId : number,incidentId:number) : Observable<ResponseModel<MemberEngagementTrackModel>>;

}