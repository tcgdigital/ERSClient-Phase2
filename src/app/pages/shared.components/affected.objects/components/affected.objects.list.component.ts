import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';


import { InvolvePartyModel, CommunicationLogModel } from '../../../shared.components';
import { AffectedObjectsToView, AffectedObjectModel } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { EnquiryModel } from '../../call.centre/components/call.centre.model';
import { CallerModel, CallerService } from '../../caller';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService, GlobalConstants,
    SearchConfigModel, SearchTextBox, SearchDropdown, NameValue
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




    constructor(private affectedObjectService: AffectedObjectsService,
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
    searchConfigs: Array<SearchConfigModel<any>> = new Array<SearchConfigModel<any>>();



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
        this.initiateSearchConfigurations();
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
    searchAffectedObject(query: string, incidentId: number): void {
        this.affectedObjectService.GetAffectedObjectQuery(incidentId, query)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            if (query.indexOf('IsVerified') >= 0) {
                if (query.indexOf("'true'") >= 0)
                    query = query.replace("'true'", "true");
                if (query.indexOf("'false'") >= 0)
                    query = query.replace("'false'", "false");
            }
        }
        this.searchAffectedObject(query, this.currentIncident);
    }

    invokeReset(): void {
        this.getAffectedObjects(this.currentIncident);
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
    private initiateSearchConfigurations(): void {
        let cargostatus: Array<NameValue<string>> = GlobalConstants.CargoStatus.map(x => new NameValue<string>(x.caption, x.caption))
        const status: Array<NameValue<string>> = [
            new NameValue<string>('Active', 'true'),
            new NameValue<string>('InActive', 'false'),
        ] as Array<NameValue<string>>;
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'TicketNumber',
                Description: 'Reference Number',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'AWB',
                Description: 'Air Way Bill',
                Value: '',
            }),
            new SearchTextBox({
                Name: 'mftpcs',
                Description: 'Manifest Pieces',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'mftwgt',
                Description: 'Manifest weight',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'POU',
                Description: 'POU',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'POL',
                Description: 'POL',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'LostFoundStatus',
                Description: 'Cargo Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(cargostatus)
            }),
            new SearchDropdown({
                Name: 'IsVerified',
                Description: 'Verification Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            })
        ]
    }
}