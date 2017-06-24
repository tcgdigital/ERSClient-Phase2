import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';


import { InvolvePartyModel, CommunicationLogModel } from '../../../shared.components';
import { AffectedObjectsToView, AffectedObjectModel } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { EnquiryModel } from '../../call.centre/components/call.centre.model';
import { CallerModel, CallerService } from '../../caller';
import { NextOfKinModel } from '../../nextofkins';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService, GlobalConstants
} from '../../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


@Component({
    selector: 'affectedobject-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.list.view.html'
})
export class AffectedObjectsListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('childAffectedObjectDetailsModal') public childAffectedObjectDetailsModal: ModalDirective;




    constructor(private affectedObjectService: AffectedObjectsService,private callerservice: CallerService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private globalState: GlobalStateService, private _router: Router) { }
    affectedObjects: AffectedObjectsToView[] = [];
    affectedObjectDetails: AffectedObjectsToView = new AffectedObjectsToView();
    currentIncident: number;
    communications: CommunicationLogModel[] = [];
    AWBNumber: string = "";
    ticketNumber: string = "";
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;
    allcargostatus: any[] = GlobalConstants.CargoStatus;
    affectedObjId: number;
    callers: CallerModel[] = [];



    getAffectedObjects(incidentId): void {
        this.affectedObjectService.GetFilterByIncidentId(incidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.getAffectedObjects(this.currentIncident);
    }

    ngOnInit(): any {
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncident = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAffectedObjects(this.currentIncident);
                }
                else {
                    this.isArchive = false;
                    this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAffectedObjects(this.currentIncident);
                }
            }
        });

        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
    }

    openChatTrails(affectedObjectId): void {
        this.affectedObjectService.GetCommunicationByAWB(affectedObjectId)
            .subscribe((response: ResponseModel<AffectedObjectModel>) => {
                let responseModel: AffectedObjectModel = response.Records[0];
                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.AWBNumber = responseModel.Cargo.AWB;
                this.childModal.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelTrailModal(): void {
        this.childModal.hide();
    }

    updateobjId(id): void {
        this.affectedObjId = id;
    }

    updateStatus(statusId): void {
        let affectedObjectStatus = new AffectedObjectModel();
        affectedObjectStatus.deleteAttributes();
        affectedObjectStatus.LostFoundStatus = this.allcargostatus.find(x => x.key == statusId).value;
        affectedObjectStatus.AffectedObjectId = this.affectedObjId;
        this.affectedObjectService.UpdateStatus(affectedObjectStatus, this.affectedObjId)
            .subscribe((response1: AffectedObjectModel) => {
                this.getAffectedObjects(this.currentIncident);
            });

    }

    openAffectedObjectDetail(affectedObject: AffectedObjectsToView): void {
        this.affectedObjectDetails = affectedObject;
        if (this.affectedObjectDetails.LostFoundStatus != "NA") {
            this.affectedObjectDetails["MedicalStatusToshow"] = this.allcargostatus.find(x => { return x.value == affectedObject.LostFoundStatus; }).value;
        }
        this.affectedObjectService.GetCallerListForAffectedObject(affectedObject.AffectedObjectId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.callers = response.Records.map(x => {
                    return x.Caller;
                });
                this.childAffectedObjectDetailsModal.show();
            });

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
            this.affectedObjectService.CreateNok(nok)
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


    saveUpdateAffectedObject(affectedObject: AffectedObjectsToView) {
        let affectedObjectUpdate = new AffectedObjectModel();
        affectedObjectUpdate.Remarks = affectedObject.Remarks;
        affectedObjectUpdate.IdentificationDesc = affectedObject.IdentificationDesc;
        affectedObject.LostFoundStatus = affectedObject.LostFoundStatus;
        this.affectedObjectService.UpdateStatus(affectedObjectUpdate, affectedObject.AffectedObjectId)
            .subscribe((response: AffectedObjectModel) => {
                this.toastrService.success('Adiitional Information updated.')
                this.getAffectedObjects(this.currentIncident);
                this.childAffectedObjectDetailsModal.hide();
            }, (error: any) => {
                alert(error);
            });
    }

    cancelModal() {
        this.childAffectedObjectDetailsModal.hide();
    }
}