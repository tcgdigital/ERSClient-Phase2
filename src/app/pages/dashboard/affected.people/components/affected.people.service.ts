import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { InvolvedPartyModel } from '../../InvolvedParty';
import { AffectedModel } from '../../affecteds';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, UtilityService
} from '../../../../shared';

@Injectable()
export class AffectedPeopleService {
    private _dataService: DataService<InvolvedPartyModel>;
    private _bulkDataService: DataService<AffectedPeopleModel>;
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvedPartyModel>('InvolvedParties', option);
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<AffectedPeopleModel>('AffectedPersonBatch', option);
    }

    GetAll(): Observable<ResponseModel<InvolvedPartyModel>> {
        return this._dataService.Query()
            .Expand('Affecteds($expand=AffectedPeople($expand=Passenger))')
            .Execute();
    }
    GetFilterByIncidentId(): Observable<ResponseModel<InvolvedPartyModel>> {
        return this._dataService.Query()
            .Filter('IncidentId eq ' + '88')
            .Expand('Affecteds($expand=AffectedPeople($expand=Passenger,Crew))')
            .Execute();
    }

    FlattenData(involvedParty: InvolvedPartyModel): any {
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
  
    Get(id: string | number): Observable<InvolvedPartyModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: InvolvedPartyModel): Observable<InvolvedPartyModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: AffectedPeopleModel[]): Observable<AffectedPeopleModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    Update(entity: InvolvedPartyModel): Observable<InvolvedPartyModel> {
        return Observable.of(entity);
    }

    Delete(entity: InvolvedPartyModel): void {
    }
}
