import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedModel } from '../../affected';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, UtilityService
} from '../../../../shared';

@Injectable()
export class AffectedPeopleService {
    private _dataService: DataService<InvolvePartyModel>;
    private _dataServiceAffectedPeople: DataService<AffectedPeopleModel>;
    private _bulkDataService: DataService<AffectedPeopleModel>;
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvePartyModel>('InvolvedParties', option);
        this._dataServiceAffectedPeople = this.dataServiceFactory
            .CreateServiceWithOptions<AffectedPeopleModel>('AffectedPeople', option);
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<AffectedPeopleModel>('AffectedPersonBatch', option);
    }

    GetAll(): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Expand('Affecteds($expand=AffectedPeople($expand=Passenger))')
            .Execute();
    }
    GetFilterByIncidentId(IncidentId): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}`)
            .Expand('Affecteds($expand=AffectedPeople($expand=Passenger,Crew))')
            .Execute();
    }

    FlattenAffectedPeople(involvedParty: InvolvePartyModel): any {
        let affectedPeopleForView: AffectedPeopleToView[];
        let affectedPeople: AffectedPeopleModel[];
        let affected: AffectedModel;
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
            item.ContactNumber = dataItem.Passenger != null ? (dataItem.Passenger.ContactNumber == null ? 'NA' : dataItem.Passenger.ContactNumber) : (dataItem.Crew.ContactNumber == null ? 'NA' : dataItem.Crew.ContactNumber);
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
        return affectedPeopleForView;

    }

    Get(id: string | number): Observable<InvolvePartyModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: InvolvePartyModel): Observable<InvolvePartyModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: AffectedPeopleModel[]): Observable<AffectedPeopleModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    Update(entity: AffectedPeopleModel, key): Observable<AffectedPeopleModel> {
        return this._dataServiceAffectedPeople.Patch(entity, key)
            .Execute();
    }

    Delete(entity: InvolvePartyModel): void {
    }

    MapAffectedPeople(affectedPeopleForVerification) {
        let verifiedAffectedPeople: AffectedPeopleModel[];
        verifiedAffectedPeople = affectedPeopleForVerification.map(function (affected) {
            let item = new AffectedPeopleModel;
            item.AffectedPersonId = affected.AffectedPersonId;
            item.IsVerified = affected.IsVerified;
            item.UpdatedBy = 1;
            item.UpdatedOn = new Date();
            item.ActiveFlag = 'Active';
            item.CreatedBy = 1;
            item.CreatedOn = new Date();
            return item;
        });
        return verifiedAffectedPeople;

    }
}
