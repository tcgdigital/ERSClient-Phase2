import { Injectable } from "@angular/core";
import { IGroundVictimQueryService } from "./IGroundVictimQueryService";
import { ServiceBase, DataServiceFactory } from "../../../../shared";
import { GroundVictimQueryModel } from "../../../callcenteronlypage";


@Injectable()
export class GroundVictimQueryService
    extends ServiceBase<GroundVictimQueryModel>
    implements IGroundVictimQueryService {

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'GroundVictimEnquires');
    }
}