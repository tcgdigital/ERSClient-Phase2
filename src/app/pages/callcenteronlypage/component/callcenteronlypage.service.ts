import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ExternalInputModel } from './callcenteronlypage.model';
import { ICallCenterService } from './ICallCenterService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';
import { DepartmentService, EmergencyTypeService } from '../../masterdata';
import {
    FlightModel, FlightService, InvolvePartyModel
} from '../../shared.components';
import { AffectedModel } from "../../shared.components/affected/components/affected.model";

@Injectable()
export class CallCenterOnlyPageService extends ServiceBase<ExternalInputModel> implements ICallCenterService {
   
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'ExternalInputs');
        const option: DataProcessingService = new DataProcessingService();
    }

    public GetPassengerQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq 
        CMS.DataModel.Enum.EnquiryType'Passenger' and IsCallRecieved eq false`)
            .Expand('Caller').Execute();
    }

    
    public GetPassengerQueryByIncident(IncidentId: number, CallId : Number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and ExternalInputId eq ${CallId}`)
            .Expand('Caller,PDAEnquiry').Execute();
    }

     public GetPassengerQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq 
        CMS.DataModel.Enum.EnquiryType'Passenger' and IsCallRecieved eq true`)
            .Expand('Caller').Execute();
    }

    public GetCargoQueryByIncident(IncidentId: number, CallId : Number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and ExternalInputId eq ${CallId}`)
            .Expand('Caller,CargoEnquiryModel').Execute();
    }

    public GetOtherQueryByIncident(IncidentId: number, CallId : Number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and ExternalInputId eq ${CallId}`)
            .Expand('Caller,MediaAndOtherQueryModel').Execute();
    }
}