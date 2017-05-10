import { Component, OnInit, ViewEncapsulation, Input, ViewChild, OnDestroy } from '@angular/core';
import { PeopleOnBoardWidgetService } from './peopleOnBoard.widget.service';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Observable } from 'rxjs/Rx';
import { InvolvePartyModel } from '../../shared.components/involveparties';
import { AffectedPeopleModel } from '../../shared.components/affected.people/components/affected.people.model';
import { PassengerModel } from '../../shared.components/passenger';
import { CrewModel } from '../../shared.components/crew';
import { EnquiryModel } from '../../shared.components/call.centre/components/call.centre.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase, UtilityService,
    GlobalStateService, KeyValue
} from '../../../shared';

@Component({
    selector: 'peopleOnBoard-widget',
    templateUrl: './peopleOnBoard.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PeopleOnBoardWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('currentIncidentId') currentIncidentId: number;

    @ViewChild('childModalPassengers') public childModalPassengers: ModalDirective;
    @ViewChild('childModalCrews') public childModalCrews: ModalDirective;
    @ViewChild('childModalEnquiredPassengers') public childModalEnquiredPassengers: ModalDirective;
    @ViewChild('childModalEnquiredCrew') public childModalEnquiredCrew: ModalDirective;

    peopleOnBoard: PeopleOnBoardModel;
    public passengerList: Observable<PassengerModel[]>;
    public crewList: Observable<CrewModel[]>;
    public enquiries: ResponseModel<EnquiryModel>;
    public affectedEnquiredPeoples: Observable<PassengerModel[]>;
    public affectedEnquiredCrews: Observable<CrewModel[]>;
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

    public hideAllPassengers(): void {
        this.childModalPassengers.hide();
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
    }
}