import { Component, OnInit, ViewEncapsulation, Input, ViewChild, OnDestroy } from '@angular/core';
import { PeopleOnBoardWidgetService } from './peopleOnBoard.widget.service';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { InvolvePartyModel } from '../../shared.components/involveparties';
import { AffectedPeopleModel } from '../../shared.components/affected.people/components/affected.people.model';
import { PassengerModel, CargoModel, CrewModel, GroundVictimModel } from '../../shared.components';
import { EnquiryModel } from '../../shared.components/call.centre/components/call.centre.model';
import {
    ResponseModel, UtilityService,
    GlobalStateService, KeyValue, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue, GlobalConstants
} from '../../../shared';

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
    @ViewChild('childModalGroundVictims') public childModalGroundVictims: ModalDirective;

    peopleOnBoard: PeopleOnBoardModel;
    public passengerList: Observable<PassengerModel[]>;

    public passengerListByGender: PassengerModel[] = [];
    public passengerListByNationality: PassengerModel[] = [];
    public passengerListByPaxType: PassengerModel[] = [];
    public searchConfigsPax: Array<SearchConfigModel<any>> = [];
    public searchConfigsCrew: Array<SearchConfigModel<any>> = [];
    public searchConfigsCargo: Array<SearchConfigModel<any>> = [];

    public crewList: Observable<CrewModel[]>;
    public enquiries: ResponseModel<EnquiryModel>;
    public affectedEnquiredPeoples: Observable<PassengerModel[]>;
    public affectedEnquiredCrews: Observable<CrewModel[]>;
    public groundVictimList: Observable<GroundVictimModel[]>;

    public cargoList: Observable<CargoModel[]>;
    public isShow: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    currentDepartmentId: number;
    currentIncidentIdLocal: number;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     * Creates an instance of PeopleOnBoardWidgetComponent.
     * @param {PeopleOnBoardWidgetService} peopleOnBoardWidgetService
     * @param {GlobalStateService} globalState
     *
     * @memberOf PeopleOnBoardWidgetComponent
     */
    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private globalState: GlobalStateService) { }

    getPeopleOnboardCounts(incident): void {
        this.peopleOnBoard = new PeopleOnBoardModel();
        this.peopleOnBoardWidgetService.GetPeopleOnBoardDataCount(incident)
            .takeUntil(this.ngUnsubscribe)
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
        this.initiateSearchConfigurationsPassenger();
        this.initiateSearchConfigurationsCrew();
        this.initiateSearchConfigurationsCargo();

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveIncidentBorrowingCompletionResponse.Key, (incidentId: number) => {
                Observable.timer(1000).subscribe(() => {
                    this.getPeopleOnboardCounts(this.currentIncidentId);
                });
            });

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceivePassengerImportCompletionResponse.Key, (count: number) => {
                if (count > 0)
                    Observable.timer(1000).subscribe(() => {
                        this.getPeopleOnboardCounts(this.currentIncidentId);
                    });
                else
                    this.toastrService.error(GlobalConstants.NotificationConstant.ReceivePassengerImportCompletionResponse.ErrorMessage,
                        GlobalConstants.NotificationConstant.ReceivePassengerImportCompletionResponse.ErrorTitle);
            });

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveCargoImportCompletionResponse.Key, (count: number) => {
                if (count > 0)
                    Observable.timer(1000).subscribe(() => {
                        this.getPeopleOnboardCounts(this.currentIncidentId);
                    });
                else
                    this.toastrService.error(GlobalConstants.NotificationConstant.ReceiveCargoImportCompletionResponse.ErrorMessage,
                        GlobalConstants.NotificationConstant.ReceiveCargoImportCompletionResponse.ErrorTitle);
            });

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveCrewImportCompletionResponse.Key, (count: number) => {
                if (count > 0)
                    Observable.timer(1000).subscribe(() => {
                        this.getPeopleOnboardCounts(this.currentIncidentId);
                    });
                else
                    this.toastrService.error(GlobalConstants.NotificationConstant.ReceiveCrewImportCompletionResponse.ErrorMessage,
                        GlobalConstants.NotificationConstant.ReceiveCrewImportCompletionResponse.ErrorTitle);
            });
    }

    public openAllPassengersDetails(): void {
        const involvedParties: InvolvePartyModel[] = [];
        const passengerListLocal: PassengerModel[] = [];

        this.peopleOnBoardWidgetService.GetAllPassengersByIncident(this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                if (result.Records[0].Affecteds.length > 0) {
                    affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople.sort((a, b) => {
                        if (a.Passenger.PassengerName < b.Passenger.PassengerName) return -1;
                        if (a.Passenger.PassengerName > b.Passenger.PassengerName) return 1;

                        return 0;
                    });
                    affectedPeoples.forEach((item: AffectedPeopleModel) => {
                        passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                    });
                    this.passengerList = Observable.of(passengerListLocal);
                    this.childModalPassengers.show();
                }
                else {
                    this.passengerList = Observable.of([]);
                    this.childModalPassengers.show();
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public GetAllCargoDetails(incidentId: number): void {
        const involvedParties: InvolvePartyModel[] = [];
        let cargoListLocal: CargoModel[] = [];

        this.peopleOnBoardWidgetService.GetAllCargosByIncident(incidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                cargoListLocal = result.Records[0].Flights[0].Cargoes;
                this.cargoList = Observable.of(cargoListLocal);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public openAllGroundVictims(): void {
        let groundVictimListLocal: GroundVictimModel[] = [];

        this.peopleOnBoardWidgetService.GetAllGroundVictimsByIncident(this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                groundVictimListLocal = result.Records[0].GroundVictims.sort((a, b) => {
                    if (a.GroundVictimName < b.GroundVictimName) return -1;
                    if (a.GroundVictimName > b.GroundVictimName) return 1;
                });
                this.groundVictimList = Observable.of(groundVictimListLocal);
                this.childModalGroundVictims.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public hideAllGroundVictims(): void {
        this.childModalGroundVictims.hide();
    }

    public openAllPassengersByFilter(filterValue: string, filterCriteria: string): void {
        const involvedParties: InvolvePartyModel[] = [];
        const passengerListLocal: PassengerModel[] = [];
        this.passengerListByGender = [];
        this.passengerListByNationality = [];
        this.passengerListByNationality = [];

        this.peopleOnBoardWidgetService.GetAllPassengersByIncident(this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                if (result.Records[0].Affecteds.length > 0) {
                    affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;
                    affectedPeoples.forEach((item: AffectedPeopleModel) => {
                        passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                    });
                    if (filterCriteria.toLowerCase() === 'gender')
                        this.passengerListByGender = passengerListLocal
                            .filter((a) => a.PassengerGender === filterValue);

                    if (filterCriteria.toLowerCase() === 'nationality')
                        this.passengerListByNationality = passengerListLocal
                            .filter((a) => a.PassengerNationality === filterValue);

                    if (filterCriteria.toLowerCase() === 'pax type')
                        this.passengerListByPaxType = passengerListLocal
                            .filter((a) => a.PassengerType === filterValue);
                }
                else {
                    this.passengerListByGender = [];
                    this.passengerListByNationality = [];
                    this.passengerListByNationality = [];
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
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
            .takeUntil(this.ngUnsubscribe)
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
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public hideEnquiredPassengers(): void {
        this.childModalEnquiredPassengers.hide();
    }

    public openAllCrewsDetails(): void {
        const involvedParties: InvolvePartyModel[] = [];
        const crewListLocal: CrewModel[] = [];

        this.peopleOnBoardWidgetService.GetAllCrewsByIncident(this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                if (result.Records[0].Affecteds.length > 0) {
                    affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople.sort((a, b) => {
                        if (a.Crew.CrewName < b.Crew.CrewName) return -1;
                        if (a.Crew.CrewName > b.Crew.CrewName) return 1;
                    });
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
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public hideAllCrews(): void {
        this.childModalCrews.hide();
    }

    public openEnquiredCrewsDetails(): void {
        let affectedPeoples: AffectedPeopleModel[];
        let AffectedPersonIds: number[];

        this.peopleOnBoardWidgetService.GetEnquiredAffectedCrew(this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
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
                else {
                    this.affectedEnquiredCrews = Observable.of([]);
                    this.childModalEnquiredCrew.show();
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public hideEnquiredCrews(): void {
        this.childModalEnquiredCrew.hide();
    }

    ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        // this.globalState.Unsubscribe('AffectedPersonStatusChanged');

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    invokeSearchPassenger(query: string): void {
        const involvedParties: InvolvePartyModel[] = [];
        const passengerListLocal: PassengerModel[] = [];

        if (query !== '') {
            this.peopleOnBoardWidgetService.GetQueryForPassenger(query, this.currentIncidentId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                    let affectedPeoples: AffectedPeopleModel[];
                    if (result.Records[0].Affecteds.length > 0) {
                        affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;

                        affectedPeoples.forEach((item: AffectedPeopleModel) => {
                            passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                        });
                        this.passengerList = Observable.of(passengerListLocal);
                    }
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.openAllPassengersDetails();
        }
    }

    invokeResetPassenger(): void {
        this.openAllPassengersDetails();
    }

    invokeSearchCrew(query: string): void {
        const involvedParties: InvolvePartyModel[] = [];
        const crewListLocal: CrewModel[] = [];

        if (query !== '') {
            this.peopleOnBoardWidgetService.GetQueryForCrew(query, this.currentIncidentId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                    let affectedPeoples: AffectedPeopleModel[];

                    if (result.Records[0].Affecteds.length > 0) {
                        affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;

                        affectedPeoples.forEach((item: AffectedPeopleModel) => {
                            crewListLocal.push(UtilityService.pluck(item, ['Crew'])[0]);
                        });
                        this.crewList = Observable.of(crewListLocal);
                    }
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.openAllCrewsDetails();
        }
    }

    invokeResetCrew(): void {
        this.openAllCrewsDetails();
    }

    invokeSearchCargo(query: string): void {
        let cargoListLocal: CargoModel[] = [];
        if (query !== '') {
            this.peopleOnBoardWidgetService.GetQueryForCargo(query, this.currentIncidentId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                    cargoListLocal = result.Records[0].Flights[0].Cargoes;
                    this.cargoList = Observable.of(cargoListLocal);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.openAllCargoDetails();
        }
    }

    invokeResetCargo(): void {
        this.openAllCargoDetails();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getPeopleOnboardCounts(this.currentIncidentId);
    }

    private openAllCargoDetails(): void {
        const involvedParties: InvolvePartyModel[] = [];
        let cargoListLocal: CargoModel[] = [];

        this.peopleOnBoardWidgetService.GetAllCargosByIncident(this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                cargoListLocal = result.Records[0].Flights[0].Cargoes.sort((a, b) => {
                    if (a.AWB < b.AWB) return -1;
                    if (a.AWB > b.AWB) return 1;

                    return 0;
                });
                this.cargoList = Observable.of(cargoListLocal);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });

        this.childModalCargos.show();
    }
    private hideAllCargoDetails(): void {
        this.childModalCargos.hide();
    }

    private initiateSearchConfigurationsPassenger(): void {
        const Gender: Array<NameValue<string>> = [
            new NameValue<string>('Male', 'Male'),
            new NameValue<string>('Female', 'Female')
        ];

        this.searchConfigsPax = [
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

    private initiateSearchConfigurationsCrew(): void {
        this.searchConfigsCrew = [
            new SearchTextBox({
                Name: 'Crew/EmployeeNumber',
                Description: 'Employee Number',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Crew/CrewName',
                Description: 'Employee Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Crew/ContactNumber',
                Description: 'Contact Number',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Crew/AsgCat',
                Description: 'Assigned Category',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Crew/DeadheadCrew',
                Description: 'Operating Crew',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Crew/BaseLocation',
                Description: 'Base Location',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Crew/DepartureStationCode',
                Description: 'Departure Station',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Crew/ArrivalStationCode',
                Description: 'Arrival Station',
                Value: ''
            }),
            // new SearchTextBox({
            //     Name: 'Crew/WorkPosition',
            //     Description: 'Work Position',
            //     Value: ''
            // }),
            new SearchTextBox({
                Name: 'Crew/Email',
                Description: 'Email Id',
                Value: ''
            })
        ];
    }

    private initiateSearchConfigurationsCargo(): void {
        this.searchConfigsCargo = [
            new SearchTextBox({
                Name: 'AWB',
                Description: 'AWB Number',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'POL',
                Description: 'POL',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'POU',
                Description: 'POU',
                Value: ''
            }),
            // new SearchTextBox({
            //     Name: 'mftpcs',
            //     Description: 'Cargo Pieces',
            //     Value: ''
            // }),
            // new SearchTextBox({
            //     Name: 'mftwgt',
            //     Description: 'Cargo Weight',
            //     Value: ''
            // }),
            new SearchTextBox({
                Name: 'CargoType',
                Description: 'Cargo Type',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Origin',
                Description: 'Origin',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Destination',
                Description: 'Destination',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'ShipperName',
                Description: 'Shipper Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'ShipperContactNo',
                Description: 'Shipper Contact Number',
                Value: ''
            }),
        ];
    }
}