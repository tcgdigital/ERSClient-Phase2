import { IServiceInretface, ResponseModel } from "../../../../shared";
import { CareMemberTrackerModel } from "./care.member.tracker.model";
import { Observable } from "rxjs";

export interface ICareMemberTrackerService extends IServiceInretface<CareMemberTrackerModel> {
    GetCareMembersByAffectedPersonId(incidentId: number, affectedPersonId: number): Observable<ResponseModel<CareMemberTrackerModel>>;

    GetCareMembersById(careMemberId: number) : Observable<ResponseModel<CareMemberTrackerModel>>;
}