import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel, AffectedModel } from '../../../shared.components';
import { EnquiryModel } from '../../call.centre';
import { NextOfKinModel } from '../../nextofkins';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { PassengerModel } from '../../passenger/components';
import { IAffectedPeopleService } from './IAffectedPeopleService';
import { CasualtySummeryModel } from '../../../widgets/casualty.summary.widget/casualty.summary.widget.model';
import {
    ResponseModel, DataService, ServiceBase,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, UtilityService
} from '../../../../shared';
import * as moment from 'moment/moment';
import { CountOperation } from '../../../../shared/services/data.service/operations';

@Injectable()
export class AffectedPeopleService extends ServiceBase<AffectedPeopleModel>
    implements IAffectedPeopleService {

    private _dataServiceAffectedPeople: DataService<AffectedPeopleModel>;
    private _bulkDataService: DataService<AffectedPeopleModel>;
    private _casualtySummery: CasualtySummeryModel;
    private _enquiryService: DataService<EnquiryModel>;
    private _nokService: DataService<NextOfKinModel>;
    private _passengerService : DataService<PassengerModel>;

    public affectedPeoples: ResponseModel<AffectedPeopleModel>;
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

        this._enquiryService = dataServiceFactory
            .CreateServiceWithOptions<EnquiryModel>('Enquiries', option);
        this._nokService = this.dataServiceFactory
           .CreateServiceWithOptions<NextOfKinModel>('NextOfKins', option);
         this._passengerService = this.dataServiceFactory
            .CreateServiceWithOptions<PassengerModel>
            ('Passengers', option);

    }

    public FlattenAffectedPeople(involvedParty: InvolvePartyModel): any {
        let affectedPeopleForView: AffectedPeopleToView[] = [];
        let affectedPeople: AffectedPeopleModel[];
        let affected: AffectedModel;
        if (involvedParty != null) {
            affected = UtilityService.pluck(involvedParty, ['Affecteds'])[0][0];

            if (affected != null) {
                affectedPeople = UtilityService.pluck(affected, ['AffectedPeople'])[0];

                affectedPeopleForView = affectedPeople.map(function (dataItem) {
                    let item = new AffectedPeopleToView();
                    item.AffectedId = dataItem.AffectedId;
                    item.AffectedPersonId = dataItem.AffectedPersonId;
                    item.PassengerName = dataItem.Passenger != null ? dataItem.Passenger.PassengerName : '';
                    item.Pnr = dataItem.Passenger != null ? (dataItem.Passenger.Pnr == null ? 'NA' : dataItem.Passenger.Pnr) : 'NA';
                    item.CrewName = dataItem.Crew != null ? dataItem.Crew.CrewName : '';
                    item.CrewNameWithCategory = dataItem.Crew != null ? dataItem.Crew.CrewName + '(' + dataItem.Crew.AsgCat + ')' : '';
                    item.ContactNumber = dataItem.Passenger != null ? (dataItem.Passenger.ContactNumber == null ? 'NA' : dataItem.Passenger.ContactNumber) : (dataItem.Crew == null ? 'NA' : dataItem.Crew.ContactNumber);
                    item.Gender = dataItem.Passenger != null ? (dataItem.Passenger.PassengerGender == null ? 'NA' : dataItem.Passenger.PassengerGender)
                        : (dataItem.Crew == null ? 'NA' : dataItem.Crew.CrewGender);
                    item.Nationality = dataItem.Passenger != null ? (dataItem.Passenger.PassengerNationality == null ? 'NA' : dataItem.Passenger.PassengerNationality)
                        : (dataItem.Crew == null ? 'NA' : dataItem.Crew.CrewNationality);
                    var now = moment(new Date());
                    var dob = dataItem.Passenger != null ? moment(dataItem.Passenger.PassengerDob) : moment(dataItem.Crew.CrewDob);
                    var duration = moment.duration(now.diff(dob));
                    var age = duration.asYears();
                    item.Age = Math.floor(age).toString();
                    item.TicketNumber = dataItem.TicketNumber;
                    item.IsVerified = dataItem.IsVerified;
                    item.IsCrew = dataItem.IsCrew;
                    item.BaggageCount = dataItem.Passenger != null ? (dataItem.Passenger.BaggageCount == null ? 0 : dataItem.Passenger.BaggageCount) : 0;
                    item.BaggageWeight = dataItem.Passenger != null ? (dataItem.Passenger.BaggageWeight == null ? 0 : dataItem.Passenger.BaggageWeight) : 0;
                    item.PassengerSpecialServiceRequestCode = dataItem.Passenger != null ? (dataItem.Passenger.SpecialServiceRequestCode.trim() == null ? 'NA' : dataItem.Passenger.SpecialServiceRequestCode) : 'NA';
                    item.PassengerEmployeeId = dataItem.Passenger != null ? (dataItem.Passenger.EmployeeId == null ? 'NA' : dataItem.Passenger.EmployeeId) : 'NA';
                    item.CoTravellerInformation = dataItem.Passenger != null ? (dataItem.Passenger.CoTravellerInformation == null ? 'NA' : dataItem.Passenger.CoTravellerInformation) : 'NA';
                    item.CrewIdCode = dataItem.Crew != null ? (dataItem.Crew.EmployeeNumber == null ? 'NA' : dataItem.Crew.EmployeeNumber) : 'NA';
                    item.IsStaff = dataItem.IsStaff != null ? dataItem.IsStaff : false;
                    item.MedicalStatus = dataItem.MedicalStatus != null ? dataItem.MedicalStatus : 'NA';
                    item.Remarks = dataItem.Remarks != null ? dataItem.Remarks : 'NA';
                    item.Identification = dataItem.Identification != null ? dataItem.Identification : 'NA';
                    item.SeatNo = dataItem.Passenger != null ? dataItem.Passenger.Seatno : 'No Seat Number Available';
                    // item.CommunicationLogs: dataItem.CommunicationLogs,
                    item.PaxType = dataItem.Passenger != null ? dataItem.Passenger.PassengerType : dataItem.Crew != null ? 'Crew' : '';
                    if(dataItem.Crew)
                    {
                        item.CrewId = dataItem.CrewId;
                    }
                    if(dataItem.Passenger)
                    {
                        item.PassengerId = dataItem.PassengerId;
                    }
                    item.IsNokInformed = dataItem.IsNokInformed;
                    return item;
                });
            }
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
        let verifiedAffectedPeople: AffectedPeopleModel[] = [];
        if (affectedPeopleForVerification != null) {
            verifiedAffectedPeople = affectedPeopleForVerification.map(function (affected) {
                let item = new AffectedPeopleModel();
                item.AffectedPersonId = affected.AffectedPersonId;
                item.IsVerified = affected.IsVerified;
                return item;
            });
        }
        return verifiedAffectedPeople;
    }

    public GetDeceasedPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and
             ActiveFlag eq 'Active' and tolower(MedicalStatus) eq 'deceased'`)
            .Execute();
    }

    public GetReunitedPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and
             ActiveFlag eq 'Active' and tolower(MedicalStatus) eq 'reunited'`)
            .Execute();
    }

    public GetMinorInjuryPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and
             ActiveFlag eq 'Active' and tolower(MedicalStatus) eq 'injury'`)
            .Execute();
    }

    public GetCriticalPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and
             ActiveFlag eq 'Active' and tolower(MedicalStatus) eq 'critical'`)
            .Execute();
    }

    public GetImmediateCarePeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and
             ActiveFlag eq 'Active' and tolower(MedicalStatus) eq 'immediatecare'`)
            .Execute();
    }


    public GetCasualtyStatus(incidentId: number): Observable<CasualtySummeryModel> {
        this._casualtySummery = new CasualtySummeryModel();
        return this.GetDeceasedPeopleCount(incidentId)
            .map((dataDeceasedPeopleCount: number) => {
                //this._casualtySummery.deceasedCasualtyCount = dataDeceasedPeopleCount;
                this._casualtySummery.deceasedCasualtyCount = 0;
                return this._casualtySummery;
            })
            .flatMap(() => this.GetReunitedPeopleCount(incidentId))
            .map((dataReunitedPeopleCount: number) => {
                //this._casualtySummery.reunitedCasualtyCount = dataReunitedPeopleCount;
                this._casualtySummery.reunitedCasualtyCount = 0;
                return this._casualtySummery;
            })
            .flatMap(() => this.GetMinorInjuryPeopleCount(incidentId))
            .map((dataMinorInjuryPeople: number) => {
                //this._casualtySummery.minorCasualtyCount = dataMinorInjuryPeople;
                this._casualtySummery.minorCasualtyCount = 0;
                return this._casualtySummery;
            })
            .flatMap(() => this.GetCriticalPeopleCount(incidentId))
            .map((dataCriticalPeopleCount: number) => {
                //this._casualtySummery.criticalCasualtyCount = dataCriticalPeopleCount;
                this._casualtySummery.criticalCasualtyCount = 0;
                return this._casualtySummery;
            });

    }


    public GetCommunicationByPDA(id: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Filter(`AffectedPersonId eq ${id}`)
            .Expand("Passenger , Crew, CommunicationLogs($filter=ActiveFlag eq 'Active')")
            .Execute();
    }


    public GetCallerListForAffectedPerson(affectedPersonId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._enquiryService.Query()
            .Filter(`AffectedPersonId eq ${affectedPersonId}`)
            .Expand(`Caller`)
            .Execute();
    }
    public CreateNok(noks: NextOfKinModel): Observable<NextOfKinModel> {
        return this._nokService.Post(noks).Execute();
    }


    public updatePassanger(passenger : PassengerModel,key?:number): Observable<PassengerModel> {
     return this._passengerService.Patch(passenger, key.toString()).Execute();
    }
}
