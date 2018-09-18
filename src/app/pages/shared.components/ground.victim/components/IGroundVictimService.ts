import { IServiceInretface, ResponseModel } from "../../../../shared";
import { GroundVictimModel } from "./ground.victim.model";
import { Observable } from "rxjs";

export interface IGroundVictimService extends IServiceInretface<GroundVictimModel> {
    GetAllGroundVictimsByIncident(incidentId: number): Observable<GroundVictimModel>;
}