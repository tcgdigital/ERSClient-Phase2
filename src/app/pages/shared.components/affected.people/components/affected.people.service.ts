import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel, AffectedModel } from '../../../shared.components';
import { EnquiryModel } from '../../call.centre';
import { NextOfKinModel } from '../../nextofkins';
import { AffectedPeopleToView, AffectedPeopleModel, AffectedPersonInvolvementResponse, AffectedPersonInvolvementModel } from './affected.people.model';
import { PassengerModel } from '../../passenger/components';
import { IAffectedPeopleService } from './IAffectedPeopleService';
import { CasualtySummeryModel } from '../../../widgets/casualty.summary.widget/casualty.summary.widget.model';
import {
    ResponseModel, DataService, ServiceBase,
    DataServiceFactory, DataProcessingService,
    GlobalConstants, UtilityService
} from '../../../../shared';
import * as moment from 'moment/moment';
import { CountOperation } from '../../../../shared/services/data.service/operations';

@Injectable()
export class AffectedPeopleService extends ServiceBase<AffectedPeopleModel>
    implements IAffectedPeopleService {

    public affectedPeoples: ResponseModel<AffectedPeopleModel>;
    private _bulkDataService: DataService<AffectedPeopleModel>;
    private _casualtySummery: CasualtySummeryModel;
    private _enquiryService: DataService<EnquiryModel>;
    private _nokService: DataService<NextOfKinModel>;
    private _passengerService: DataService<PassengerModel>;

    private _dataServiceForReplaceAffectedInvolvement: DataService<any>;
    /**
     * Creates an instance of AffectedPeopleService.
     * @param {DataServiceFactory} dataServiceFactory
     *
     * @memberOf AffectedPeopleService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'AffectedPeople');
        const option: DataProcessingService = new DataProcessingService();

        this._dataServiceForReplaceAffectedInvolvement = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix('AffectedPersonInvolvementReplace', 'ReplaceAffectedPersonInvolvement', option);


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

    public FlattenAffectedPeople(involvedParty: InvolvePartyModel): AffectedPeopleToView[] {
        let affectedPeopleForView: AffectedPeopleToView[] = [];
        let affectedPeople: AffectedPeopleModel[];
        let affected: AffectedModel;

        if (involvedParty != null) {
            affected = UtilityService.pluck(involvedParty, ['Affecteds'])[0][0];
            if (affected != null) {
                affectedPeople = UtilityService.pluck(affected, ['AffectedPeople'])[0];
                affectedPeopleForView = affectedPeople.map((dataItem) => {
                    let item = new AffectedPeopleToView();
                    item = this.FlattenAffectedPerson(dataItem);
                    return item;
                });
            }
        }
        return affectedPeopleForView;
    }

    public FlattenAffectedPerson(affectedPerson: AffectedPeopleModel): AffectedPeopleToView {
        let affectedPeopleForView = new AffectedPeopleToView();

        affectedPeopleForView.AffectedId = affectedPerson.AffectedId;
        affectedPeopleForView.AffectedPersonId = affectedPerson.AffectedPersonId;
        affectedPeopleForView.CurrentCareMemberName = affectedPerson.CurrentCareMemberName;
        affectedPeopleForView.PassengerName = affectedPerson.Passenger != null ? affectedPerson.Passenger.PassengerName : '';
        affectedPeopleForView.Pnr = affectedPerson.Passenger != null ? (affectedPerson.Passenger.Pnr == null ? 'NA' : affectedPerson.Passenger.Pnr) : 'NA';
        affectedPeopleForView.CrewName = affectedPerson.Crew != null ? affectedPerson.Crew.CrewName : '';
        affectedPeopleForView.CrewNameWithCategory = affectedPerson.Crew != null ? affectedPerson.Crew.CrewName + '(' + affectedPerson.Crew.AsgCat + ')' : '';
        affectedPeopleForView.ContactNumber = affectedPerson.Passenger != null ? (affectedPerson.Passenger.ContactNumber == null ? 'NA' : affectedPerson.Passenger.ContactNumber) : (affectedPerson.Crew == null ? 'NA' : affectedPerson.Crew.ContactNumber);
        affectedPeopleForView.Gender = affectedPerson.Passenger != null ? (affectedPerson.Passenger.PassengerGender == null ? 'NA' : affectedPerson.Passenger.PassengerGender)
            : (affectedPerson.Crew == null ? 'NA' : affectedPerson.Crew.CrewGender);
        affectedPeopleForView.Nationality = affectedPerson.Passenger != null ? (affectedPerson.Passenger.PassengerNationality == null ? 'NA' : affectedPerson.Passenger.PassengerNationality)
            : (affectedPerson.Crew == null ? 'NA' : affectedPerson.Crew.CrewNationality);
        
        if (!affectedPerson.IsCrew)
            affectedPeopleForView.PassportNumber = (affectedPerson.Passenger.IdentificationDocType == 'P') ? affectedPerson.Passenger.IdentificationDocNumber : '';
        else    
            affectedPeopleForView.PassportNumber = (affectedPerson.Crew.PassportNumber != null) ? affectedPerson.Crew.PassportNumber : '';
        
            const now = moment(new Date());
        const dob = affectedPerson.Passenger != null ? moment(affectedPerson.Passenger.PassengerDob) : moment(affectedPerson.Crew.CrewDob);
        if (dob == null || dob == undefined) {
            affectedPeopleForView.Age = '';
        }
        else {
            const duration = moment.duration(now.diff(dob));
            const age = duration.asYears();
            affectedPeopleForView.Age = Math.floor(age).toString();
        }
        affectedPeopleForView.TicketNumber = affectedPerson.TicketNumber;
        affectedPeopleForView.IsVerified = affectedPerson.IsVerified;
        affectedPeopleForView.IsCrew = affectedPerson.IsCrew;
        affectedPeopleForView.BaggageCount = affectedPerson.Passenger != null ? (affectedPerson.Passenger.BaggageCount == null ? 0 : affectedPerson.Passenger.BaggageCount) : 0;
        affectedPeopleForView.BaggageWeight = affectedPerson.Passenger != null ? (affectedPerson.Passenger.BaggageWeight == null ? 0 : affectedPerson.Passenger.BaggageWeight) : 0;
        affectedPeopleForView.PassengerSpecialServiceRequestCode = affectedPerson.Passenger != null ? (affectedPerson.Passenger.SpecialServiceRequestCode == null ? 'NA' : affectedPerson.Passenger.SpecialServiceRequestCode) : 'NA';
        affectedPeopleForView.PassengerEmployeeId = affectedPerson.Passenger != null ? (affectedPerson.Passenger.EmployeeId == null ? 'NA' : affectedPerson.Passenger.EmployeeId) : 'NA';
        affectedPeopleForView.CrewIdCode = affectedPerson.Crew != null ? (affectedPerson.Crew.EmployeeNumber == null ? 'NA' : affectedPerson.Crew.EmployeeNumber) : 'NA';
        affectedPeopleForView.IsStaff = affectedPerson.IsStaff != null ? affectedPerson.IsStaff : false;
        affectedPeopleForView.MedicalStatus = affectedPerson.MedicalStatus != null ? affectedPerson.MedicalStatus : 'NA';
        affectedPeopleForView.Remarks = affectedPerson.Remarks != null ? affectedPerson.Remarks : 'NA';
        affectedPeopleForView.Identification = affectedPerson.Identification != null ? affectedPerson.Identification : 'NA';
        affectedPeopleForView.SeatNo = affectedPerson.Passenger != null ? affectedPerson.Passenger.Seatno : 'No Seat Number Available';
        affectedPeopleForView.PaxType = affectedPerson.Passenger != null ? affectedPerson.Passenger.PassengerType : affectedPerson.Crew != null ? 'Crew' : '';
        if (affectedPerson.Crew) {
            affectedPeopleForView.CrewId = affectedPerson.CrewId;
            affectedPeopleForView.Crew = affectedPerson.Crew;
        }
        if (affectedPerson.Passenger) {
            affectedPeopleForView.PassengerId = affectedPerson.PassengerId;
            if (affectedPerson.Passenger.CoPassengerMappings
                && affectedPerson.Passenger.CoPassengerMappings.length > 0) {
                affectedPeopleForView.GroupId = affectedPerson.Passenger.CoPassengerMappings[0].GroupId;
            }
            else {
                affectedPeopleForView.GroupId = 0;
            }
        }
        else {
            affectedPeopleForView.PassengerId = 0;
        }
        affectedPeopleForView.IsNokInformed = affectedPerson.IsNokInformed;
        affectedPeopleForView.commlength = (affectedPerson.CommunicationLogs) ?
            affectedPerson.CommunicationLogs.length > 0 : false;

        return affectedPeopleForView;
    }

    public GetCoPassangers(AffectedPersonId: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Filter(`AffectedPersonId eq ${AffectedPersonId}`)
            .Expand('Passenger($expand=CoPassengerMappings($expand=Passenger))')
            .Execute();
    }

    public GetCurrentCareMember(affectedPersonId: number, careMemberId: number)
        : Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Expand(`CareMembers($expand=UserProfile($select=Name),Department($select=DepartmentName); 
                $select=CareEngagementTrackId,CareMemberName,EffectedFrom,IncidentId,AffectedPersonId;
                $filter=CareEngagementTrackId eq ${careMemberId})`)
            .Filter(`AffectedPersonId eq ${affectedPersonId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Select(`AffectedPersonId, CurrentCareMemberName`)
            .Execute();
    }

    public GetAllAffectedPeopleIdsByIncidentId(incidentId: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Expand(`Affected($select=AffectedId;$expand=InvolvedParty($select=IncidentId))`)
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and IsIdentified eq true`)
            .Select(`AffectedPersonId`)
            .Execute();
    }

    public CreateBulk(entities: AffectedPeopleModel[]): Observable<AffectedPeopleModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    public GetAffectedPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IsCrew eq false and Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and IsIdentified eq true`)
            .Execute();
    }

    public GetAffectedCrewCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IsCrew eq true and Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Execute();
    }

    public MapAffectedPeople(affectedPeopleForVerification, userid: number): AffectedPeopleModel[] {
        let verifiedAffectedPeople: AffectedPeopleModel[] = [];
        if (affectedPeopleForVerification != null) {
            verifiedAffectedPeople = affectedPeopleForVerification.map((affected) => {
                const item = new AffectedPeopleModel();
                item.AffectedPersonId = affected.AffectedPersonId;
                item.IsVerified = affected.IsVerified;
                item.UpdatedBy = userid;
                item.UpdatedOn = new Date();
                return item;
            });
        }
        return verifiedAffectedPeople;
    }

    public GetDeceasedPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and tolower(MedicalStatus) eq 'deceased'`)
            .Execute();
    }

    public GetMissingPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and tolower(MedicalStatus) eq 'missing'`)
            .Execute();
    }

    public GetInjuredPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and tolower(MedicalStatus) eq 'injured'`)
            .Execute();
    }

    public GetUninjuredPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and tolower(MedicalStatus) eq 'uninjured'`)
            .Execute();
    }

    public GetOtherPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active' and tolower(MedicalStatus) eq 'others'`)
            .Execute();
    }

    public GetCasualtyStatus(incidentId: number): Observable<CasualtySummeryModel> {
        this._casualtySummery = new CasualtySummeryModel();
        return this.GetDeceasedPeopleCount(incidentId)
            .map((dataDeceasedPeopleCount: number) => {
                this._casualtySummery.deceasedCount = dataDeceasedPeopleCount;
                return this._casualtySummery;
            })
            .flatMap(() => this.GetMissingPeopleCount(incidentId))
            .map((dataMissingPeopleCount: number) => {
                this._casualtySummery.missingCount = dataMissingPeopleCount;
                return this._casualtySummery;
            })
            .flatMap(() => this.GetInjuredPeopleCount(incidentId))
            .map((dataInjuredPeople: number) => {
                this._casualtySummery.injuredCount = dataInjuredPeople;
                return this._casualtySummery;
            })
            .flatMap(() => this.GetUninjuredPeopleCount(incidentId))
            .map((dataUninjuredPeopleCount: number) => {
                this._casualtySummery.uninjuredCount = dataUninjuredPeopleCount;
                return this._casualtySummery;
            })
            .flatMap(() => this.GetOtherPeopleCount(incidentId))
            .map((dataOtherPeopleCount: number) => {
                this._casualtySummery.othersCount = dataOtherPeopleCount;
                return this._casualtySummery;
            });
    }

    public GetCommunicationByPDA(id: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Filter(`AffectedPersonId eq ${id} and IsIdentified eq true`)
            .Expand("Passenger,Crew,CommunicationLogs($filter=ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active';$orderby=CreatedOn desc)")
            .Execute();
    }

    public GetCallerListForAffectedPerson(affectedPersonId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._enquiryService.Query()
            .Filter(`AffectedPersonId eq ${affectedPersonId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Expand(`Caller`)
            .Execute();
    }
    public CreateNok(noks: NextOfKinModel): Observable<NextOfKinModel> {
        return this._nokService.Post(noks).Execute();
    }

    public updatePassanger(passenger: PassengerModel, key?: number): Observable<PassengerModel> {
        return this._passengerService.Patch(passenger, key.toString()).Execute();
    }

    getGroupId(affectedPersonId: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Filter(`AffectedPersonId eq ${affectedPersonId} and IsCrew eq false`)
            .Expand(`Passenger($expand=CoPassengerMappings($select=GroupId);$select=PassengerId;)`)
            .Select('AffectedPersonId')
            .Execute();
    }

    public GetActiveIdentifiedPassengerByIncident(incidentId: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Filter(`Affected/InvolvedParty/IncidentId eq ${incidentId} 
            and IsIdentified eq true and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Expand(`Passenger`)
            .Select('AffectedPersonId,IsIdentified')
            .Execute();
    }

    public GetActiveUnIdentifiedPassengerByIncident(incidentId: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Select('AffectedPersonId,IsIdentified')
            .Expand(`Passenger`)
            .Filter(`Passenger ne null and IsIdentified eq false and Affected/InvolvedParty/IncidentId eq ${incidentId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Execute();
    }

    public GetAffectedPersonIdByPassengerId(passengerId: number): Observable<ResponseModel<AffectedPeopleModel>> {
        return this._dataService.Query()
            .Select('AffectedPersonId')
            .Filter(`PassengerId eq ${passengerId}`)
            .Execute();
    }

    public ReplaceAffectedPersonInvolvement(currentAffectedPersonId: number,
        replaceWithAffectedPersonId: number, currentDepartmentName: string): Observable<AffectedPersonInvolvementResponse> {
        let affectedPersonInvolvementModel = new AffectedPersonInvolvementModel
            (currentAffectedPersonId, replaceWithAffectedPersonId, currentDepartmentName);

        return this._dataServiceForReplaceAffectedInvolvement.JsonPost(affectedPersonInvolvementModel)
            .Execute()
            .map((response: any) => {
                return response as AffectedPersonInvolvementResponse;
            }).catch((error: any) => {
                return Observable.of(error as AffectedPersonInvolvementResponse);
            });
    }
}
