import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { InvolvePartyModel, CommunicationLogModel } from '../../../shared.components';
import { InvolvePartyService } from '../../involveparties';
//import { EnquiryService } from '../../call.centre/components/call.centre.service';
import { EnquiryModel } from '../../call.centre/components/call.centre.model';
import { CallerModel, CallerService } from '../../caller';
import { PassengerModel } from '../../passenger';
import { NextOfKinModel } from '../../nextofkins';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import {
    ResponseModel, DataExchangeService, GlobalConstants,
    GlobalStateService, UtilityService, KeyValue
} from '../../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'affectedpeople-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.list.view.html'
})
export class AffectedPeopleListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('childModalForTrail') public childModalForTrail: ModalDirective;
    @ViewChild('childModalForCallers') public childModalForCallers: ModalDirective;

    affectedPeople: AffectedPeopleToView[] = [];
    currentIncident: number;
    affectedPersonToUpdate: AffectedPeopleModel = new AffectedPeopleModel();
    IsDestroyed: boolean;
    affectedPersonModelForStatus: AffectedPeopleToView = new AffectedPeopleToView();
    medicalStatus: any[] = GlobalConstants.MedicalStatus;
    pdaNameForTrail: string = "";
    pdaReferenceNumberForTrail: string = "";
    communications: CommunicationLogModel[] = [];
    ticketNumber: string = "";
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    callers: CallerModel[] = [];
    affectedPersonModel: AffectedPeopleModel = new AffectedPeopleModel();
    nextOfKins: NextOfKinModel[] = [];

    /**
     * Creates an instance of AffectedPeopleListComponent.
     * 
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {InvolvePartyService} involvedPartyService
     * @param {DataExchangeService<number>} dataExchange
     * @param {GlobalStateService} globalState
     * 
     * @memberOf AffectedPeopleListComponent
     */
    constructor(private affectedPeopleService: AffectedPeopleService, private callerservice: CallerService,
        private involvedPartyService: InvolvePartyService, private dataExchange: DataExchangeService<number>,
        private globalState: GlobalStateService, private _router: Router, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig
        //, private enquiryService: EnquiryService
    ) { }

    //   medicalStatusForm: string = "";

    /**
     * 
     * 
     * @param {AffectedPeopleToView} affectedPerson
     * 
     * @memberOf AffectedPeopleListComponent
     */
    openAffectedPersonDetail(affectedPerson: AffectedPeopleToView): void {
        this.affectedPersonModelForStatus = affectedPerson;
        if (affectedPerson.MedicalStatus != "NA") {
            this.affectedPersonModelForStatus["MedicalStatusToshow"] = this.medicalStatus.find(x => { return x.value == affectedPerson.MedicalStatus; }).value;
        }
        this.affectedPeopleService.GetCallerListForAffectedPerson(affectedPerson.AffectedPersonId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.callers = response.Records.map(x => {
                    return x.Caller;
                });
                this.childModal.show();
            });


    }

    cancelModal() {
        this.childModal.hide();
    }

    saveUpdateAffectedPerson(affectedModifiedForm: AffectedPeopleToView): void {
        this.affectedPersonToUpdate.AffectedPersonId = affectedModifiedForm.AffectedPersonId;
        this.affectedPersonToUpdate.Identification = affectedModifiedForm.Identification;
        this.affectedPersonToUpdate.MedicalStatus = affectedModifiedForm["MedicalStatusToshow"];
        this.affectedPersonToUpdate.Remarks = affectedModifiedForm.Remarks;
        let pasengerModel = new PassengerModel();
        pasengerModel.CoTravellerInformation = affectedModifiedForm.CoTravellerInformation;
        this.affectedPeopleService.Update(this.affectedPersonToUpdate)
            .subscribe((response: AffectedPeopleModel) => {
                if (affectedModifiedForm.PassengerId != null && affectedModifiedForm.PassengerId != 0 && affectedModifiedForm.PassengerId != undefined) {
                    this.passengerUpdate(pasengerModel, this.affectedPersonToUpdate.PassengerId);
                }
                this.toastrService.success('Additional Information updated.')
                this.getAffectedPeople(this.currentIncident);
                affectedModifiedForm["MedicalStatusToshow"] = affectedModifiedForm.MedicalStatus;
                let num = UtilityService.UUID();
                this.globalState.NotifyDataChanged('AffectedPersonStatusChanged', num);
                this.childModal.hide();
            }, (error: any) => {
                alert(error);
            });
    }

    passengerUpdate(passenger: PassengerModel, key: number): void {
        this.affectedPeopleService.updatePassanger(passenger, key)
            .subscribe((response: PassengerModel) => {

            });
    }


    cancelUpdate(affectedModifiedForm: AffectedPeopleToView): void {
        this.childModal.hide();
        this.affectedPersonModelForStatus = new AffectedPeopleToView();

    }

    getAffectedPeople(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                this.affectedPeople.forEach(x =>
                    function () {
                        x["MedicalStatusToshow"] = x.MedicalStatus;
                        x["showDiv"] = false;

                    });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.getAffectedPeople(this.currentIncident);
    }

    ngOnInit(): any {
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncident = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAffectedPeople(this.currentIncident);
                }
                else {
                    this.isArchive = false;
                    this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAffectedPeople(this.currentIncident);
                }
            }
        });

        this.IsDestroyed = false;
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
    }
    IsNokInformed(event : any,id : number){
        let affectedpersonToUpdate = new AffectedPeopleModel();
        affectedpersonToUpdate.IsNokInformed = event.checked;
        affectedpersonToUpdate.AffectedPersonId = id;
        this.affectedPeopleService.Update(affectedpersonToUpdate,id)
            .subscribe((response: AffectedPeopleModel) => {
                this.toastrService.success('NOK is informed.')
                this.getAffectedPeople(this.currentIncident);
            }, (error: any) => {
                alert(error);
            });

    }
    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
    }

    openChatTrails(affectedPersonId: number): void {
        this.affectedPeopleService.GetCommunicationByPDA(affectedPersonId)
            .subscribe((response: ResponseModel<AffectedPeopleModel>) => {
                let responseModel: AffectedPeopleModel = response.Records[0];
                this.pdaNameForTrail = responseModel.Passenger != null ? responseModel.Passenger.PassengerName.toUpperCase() : '';
                this.pdaNameForTrail = this.pdaNameForTrail ? this.pdaNameForTrail : responseModel.Crew != null ? responseModel.Crew.CrewName.toUpperCase() : '';
                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.childModalForTrail.show();

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelTrailModal() {
        this.childModalForTrail.hide();
    }

    openCallerList(affectedperson): void {
        this.affectedPersonModel = affectedperson;
        this.affectedPeopleService.GetCallerListForAffectedPerson(affectedperson.AffectedPersonId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.callers = response.Records.map(x => {
                    return x.Caller;
                });
                this.callers.forEach(x => {
                    x["isnok"] = false;
                });
                //  this.childModalForCallers.show();
            });
    }

    cancelCallersModal() {
        this.childModalForCallers.hide();
    }

    saveNok(affectedpersonId, caller: CallerModel, event: any): void {
        if (event.checked) {
            let nok = new NextOfKinModel();
            nok.AffectedPersonId = affectedpersonId;
            nok.AlternateContactNumber = caller.AlternateContactNumber;
            nok.CallerId = caller.CallerId;
            nok.ContactNumber = caller.ContactNumber;
            nok.IncidentId = this.currentIncident;
            nok.NextOfKinName = caller.FirstName + "  " + caller.LastName;
            nok.Relationship = caller.Relationship;
            nok.Location = caller.Location;
            let callertoupdate = new CallerModel();
            callertoupdate.IsNok = true;
            callertoupdate.deleteAttributes();
            this.affectedPeopleService.CreateNok(nok)
                .flatMap(() => this.callerservice.Update(callertoupdate, caller.CallerId))
                .subscribe(() => {
                    this.toastrService.success('NOK updated.')
                });
        }
        else {
            let callertoupdate = new CallerModel();
            callertoupdate.IsNok = false;
            callertoupdate.deleteAttributes();
            this.callerservice.Update(callertoupdate, caller.CallerId)
                .subscribe(() => {
                    this.toastrService.success('NOK updated.')
                });
        }

    }
}