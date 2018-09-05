import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable, Subject } from 'rxjs/Rx';

import { InvolvePartyModel, CommunicationLogModel } from '../../../shared.components';
import { AffectedObjectsToView, AffectedObjectModel } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { EnquiryModel } from '../../call.centre/components/call.centre.model';
import { CallerModel, CallerService } from '../../caller';
import { NextOfKinModel } from '../../nextofkins';
import {
    ResponseModel, GlobalStateService, KeyValue, UtilityService, GlobalConstants,
    SearchConfigModel, SearchTextBox, SearchDropdown, NameValue
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService, DepartmentModel } from '../../../masterdata';

@Component({
    selector: 'affectedobject-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.list.view.html'
})
export class AffectedObjectsListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('childAffectedObjectDetailsModal') public childAffectedObjectDetailsModal: ModalDirective;

    affectedObjects: AffectedObjectsToView[] = [];
    affectedObjectDetails: AffectedObjectsToView = new AffectedObjectsToView();
    currentIncident: number;
    communications: CommunicationLogModel[] = [];
    AWBNumber: string = '';
    ticketNumber: string = '';
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;
    allcargostatus: any[] = GlobalConstants.CargoStatus;
    affectedObjId: number;
    callers: CallerModel[] = [];
    searchConfigs: Array<SearchConfigModel<any>> = new Array<SearchConfigModel<any>>();
    downloadPath: string;
    expandSearch: boolean = false;
    searchValue: string = 'Expand Search';
    currentDepartmentId: number;
    public currentDepartmentName: string;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private affectedObjectService: AffectedObjectsService,
        private callerservice: CallerService,
        private toastrService: ToastrService,
        private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private _router: Router) { }

    getAffectedObjects(incidentId): void {
        this.affectedObjectService.GetFilterByIncidentId(incidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    expandSearchPanel(value): void {
        if (!value) {
            this.searchValue = 'Hide Search Panel';
        }
        else {
            this.searchValue = 'Expand Search Panel';
        }
        this.expandSearch = !this.expandSearch;
    }

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/CargoStatusInfo/' + this.currentIncident;
        this.getAffectedObjects(this.currentIncident);
    }

    ngOnInit(): any {
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncident = +UtilityService.GetFromSession('ArchieveIncidentId');
            this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        }
        else {
            this.isArchive = false;
            this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
            this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        }

        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/CargoStatusInfo/' + this.currentIncident;
        this.getAffectedObjects(this.currentIncident);
        this.getCurrentDepartmentName(this.currentDepartmentId);

        this.initiateSearchConfigurations();
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveIncidentBorrowingCompletionResponse.Key, () => {
                this.getAffectedObjects(this.currentIncident);
            });
    }

    ngOnDestroy(): void {
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    openChatTrails(affectedObjectId): void {
        this.affectedObjectService.GetCommunicationByAWB(affectedObjectId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<AffectedObjectModel>) => {
                const responseModel: AffectedObjectModel = response.Records[0];
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
        const affectedObjectStatus = new AffectedObjectModel();
        affectedObjectStatus.deleteAttributes();
        affectedObjectStatus.LostFoundStatus = this.allcargostatus.find((x) => x.key === statusId).value;
        affectedObjectStatus.AffectedObjectId = this.affectedObjId;

        this.affectedObjectService.UpdateStatus(affectedObjectStatus, this.affectedObjId)
            .subscribe((response1: AffectedObjectModel) => {
                this.getAffectedObjects(this.currentIncident);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    openAffectedObjectDetail(affectedObject: AffectedObjectsToView): void {
        this.affectedObjectDetails = affectedObject;
        if (this.affectedObjectDetails.LostFoundStatus !== 'NA') {
            this.affectedObjectDetails['MedicalStatusToshow'] = this.allcargostatus
                .find((x) => x.value === affectedObject.LostFoundStatus).value;
        }

        this.affectedObjectService.GetCallerListForAffectedObject(affectedObject.AffectedObjectId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.callers = response.Records.map((x) => {
                    return x.Caller;
                });
                this.childAffectedObjectDetailsModal.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    saveNok(affectedObjectId, caller: CallerModel, event: any): void {
        if (event.checked) {
            const nok = new NextOfKinModel();
            nok.AffectedObjectId = affectedObjectId;
            nok.AlternateContactNumber = caller.AlternateContactNumber;
            nok.CallerId = caller.CallerId;
            nok.ContactNumber = caller.ContactNumber;
            nok.IncidentId = this.currentIncident;
            nok.NextOfKinName = caller.FirstName + '  ' + caller.LastName;
            nok.Relationship = caller.Relationship;
            nok.Location = caller.Location;
            const callertoupdate = new CallerModel();
            callertoupdate.IsNok = true;
            callertoupdate.deleteAttributes();

            this.affectedObjectService.CreateNok(nok)
                .flatMap(() => this.callerservice.Update(callertoupdate, caller.CallerId))
                .subscribe(() => {
                    this.toastrService.success('NOK updated.');
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            const callertoupdate = new CallerModel();
            callertoupdate.IsNok = false;
            callertoupdate.deleteAttributes();
            this.callerservice.Update(callertoupdate, caller.CallerId)
                .subscribe(() => {
                    this.toastrService.success('NOK updated.');
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    searchAffectedObject(query: string, incidentId: number): void {
        this.affectedObjectService.GetAffectedObjectQuery(incidentId, query)
            .takeUntil(this.ngUnsubscribe)
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
                    query = query.replace("'true'", 'true');
                if (query.indexOf("'false'") >= 0)
                    query = query.replace("'false'", 'false');
            }
            this.searchAffectedObject(query, this.currentIncident);
        }
        else {
            this.getAffectedObjects(this.currentIncident);
        }
    }

    invokeReset(): void {
        this.getAffectedObjects(this.currentIncident);
    }

    getCurrentDepartmentName(departmentId): void {
        this.departmentService.Get(departmentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    saveUpdateAffectedObject(affectedObject: AffectedObjectsToView) {
        const affectedObjectUpdate = new AffectedObjectModel();
        affectedObjectUpdate.Remarks = affectedObject.Remarks;
        affectedObjectUpdate.IdentificationDesc = affectedObject.IdentificationDesc;
        affectedObjectUpdate.LostFoundStatus = affectedObject.LostFoundStatus;
        debugger;
        
        const additionalHeader: NameValue<string>
            = new NameValue<string>('CurrentDepartmentName', this.currentDepartmentName);

        this.affectedObjectService.UpdateStatusWithHeader
            (affectedObjectUpdate, affectedObject.AffectedObjectId, additionalHeader)
            .subscribe((response: AffectedObjectModel) => {
                this.toastrService.success('Adiitional Information updated.');
                this.getAffectedObjects(this.currentIncident);
                this.childAffectedObjectDetailsModal.hide();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelModal() {
        this.childAffectedObjectDetailsModal.hide();
    }

    private initiateSearchConfigurations(): void {
        const cargostatus: Array<NameValue<string>> = GlobalConstants.CargoStatus.map((x) => new NameValue<string>(x.caption, x.caption));
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
                Name: 'Cargo/POU',
                Description: 'POU',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Cargo/POL',
                Description: 'POL',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Cargo/CargoType',
                Description: 'Cargo Type',
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
        ];
    }
}