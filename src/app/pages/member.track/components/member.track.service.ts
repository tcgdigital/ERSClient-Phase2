import { Injectable } from '@angular/core';
import { MemberCurrentEngagementModel, MemberEngagementTrackModel } from "./member.track.model";
import { IMemberTrackService } from "./IMemberTrackService";
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from "../../../shared";

@Injectable()
export class MemberTrackService extends ServiceBase<MemberCurrentEngagementModel> implements IMemberTrackService {
    private _membertrackService: DataService<MemberEngagementTrackModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'MemberCurrentEngagements');
        const option: DataProcessingService = new DataProcessingService();
        this._membertrackService = dataServiceFactory
            .CreateService<MemberEngagementTrackModel>('MemberEngagementTracks');
    }

    public GetAllByIncidentDepartment(departmentId: number, incidentId: number): Observable<ResponseModel<MemberCurrentEngagementModel>> {
        return this._dataService.Query()
            .Expand("MemberEngagementTrack")
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }


    public CreateMemberTrack(memberTrackModel: MemberEngagementTrackModel): Observable<MemberEngagementTrackModel> {
        return this._membertrackService.Post(memberTrackModel).Execute();
    }
    public UpdateMemberTrack(memberTrackModel: MemberEngagementTrackModel, key: number): Observable<MemberEngagementTrackModel> {
        return this._membertrackService.Patch(memberTrackModel, key.toString()).Execute();
    }

    public GetAllHistory(userId: number, departmentId: number, incidentId: number): Observable<ResponseModel<MemberEngagementTrackModel>> {
        
        return this._membertrackService.Query()
            .Filter(`IncidentId eq ${incidentId} and UserId eq ${userId}`)
            .Expand('Department($select=DepartmentName)')
            .Execute();

    }
}