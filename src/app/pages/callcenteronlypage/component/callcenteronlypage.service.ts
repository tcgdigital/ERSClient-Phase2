import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ExternalInputModel, PDAEnquiryModel } from './callcenteronlypage.model';
import { ICallCenterService } from './ICallCenterService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';
import {
    FlightModel, FlightService, InvolvePartyModel
} from '../../shared.components';

@Injectable()
export class CallCenterOnlyPageService extends ServiceBase<ExternalInputModel> implements ICallCenterService {
    private _dataServiceForPDAEnquiry: DataService<PDAEnquiryModel>;

    /**
     *Creates an instance of CallCenterOnlyPageService.
     * @param {DataServiceFactory} dataServiceFactory
     * @memberof CallCenterOnlyPageService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'ExternalInputs');
        const option: DataProcessingService = new DataProcessingService();
        this._dataServiceForPDAEnquiry = this.dataServiceFactory.CreateServiceWithOptions<PDAEnquiryModel>('PDAEnquiries', option);
    }

    public GetPassengerAndCrewQueryByIncident(incidentId: number, callId: number): Observable<ResponseModel<ExternalInputModel>> {
        // let enquiryprojection = 'Queries,AffectedPersonId,AffectedObjectId,IsCallBack,IsTravelRequest,IsAdminRequest,EnquiryId';
        return this.CommonQueryExecution(incidentId, callId, 'AffectedPersonId', 'PDAEnquiry');
    }

    public GetCargoQueryByIncident(incidentId: number, callId: number): Observable<ResponseModel<ExternalInputModel>> {
        // const enquiryprojection = 'Queries,AffectedPersonId,AffectedObjectId,IsCallBack,IsTravelRequest,IsAdminRequest,EnquiryId';
        return this.CommonQueryExecution(incidentId, callId, 'AffectedObjectId', 'CargoEnquiry');
    }

    public GetGroundVictimQueryByIncident(incidentId: number, callId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonQueryExecution(incidentId, callId, 'GroundVictimId', 'GroundVictimEnquiry');
    }

    public GetMediaAndOtherQueryByIncident(IncidentId: number, CallId: number): Observable<ResponseModel<ExternalInputModel>> {
        const enquiryprojection = 'Queries,EnquiryId';
        return this._dataService.Query()
            .Filter(`IncidentId eq ${IncidentId} and ExternalInputId eq ${CallId}`)
            .Expand(`Caller,MediaAndOtherQuery,Enquiries($select=${enquiryprojection})`)
            .Execute();
    }

    public GetPassengerQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Passenger', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetPassengerQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Passenger', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship),PDAEnquiry($select=AffectedPersonId)`);
    }

    public GetCrewQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Crew', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetCrewQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Crew', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship),Enquiries($select=AffectedPersonId)`);
    }

    public GetCargoQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Cargo', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetCargoQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Cargo', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship),Enquiries($select=AffectedObjectId)`);
    }

    public GetOtherQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Others', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetOtherQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Others', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public updatepdaenquiry(entity: PDAEnquiryModel, key?: number): Observable<PDAEnquiryModel> {
        return this._dataServiceForPDAEnquiry.Patch(entity, key.toString()).Execute();
    }

    public GetMediaQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Media', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetMediaQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'Media', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetFutureTravelCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'FutureTravel', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetFutureTravelCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'FutureTravel', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetGeneralUpdateCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'GeneralUpdate', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetGeneralUpdateCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'GeneralUpdate', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetSituationalUpdatesCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'SituationalUpdates', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetSituationalUpdatesCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'SituationalUpdates', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetCustomerDissatisfactionCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'CustomerDissatisfaction', false,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetCustomerDissatisfactionCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'CustomerDissatisfaction', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship)`);
    }

    public GetGroundVictimCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'GroundVictim', false);
    }

    public GetGroundVictimCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>> {
        return this.CommonCallsExecution(IncidentId, 'GroundVictim', true,
            `Caller($select=FirstName,LastName,ContactNumber,Relationship),Enquiries($select=GroundVictimId)`);
    }

    private CommonCallsExecution(incidentId: number, enquiryType: string, isCallRecieved: boolean, expand: string = 'Caller'):
        Observable<ResponseModel<ExternalInputModel>> {
        const callRecieved: string = (isCallRecieved) ? 'true' : 'false';
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'${enquiryType}' and IsCallRecieved eq ${callRecieved}`)
            .Select(`ExternalInputId,EnquiryType`)
            .Expand(expand)
            .Execute();
    }

    private CommonQueryExecution(incidentId: number, callId: number, projectionId: string, expandType: string):
        Observable<ResponseModel<ExternalInputModel>> {
        // let enquiryprojection = 'Queries,AffectedPersonId,AffectedObjectId,IsCallBack,IsTravelRequest,IsAdminRequest,EnquiryId';
        let enquiryprojection: string = `Queries,${projectionId},IsCallBack,IsTravelRequest,IsAdminRequest,EnquiryId`;
        let enquiryFilter: string = `ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`;
        let comLogFilter: string = `ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and DemandId eq null`;
        let comLogExpansion: string = `CommunicationLogs($select=InteractionDetailsId;$filter=${comLogFilter})`;

        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and ExternalInputId eq ${callId} `)
            .Expand(`Caller,${expandType},Enquiries($select=${enquiryprojection};$filter=${enquiryFilter};$expand=${comLogExpansion})`)
            .Execute();
    }
}