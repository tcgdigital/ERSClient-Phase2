import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
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
    ServiceBase, UtilityService
} from '../../../shared';
import { GlobalStateService } from '../../../shared';

@Component({
    selector: 'peopleOnBoard-widget',
    templateUrl: './peopleOnBoard.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PeopleOnBoardWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
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
    currentIncidentId: number;


    /**
     * Creates an instance of PeopleOnBoardWidgetComponent.
     * @param {PeopleOnBoardWidgetService} peopleOnBoardWidgetService 
     * 
     * @memberOf PeopleOnBoardWidgetComponent
     */

    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService,
        private globalState: GlobalStateService) { }

    getPeopleOnboardCounts(incident): void {
        this.peopleOnBoard = new PeopleOnBoardModel();
        this.peopleOnBoardWidgetService.GetPeopleOnBoardDataCount(incident)
            .subscribe(peopleOnBoardObservable => {
                console.log(peopleOnBoardObservable);
                this.peopleOnBoard = peopleOnBoardObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.getPeopleOnboardCounts(this.currentIncidentId);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));

    };

    private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
        this.getPeopleOnboardCounts(this.currentIncidentId);
    };

    public openAllPassengersDetails(): void {
        let involvedParties: InvolvePartyModel[] = [];
        let passengerListLocal: PassengerModel[] = [];
        this.peopleOnBoardWidgetService.GetAllPassengersByIncident(this.incidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;
                affectedPeoples.forEach((item: AffectedPeopleModel) => {
                    passengerListLocal.push(UtilityService.pluck(item, ['Passenger'])[0]);
                });
                this.passengerList = Observable.of(passengerListLocal);
                this.childModalPassengers.show();
            });

    }

    public hideAllPassengers(): void {
        this.childModalPassengers.hide();
    }

    public openEnquiredPassengersDetails(): void {
        let AffectedPeoples: ResponseModel<EnquiryModel>;
        let affectedPeoples: AffectedPeopleModel[];
        let AffectedPersonIds: number[];
        this.peopleOnBoardWidgetService.GetEnquiredAffectedPeople(this.incidentId)
            .map((dataEnquiryModels: ResponseModel<EnquiryModel>) => {
                this.enquiries = dataEnquiryModels;
                return this.enquiries;
            })
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.peopleOnBoardWidgetService.GetAllPassengersByIncident(this.incidentId))
            .subscribe((dataInvolvePartyModels: ResponseModel<InvolvePartyModel>) => {
                AffectedPersonIds = [];
                this.enquiries.Records.forEach((itemEnquiry: EnquiryModel) => {
                    AffectedPersonIds.push(itemEnquiry.AffectedPersonId);
                });
                affectedPeoples = dataInvolvePartyModels.Records[0].Affecteds[0].AffectedPeople;
                let affectedPeoplesList: AffectedPeopleModel[] = [];
                affectedPeoplesList = affectedPeoples.filter((itemAffectedPeople: AffectedPeopleModel) => {
                    return AffectedPersonIds.some((someItem) => {
                        return (someItem == itemAffectedPeople.AffectedPersonId);
                    });
                });
                let enquiredPassengers: PassengerModel[] = [];
                affectedPeoplesList.forEach((people: AffectedPeopleModel) => {
                    enquiredPassengers.push(people.Passenger);
                });
                this.affectedEnquiredPeoples = Observable.of(enquiredPassengers);
                this.childModalEnquiredPassengers.show();
            });
    }

    public hideEnquiredPassengers(): void {
        this.childModalEnquiredPassengers.hide();
    }

    public openAllCrewsDetails(): void {
        let involvedParties: InvolvePartyModel[] = [];
        let crewListLocal: CrewModel[] = [];
        this.peopleOnBoardWidgetService.GetAllCrewsByIncident(this.incidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                let affectedPeoples: AffectedPeopleModel[];
                affectedPeoples = result.Records[0].Affecteds[0].AffectedPeople;
                affectedPeoples.forEach((item: AffectedPeopleModel) => {
                    crewListLocal.push(UtilityService.pluck(item, ['Crew'])[0]);
                });
                this.crewList = Observable.of(crewListLocal);
                this.childModalCrews.show();
            });
    }

    public hideAllCrews(): void {
        this.childModalCrews.hide();
    }

    public openEnquiredCrewsDetails(): void {
        let AffectedPeoples: ResponseModel<EnquiryModel>;
        let affectedPeoples: AffectedPeopleModel[];
        let AffectedPersonIds: number[];
        this.peopleOnBoardWidgetService.GetEnquiredAffectedCrew(this.incidentId)
            .map((dataEnquiryModels: ResponseModel<EnquiryModel>) => {
                this.enquiries = dataEnquiryModels;
                return this.enquiries;
            })
            .flatMap((dataEnquiryModels: ResponseModel<EnquiryModel>) => this.peopleOnBoardWidgetService.GetAllCrewsByIncident(this.incidentId))
            .subscribe((dataInvolvePartyModels: ResponseModel<InvolvePartyModel>) => {
                AffectedPersonIds = [];
                this.enquiries.Records.forEach((itemEnquiry: EnquiryModel) => {
                    AffectedPersonIds.push(itemEnquiry.AffectedPersonId);
                });
                affectedPeoples = dataInvolvePartyModels.Records[0].Affecteds[0].AffectedPeople;
                let affectedPeoplesList: AffectedPeopleModel[] = [];
                affectedPeoplesList = affectedPeoples.filter((itemAffectedPeople: AffectedPeopleModel) => {
                    return AffectedPersonIds.some((someItem) => {
                        return (someItem == itemAffectedPeople.AffectedPersonId &&
                            itemAffectedPeople.Crew != null);
                    });
                });
                let enquiredCrews: CrewModel[] = [];
                affectedPeoplesList.forEach((people: AffectedPeopleModel) => {
                    enquiredCrews.push(people.Crew);
                });
                this.affectedEnquiredCrews = Observable.of(enquiredCrews);
                this.childModalEnquiredCrew.show();
            });
    }

    public hideEnquiredCrews(): void {
        this.childModalEnquiredCrew.hide();
    }
    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    };
}