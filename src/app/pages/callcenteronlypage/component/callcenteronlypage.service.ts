import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ExternalInputModel, PDAEnquiryModel } from './callcenteronlypage.model';
import { ICallCenterService } from './ICallCenterService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';
import { DepartmentService, EmergencyTypeService } from '../../masterdata';
import {
    FlightModel, FlightService, InvolvePartyModel
} from '../../shared.components';
import { AffectedModel } from '../../shared.components/affected/components/affected.model';

@Injectable()
export class CallCenterOnlyPageService extends ServiceBase<ExternalInputModel> implements ICallCenterService {
    private _dataServiceForPDAEnquiry: DataService<PDAEnquiryModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'ExternalInputs');
        const option: DataProcessingService = new DataProcessingService();
        this._dataServiceForPDAEnquiry = this.dataServiceFactory.CreateServiceWithOptions<PDAEnquiryModel>('PDAEnquiries', option);

    }

    public GetPassengerQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Passenger' and IsCallRecieved eq false`)
            .Expand('Caller').Execute();
    }

    public GetPassengerQueryByIncident(IncidentId: number, CallId: number): Observable<ResponseModel<ExternalInputModel>> {
        let enquiryprojection = 'Queries,AffectedPersonId,AffectedObjectId,IsCallBack,IsTravelRequest,IsAdminRequest,EnquiryId';
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and ExternalInputId eq ${CallId} `)
        .Expand(`Caller,PDAEnquiry,Enquiries($select=${enquiryprojection};$filter=ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active';$expand=CommunicationLogs($select=InteractionDetailsId;$filter=ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and DemandId eq null))`).Execute();

    }

    public GetPassengerQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Passenger' and IsCallRecieved eq true`)
            .Expand('Caller').Execute();
    }

    public GetCrewQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew' and IsCallRecieved eq false`)
            .Expand('Caller').Execute();
    }

    public GetCrewQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew' and IsCallRecieved eq true`)
            .Expand('Caller').Execute();
    }

    public GetCargoQueryByIncident(IncidentId: number, CallId: number): Observable<ResponseModel<ExternalInputModel>> {
        const enquiryprojection = 'Queries,AffectedPersonId,AffectedObjectId,IsCallBack,IsTravelRequest,IsAdminRequest,EnquiryId';
        return this._dataService.Query().Filter(`IncidentId eq ${IncidentId} and ExternalInputId eq ${CallId}`)
            .Expand(`Caller,CargoEnquiry,Enquiries($select=${enquiryprojection}; $expand=CommunicationLogs($select=InteractionDetailsId;$filter=ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and DemandId eq null))`)
            .Execute();
    }

    public GetCargoQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Cargo' and IsCallRecieved eq false`)
            .Expand('Caller')
            .Execute();
    }

    public GetCargoQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Cargo' and IsCallRecieved eq true`)
            .Expand('Caller')
            .Execute();
    }

    public GetMediaAndOtherQueryByIncident(IncidentId: number, CallId: number): Observable<ResponseModel<ExternalInputModel>> {
        const enquiryprojection = 'Queries,EnquiryId';
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and ExternalInputId eq ${CallId}`)
            .Expand(`Caller,MediaAndOtherQuery,Enquiries($select=${enquiryprojection})`).Execute();
    }

    public GetOtherQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Others' and IsCallRecieved eq false`)
            .Expand('Caller')
            .Execute();
    }

    public GetOtherQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Others' and IsCallRecieved eq true`)
            .Expand('Caller')
            .Execute();
    }

    public updatepdaenquiry(entity: PDAEnquiryModel, key?: number): Observable<PDAEnquiryModel> {
        return this._dataServiceForPDAEnquiry.Patch(entity, key.toString()).Execute();
    }

    public GetMediaQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Media' and IsCallRecieved eq false`)
            .Expand('Caller')
            .Execute();
    }

    public GetMediaQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Media' and IsCallRecieved eq true`)
            .Expand('Caller')
            .Execute();
    }


    public GetFutureTravelCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'FutureTravel' and IsCallRecieved eq false`)
            .Expand('Caller')
            .Execute();
    }

    public GetFutureTravelCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'FutureTravel' and IsCallRecieved eq true`)
            .Expand('Caller')
            .Execute();
    }


    public GetGeneralUpdateCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'GeneralUpdate' and IsCallRecieved eq false`)
            .Expand('Caller')
            .Execute();
    }

    public GetGeneralUpdateCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'GeneralUpdate' and IsCallRecieved eq true`)
            .Expand('Caller')
            .Execute();
    }

    public GetSituationalUpdatesCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'SituationalUpdates' and IsCallRecieved eq false`)
            .Expand('Caller')
            .Execute();
    }

    public GetSituationalUpdatesCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'SituationalUpdates' and IsCallRecieved eq true`)
            .Expand('Caller')
            .Execute();
    }

    public GetCustomerDissatisfactionCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'CustomerDissatisfaction' and IsCallRecieved eq false`)
            .Expand('Caller')
            .Execute();
    }

    public GetCustomerDissatisfactionCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'CustomerDissatisfaction' and IsCallRecieved eq true`)
            .Expand('Caller')
            .Execute();
    }
}