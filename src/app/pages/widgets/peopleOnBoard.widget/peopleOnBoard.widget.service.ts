import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AffectedPeopleModel, AffectedPeopleService } from '../../shared.components/affected.people';
import { InvolvePartyModel, InvolvePartyService } from '../../shared.components/involveparties';
import { EnquiryModel, EnquiryService } from '../../shared.components/call.centre';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import { PassengerModel, CrewModel, CargoModel } from '../../shared.components';
import {
    ResponseModel, DataServiceFactory, UtilityService
} from '../../../shared';
import * as _ from 'underscore';

@Injectable()
export class PeopleOnBoardWidgetService {
    peopleOnBoard: PeopleOnBoardModel = null;
    public enquiries: ResponseModel<EnquiryModel>;

    constructor(private dataServiceFactory: DataServiceFactory,
        private affectedPeopleService: AffectedPeopleService,
        private involvedPartyService: InvolvePartyService,
        private enquiryService: EnquiryService) {
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
                
                if (passengerListLocal.length > 0) {
                    let genKPIData = _.countBy(passengerListLocal.filter(x=>x.PassengerType == 'ADU'), "PassengerGender");
                    let natiionalityKPIData = _.countBy(passengerListLocal, "PassengerNationality");
                    let paxTypeKPIData = _.countBy(passengerListLocal, "PassengerType");

                    //let temp: number;
                    this.peopleOnBoard.totalGenderTypeCount = Object.keys(genKPIData)
                        .map(x => { return { Key: x, Value: genKPIData[x] }; });

                    this.peopleOnBoard.totalNationalityTypeCount = Object.keys(natiionalityKPIData)
                        .map(x => { return { Key: x, Value: natiionalityKPIData[x] }; });
                    this.peopleOnBoard.totalPaxTypeCount = Object.keys(paxTypeKPIData)
                        .map(x => { return { Key: x, Value: paxTypeKPIData[x] }; });
                }

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
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.GetAllCargosByIncident(incidentId))
            .map((dataTotalAffectedCargo: ResponseModel<InvolvePartyModel>) => {
                let cargoListLocal: CargoModel[] = [];

                cargoListLocal = dataTotalAffectedCargo.Records[0].Flights[0].Cargoes;


                this.peopleOnBoard.totalAffectedCargoCount = isNaN(cargoListLocal.length) ? 0 : cargoListLocal.length;
                let cargoTypeKPIData = _.countBy(cargoListLocal, "CargoType");
                this.peopleOnBoard.cargoOnBoardCountByType = Object.keys(cargoTypeKPIData)
                    .map(x => { return { Key: x, Value: cargoTypeKPIData[x] }; });
                return this.peopleOnBoard;
            })
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.GetAllGroundVictimsByIncident(incidentId))
            .map((dataTotalAffectedGroundVictim: ResponseModel<InvolvePartyModel>) => {
                let groundVictimListLocal = dataTotalAffectedGroundVictim.Records[0].GroundVictims;
                this.peopleOnBoard.totalGroundVictimCount = isNaN(groundVictimListLocal.length) ? 0 : groundVictimListLocal.length;
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
                if (affectedPeoplesList.length > 0) {
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

    GetAllCargosByIncident(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetAllCargosByIncident(incidentId);
    }

    GetAllGroundVictimsByIncident(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetAllGroundVictimsByIncident(incidentId);
    }

    GetGroundVictimsByQuery(query: string, incidentid: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetGroundVictimsByQuery(query, incidentid);
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

    GetQueryForPassenger(query: string, incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetQueryForPassenger(query, incidentId);
    }

    GetQueryForCrew(query: string, incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetQueryForCrew(query, incidentId);
    }

    GetQueryForCargo(query: string, incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this.involvedPartyService.GetQueryCargosByIncident(query, incidentId);
    }

}
