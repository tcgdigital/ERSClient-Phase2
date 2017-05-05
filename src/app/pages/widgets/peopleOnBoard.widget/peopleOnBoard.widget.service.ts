import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AffectedPeopleModel, AffectedPeopleService } from '../../shared.components/affected.people';
import { InvolvePartyModel, InvolvePartyService } from '../../shared.components/involveparties';
import { AffectedModel } from '../../shared.components/affected';
import { EnquiryModel, EnquiryService } from '../../shared.components/call.centre';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import { PassengerModel } from '../../shared.components/passenger';
import { CrewModel } from '../../shared.components/crew';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase, UtilityService
} from '../../../shared';

@Injectable()
export class PeopleOnBoardWidgetService implements OnInit {

    peopleOnBoard: PeopleOnBoardModel = null;
    public enquiries: ResponseModel<EnquiryModel>;
    constructor(private dataServiceFactory: DataServiceFactory,
        private affectedPeopleService: AffectedPeopleService,
        private involvedPartyService: InvolvePartyService,
        private enquiryService: EnquiryService) {

    }
    ngOnInit() {
        this.peopleOnBoard = new PeopleOnBoardModel();
    }

    GetPeopleOnBoardDataCount(incidentId: number): Observable<PeopleOnBoardModel> {
        this.peopleOnBoard = new PeopleOnBoardModel();
        return this.GetAllPassengerCount(incidentId)
            .map((dataTotalAffectedPassenger: ResponseModel<InvolvePartyModel>) => {
                let passengerListLocal: PassengerModel[] = [];
                let affectedPeoples: AffectedPeopleModel[];
                if (dataTotalAffectedPassenger.Records[0].Affecteds[0]) {
                    affectedPeoples = dataTotalAffectedPassenger.Records[0].Affecteds[0].AffectedPeople;
                    affectedPeoples.forEach((item: AffectedPeopleModel) => {
                        passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                    });
                }
                this.peopleOnBoard.totalAffectedPassengerCount = isNaN(passengerListLocal.length) ? 0 : passengerListLocal.length;
                return this.peopleOnBoard;
            })
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.GetAllCrewsByIncident(incidentId))
            .map((dataTotalAffectedCrew: ResponseModel<InvolvePartyModel>) => {
                let crewListLocal: CrewModel[] = [];
                let affectedPeoples: AffectedPeopleModel[];
                if (dataTotalAffectedCrew.Records[0].Affecteds[0]) {
                affectedPeoples = dataTotalAffectedCrew.Records[0].Affecteds[0].AffectedPeople;
                affectedPeoples.forEach((item: AffectedPeopleModel) => {
                    crewListLocal.push(UtilityService.pluck(item, ['Crew'])[0]);
                });
                }
                this.peopleOnBoard.totalAffectedCrewCount = isNaN(crewListLocal.length) ? 0 : crewListLocal.length;
                return this.peopleOnBoard;
            })
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.GetEnquiredAffectedPeople(incidentId))
            .map((dataEnquiryModels: ResponseModel<EnquiryModel>) => {
                this.enquiries = dataEnquiryModels;
                return this.enquiries;
            })
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.GetAllPassengersByIncident(incidentId))
            .map((dataInvolvePartyModels: ResponseModel<InvolvePartyModel>) => {
                let AffectedPersonIds: number[] = [];
                let AffectedPeoples: ResponseModel<EnquiryModel>;
                let affectedPeoples: AffectedPeopleModel[];
                let affectedPeoplesList: AffectedPeopleModel[] = [];
                this.enquiries.Records.forEach((itemEnquiry: EnquiryModel) => {
                    AffectedPersonIds.push(itemEnquiry.AffectedPersonId);
                });
                 if (dataInvolvePartyModels.Records[0].Affecteds[0]) {
                affectedPeoples = dataInvolvePartyModels.Records[0].Affecteds[0].AffectedPeople;
                
                affectedPeoplesList = affectedPeoples.filter((itemAffectedPeople: AffectedPeopleModel) => {
                    return AffectedPersonIds.some((someItem) => {
                        return (someItem == itemAffectedPeople.AffectedPersonId);
                    });
                });
                 }
                let enquiredPassengers: PassengerModel[] = [];
                if(affectedPeoplesList.length > 0){
                affectedPeoplesList.forEach((people: AffectedPeopleModel) => {
                    enquiredPassengers.push(people.Passenger);
                });
                }
                this.peopleOnBoard.enquiredAffectedPassengerCount = isNaN(enquiredPassengers.length) ? 0 : enquiredPassengers.length;
                return this.peopleOnBoard;
            })
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.GetEnquiredAffectedCrew(incidentId))
            .map((dataEnquiryModels: ResponseModel<EnquiryModel>) => {
                this.enquiries = dataEnquiryModels;
                return this.enquiries;
            })
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.GetAllCrewsByIncident(incidentId))
            .map((dataInvolvePartyModels: ResponseModel<InvolvePartyModel>) => {
                let AffectedPeoples: ResponseModel<EnquiryModel>;
                let affectedPeoples: AffectedPeopleModel[];
                let AffectedPersonIds: number[] = [];
                let affectedPeoplesList: AffectedPeopleModel[] = [];
                this.enquiries.Records.forEach((itemEnquiry: EnquiryModel) => {
                    AffectedPersonIds.push(itemEnquiry.AffectedPersonId);
                });
                 if (dataInvolvePartyModels.Records[0].Affecteds[0]) {
                affectedPeoples = dataInvolvePartyModels.Records[0].Affecteds[0].AffectedPeople;
                affectedPeoplesList = affectedPeoples.filter((itemAffectedPeople: AffectedPeopleModel) => {
                    return AffectedPersonIds.some((someItem) => {
                        return (someItem == itemAffectedPeople.AffectedPersonId &&
                            itemAffectedPeople.Crew != null);
                    });
                });
                 }
                let enquiredCrews: CrewModel[] = [];
                affectedPeoplesList.forEach((people: AffectedPeopleModel) => {
                    enquiredCrews.push(people.Crew);
                });
                this.peopleOnBoard.enquiredAffectedCrewCount = isNaN(enquiredCrews.length) ? 0 : enquiredCrews.length;
                return this.peopleOnBoard;
            });


    }

    GetAllPassengersByIncident(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetAllPassengersByIncident(incidentId);
    }

    GetAllCrewsByIncident(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetAllCrewsByIncident(incidentId);
    }

    GetEnquiredAffectedPeople(incidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this.enquiryService.GetEnquiredAffectedPeople(incidentId);
    }

    GetEnquiredAffectedCrew(incidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this.enquiryService.GetEnquiredAffectedCrew(incidentId);
    }

    OpenEnquiredPassengersDetails(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.GetEnquiredAffectedPeople(incidentId)
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.GetAllPassengersByIncident(incidentId));
    }

    OpenEnquiredCrewsDetails(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.GetEnquiredAffectedCrew(incidentId)
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.GetAllCrewsByIncident(incidentId));
    }

    GetAllPassengerCount(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.GetAllPassengersByIncident(incidentId);
    }

}
