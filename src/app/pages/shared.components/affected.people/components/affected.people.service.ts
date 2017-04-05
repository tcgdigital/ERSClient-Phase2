import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel, AffectedModel } from '../../../shared.components';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { IAffectedPeopleService } from './IAffectedPeopleService';
import {
    ResponseModel, DataService, ServiceBase,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, UtilityService
} from '../../../../shared';

@Injectable()
export class AffectedPeopleService extends ServiceBase<AffectedPeopleModel>
    implements IAffectedPeopleService {

    private _dataServiceAffectedPeople: DataService<AffectedPeopleModel>;
    private _bulkDataService: DataService<AffectedPeopleModel>;

    /**
     * Creates an instance of AffectedPeopleService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf AffectedPeopleService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'AffectedPeople');
        let option: DataProcessingService = new DataProcessingService();

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<AffectedPeopleModel>('AffectedPersonBatch', option);
    }

    public FlattenAffectedPeople(involvedParty: InvolvePartyModel): any {
        let affectedPeopleForView: AffectedPeopleToView[];
        let affectedPeople: AffectedPeopleModel[];
        let affected: AffectedModel;
        if(involvedParty != null){
        affected = UtilityService.pluck(involvedParty, ['Affecteds'])[0][0];
        affectedPeople = UtilityService.pluck(affected, ['AffectedPeople'])[0];

        affectedPeopleForView = affectedPeople.map(function (dataItem) {
            let item = new AffectedPeopleToView();
            item.AffectedId = dataItem.AffectedId;
            item.AffectedPersonId = dataItem.AffectedPersonId,
                item.PassengerName = dataItem.Passenger != null ? dataItem.Passenger.PassengerName : '';
            item.Pnr = dataItem.Passenger != null ? (dataItem.Passenger.Pnr == null ? 'NA' : dataItem.Passenger.Pnr) : 'NA';
            item.CrewName = dataItem.Crew != null ? dataItem.Crew.CrewName : '';
            item.CrewNameWithCategory = dataItem.Crew != null ? dataItem.Crew.CrewName + '(' + dataItem.Crew.AsgCat + ')' : '';
            item.ContactNumber = dataItem.Passenger != null ? (dataItem.Passenger.ContactNumber == null ? 'NA' : dataItem.Passenger.ContactNumber) : (dataItem.Crew == null ? 'NA' : dataItem.Crew.ContactNumber);
            item.TicketNumber = dataItem.TicketNumber;
            item.IsVerified = dataItem.IsVerified;
            item.IsCrew = dataItem.IsCrew;
            item.IsStaff = dataItem.IsStaff != null ? dataItem.IsStaff : false;
            item.MedicalStatus = dataItem.MedicalStatus != null ? dataItem.MedicalStatus : 'NA';
            item.Remarks = dataItem.Remarks.trim() != null ? dataItem.Remarks : 'NA';
            item.Identification = dataItem.Identification != null ? dataItem.Identification : 'NA';
            item.SeatNo = dataItem.Passenger != null ? dataItem.Passenger.Seatno : 'No Seat Number Available';
            // item.CommunicationLogs: dataItem.CommunicationLogs,
            item.PaxType = dataItem.Passenger != null ? dataItem.Passenger.PassengerType : dataItem.Crew != null ? 'Crew' : '';
            return item;
        });
        }
        return affectedPeopleForView;

    }

    public CreateBulk(entities: AffectedPeopleModel[]): Observable<AffectedPeopleModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    public GetAffectedPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IsCrew eq false and Affected/InvolvedParty/IncidentId eq ${incidentId}`)
            .Execute();
    }

    public GetAffectedCrewCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IsCrew eq true and Affected/InvolvedParty/IncidentId eq ${incidentId}`)
            .Execute();
    }

    public MapAffectedPeople(affectedPeopleForVerification): AffectedPeopleModel[] {
        let verifiedAffectedPeople: AffectedPeopleModel[];
        verifiedAffectedPeople = affectedPeopleForVerification.map(function (affected) {
            let item = new AffectedPeopleModel();
            item.AffectedPersonId = affected.AffectedPersonId;
            item.IsVerified = affected.IsVerified;
            return item;
        });
        return verifiedAffectedPeople;
    }
}
