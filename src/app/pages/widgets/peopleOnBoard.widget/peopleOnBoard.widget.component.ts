import { Component, OnInit, ViewEncapsulation, Input, ViewChild, OnDestroy } from '@angular/core';
import { PeopleOnBoardWidgetService } from './peopleOnBoard.widget.service';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Observable } from 'rxjs/Rx';
import { InvolvePartyModel } from '../../shared.components/involveparties';
import { AffectedPeopleModel } from '../../shared.components/affected.people/components/affected.people.model';
import { PassengerModel, CargoModel, CrewModel  } from '../../shared.components';
import { EnquiryModel } from '../../shared.components/call.centre/components/call.centre.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase, UtilityService,
    GlobalStateService, KeyValue, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue
} from '../../../shared';
import * as _ from 'underscore';

@Component({
    selector: 'peopleOnBoard-widget',
    templateUrl: './peopleOnBoard.widget.view.html',
    encapsulation: ViewEncapsulation.None,
     styleUrls: ['./peopleOnBoard.widget.style.scss']
})
export class PeopleOnBoardWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('currentIncidentId') currentIncidentId: number;

    @ViewChild('childModalPassengers') public childModalPassengers: ModalDirective;
    @ViewChild('childModalCrews') public childModalCrews: ModalDirective;
    @ViewChild('childModalEnquiredPassengers') public childModalEnquiredPassengers: ModalDirective;
    @ViewChild('childModalEnquiredCrew') public childModalEnquiredCrew: ModalDirective;

    @ViewChild('childModalPassengersDetailKPI') public childModalPassengersDetailKPI: ModalDirective;    
    @ViewChild('childModalPassengersByGender') public childModalPassengersByGender: ModalDirective;
    @ViewChild('childModalPassengersByNationality') public childModalPassengersByNationality: ModalDirective;
    @ViewChild('childModalPassengersByPaxType') public childModalPassengersByPaxType: ModalDirective;
    @ViewChild('childModalCargos') public childModalCargos: ModalDirective;


    peopleOnBoard: PeopleOnBoardModel;
    public passengerList: Observable<PassengerModel[]>;

    public passengerListByGender: PassengerModel[] = [];
    public passengerListByNationality: PassengerModel[] = [];
    public passengerListByPaxType: PassengerModel[] = [];
    public searchConfigs: SearchConfigModel<any>[] = [];

    public crewList: Observable<CrewModel[]>;
    public enquiries: ResponseModel<EnquiryModel>;
    public affectedEnquiredPeoples: Observable<PassengerModel[]>;
    public affectedEnquiredCrews: Observable<CrewModel[]>;

    public cargoList:CargoModel[];
    currentDepartmentId: number;
    currentIncidentIdLocal: number;

    /**
     * Creates an instance of PeopleOnBoardWidgetComponent.
     * @param {PeopleOnBoardWidgetService} peopleOnBoardWidgetService
     * @param {GlobalStateService} globalState
     *
     * @memberOf PeopleOnBoardWidgetComponent
     */
    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService,
        private globalState: GlobalStateService) { }

    getPeopleOnboardCounts(incident): void {
        this.peopleOnBoard = new PeopleOnBoardModel();
        this.peopleOnBoardWidgetService.GetPeopleOnBoardDataCount(incident)
            .subscribe((peopleOnBoardObservable) => {
                console.log(peopleOnBoardObservable);
                this.peopleOnBoard = peopleOnBoardObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public ngOnInit(): void {
        this.currentIncidentId = this.currentIncidentId;
        this.currentDepartmentId = this.currentDepartmentId;
        this.getPeopleOnboardCounts(this.currentIncidentId);
        //this.GetAllCargoDetails(this.currentIncidentId);
        this.initiateSearchConfigurations();
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    public openAllPassengersDetails(): void {
        const involvedParties: InvolvePartyModel[] = [];
        const passengerListLocal: PassengerModel[] = [];

        this.peopleOnBoardWidgetService.GetAllPassengersByIncident(this.currentIncidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                if (result.Records[0].Affecteds.length > 0) {
                    affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;                                   
                    affectedPeoples.forEach((item: AffectedPeopleModel) => {
                        passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                    });
                    this.passengerList = Observable.of(passengerListLocal);
                    this.childModalPassengers.show();
                }
                else{
                    this.passengerList = Observable.of([]);
                    this.childModalPassengers.show();
                }

            });
    }

    public GetAllCargoDetails(incidentId: number): void {
        const involvedParties: InvolvePartyModel[] = [];
        let cargoListLocal: CargoModel[] = [];

        this.peopleOnBoardWidgetService.GetAllCargosByIncident(incidentId)
        .subscribe((result: ResponseModel<InvolvePartyModel>)=>{
            cargoListLocal = result.Records[0].Flights[0].Cargoes;
            this.peopleOnBoard.totalCargoOnBoardCount = cargoListLocal.length;
            let cargoTypeKPIData = _.countBy(cargoListLocal,"CargoType");            
            this.peopleOnBoard.cargoOnBoardCountByType = Object.keys(cargoTypeKPIData)
            .map(x=> { return {Key: x, Value: cargoTypeKPIData[x]}; });                
            this.cargoList = cargoListLocal; 
        })
               
    }

    

    public openAllPassengersByFilter(filterValue: string, filterCriteria: string): void {
        const involvedParties: InvolvePartyModel[] = [];
        const passengerListLocal: PassengerModel[] = [];
        this.passengerListByGender = [];
        this.passengerListByNationality = [];
        this.passengerListByNationality = [];

        this.peopleOnBoardWidgetService.GetAllPassengersByIncident(this.currentIncidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                if (result.Records[0].Affecteds.length > 0) {
                    affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;
                    affectedPeoples.forEach((item: AffectedPeopleModel) => {
                        passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                    });
                    if(filterCriteria.toLowerCase() === 'gender')
                        this.passengerListByGender = passengerListLocal.filter(a=>a.PassengerGender === filterValue);
                    if(filterCriteria.toLowerCase() === 'nationality')
                        this.passengerListByNationality = passengerListLocal.filter(a=>a.PassengerNationality === filterValue);
                    if(filterCriteria.toLowerCase() === 'pax type')
                        this.passengerListByPaxType = passengerListLocal.filter(a=>a.PassengerType === filterValue)
                    //this.childModalPassengers.show();
                }
                else{
                    this.passengerListByGender = [];
                    this.passengerListByNationality = [];
                    this.passengerListByNationality = [];
                    //this.childModalPassengers.show();
                }
            });
    }

    public hideAllPassengers(): void {
        this.childModalPassengers.hide();
    }

    public hideAllPassengersDetails(): void {
        this.childModalPassengersDetailKPI.hide();
    }

    public OpenPassengerDetailsKPI(): void {
        this.childModalPassengersDetailKPI.show();
    }

    public openEnquiredPassengersDetails(): void {
        let affectedPeoples: AffectedPeopleModel[];
        let AffectedPersonIds: number[];
        this.peopleOnBoardWidgetService.GetEnquiredAffectedPeople(this.currentIncidentId)
            .map((dataEnquiryModels: ResponseModel<EnquiryModel>) => {
                this.enquiries = dataEnquiryModels;
                return this.enquiries;
            })
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.peopleOnBoardWidgetService.GetAllPassengersByIncident(this.currentIncidentId))
            .subscribe((dataInvolvePartyModels: ResponseModel<InvolvePartyModel>) => {
                AffectedPersonIds = [];
                this.enquiries.Records.forEach((itemEnquiry: EnquiryModel) => {
                    AffectedPersonIds.push(itemEnquiry.AffectedPersonId);
                });
                if (dataInvolvePartyModels.Records[0].Affecteds.length > 0) {
                    affectedPeoples = dataInvolvePartyModels.Records[0].Affecteds[0].AffectedPeople;
                    let affectedPeoplesList: AffectedPeopleModel[] = [];
                    affectedPeoplesList = affectedPeoples.filter((itemAffectedPeople: AffectedPeopleModel) => {
                        return AffectedPersonIds.some((someItem) => {
                            return (someItem === itemAffectedPeople.AffectedPersonId);
                        });
                    });
                    const enquiredPassengers: PassengerModel[] = [];
                    affectedPeoplesList.forEach((people: AffectedPeopleModel) => {
                        enquiredPassengers.push(people.Passenger);
                    });
                    this.affectedEnquiredPeoples = Observable.of(enquiredPassengers);
                    this.childModalEnquiredPassengers.show();
                }
                else {
                    this.affectedEnquiredPeoples = Observable.of([]);
                    this.childModalEnquiredPassengers.show();
                }
            });
    }

    public hideEnquiredPassengers(): void {
        this.childModalEnquiredPassengers.hide();
    }

    public openAllCrewsDetails(): void {
        const involvedParties: InvolvePartyModel[] = [];
        const crewListLocal: CrewModel[] = [];
        this.peopleOnBoardWidgetService.GetAllCrewsByIncident(this.currentIncidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                if (result.Records[0].Affecteds.length > 0) {
                    affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;
                    affectedPeoples.forEach((item: AffectedPeopleModel) => {
                        crewListLocal.push(UtilityService.pluck(item, ['Crew'])[0]);
                    });
                    this.crewList = Observable.of(crewListLocal);
                    this.childModalCrews.show();
                }
                else {
                    this.crewList = Observable.of([]);
                    this.childModalCrews.show();
                }
            });
    }

    public hideAllCrews(): void {
        this.childModalCrews.hide();
    }

    public openEnquiredCrewsDetails(): void {
        let affectedPeoples: AffectedPeopleModel[];
        let AffectedPersonIds: number[];
        this.peopleOnBoardWidgetService.GetEnquiredAffectedCrew(this.currentIncidentId)
            .map((dataEnquiryModels: ResponseModel<EnquiryModel>) => {
                this.enquiries = dataEnquiryModels;
                return this.enquiries;
            })
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.peopleOnBoardWidgetService.GetAllCrewsByIncident(this.currentIncidentId))
            .subscribe((dataInvolvePartyModels: ResponseModel<InvolvePartyModel>) => {
                AffectedPersonIds = [];
                this.enquiries.Records.forEach((itemEnquiry: EnquiryModel) => {
                    AffectedPersonIds.push(itemEnquiry.AffectedPersonId);
                });
                if (dataInvolvePartyModels.Records[0].Affecteds.length > 0) {
                    affectedPeoples = dataInvolvePartyModels.Records[0].Affecteds[0].AffectedPeople;
                    let affectedPeoplesList: AffectedPeopleModel[] = [];
                    affectedPeoplesList = affectedPeoples.filter((itemAffectedPeople: AffectedPeopleModel) => {
                        return AffectedPersonIds.some((someItem) => {
                            return (someItem === itemAffectedPeople.AffectedPersonId &&
                                itemAffectedPeople.Crew != null);
                        });
                    });
                    const enquiredCrews: CrewModel[] = [];
                    affectedPeoplesList.forEach((people: AffectedPeopleModel) => {
                        enquiredCrews.push(people.Crew);
                    });
                    this.affectedEnquiredCrews = Observable.of(enquiredCrews);
                    this.childModalEnquiredCrew.show();
                }
                else{
                    this.affectedEnquiredCrews = Observable.of([]);
                    this.childModalEnquiredCrew.show();
                }

            });
    }

    public hideEnquiredCrews(): void {
        this.childModalEnquiredCrew.hide();
    }
    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getPeopleOnboardCounts(this.currentIncidentId);
        //this.GetAllCargoDetails(this.currentIncidentId);
    }

    private openAllCargoDetails(): void {
        this.childModalCargos.show();
    }
    private hideAllCargoDetails(): void {
        this.childModalCargos.hide();
    }

    private initiateSearchConfigurations(): void {
        let Gender: NameValue<string>[] = [
            new NameValue<string>('Male', "Male"),
            new NameValue<string>('Female', "Female")
        ]
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'Passenger/PassengerName',
                Description: 'Passenger Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Passenger/Pnr',
                Description: 'PNR',
                Value: ''
            }), 
            new SearchTextBox({
                Name: 'Passenger/Seatno',
                Description: 'Seat Number',
                Value: ''
            }),   
            new SearchTextBox({
                Name: 'Passenger/Destination',
                Description: 'Destination',
                Value: ''
            }), 
            new SearchDropdown({
                Name: 'Passenger/PassengerGender',
                Description: 'Gender',
                PlaceHolder: 'Select Gender',
                Value: '',
                ListData: Observable.of(Gender)
            }),
            new SearchTextBox({
                Name: 'Passenger/PassengerNationality',
                Description: 'Passenger Nationality',
                Value: ''
            }), 
            new SearchTextBox({
                Name: 'Passenger/ContactNumber',
                Description: 'Contact Number',
                Value: ''
            }), 
            new SearchTextBox({
                Name: 'Passenger/PassengerType',
                Description: 'Passenger Type',
                Value: ''
            }),               
        ];
    }

    invokeSearch(query: string): void {         
        const involvedParties: InvolvePartyModel[] = [];
        const passengerListLocal: PassengerModel[] = [];    
        this.peopleOnBoardWidgetService.GetQueryForPassenger(query, this.currentIncidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                if (result.Records[0].Affecteds.length > 0) {
                    affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;
                    affectedPeoples.forEach((item: AffectedPeopleModel) => {
                        passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                    });
                    this.passengerList = Observable.of(passengerListLocal);
                }
            }, ((error: any) => {
                console.log(`Error: ${error}`);
            }));                       
    }  

    invokeReset(): void {   
        this.openAllPassengersDetails();     
    }  
}