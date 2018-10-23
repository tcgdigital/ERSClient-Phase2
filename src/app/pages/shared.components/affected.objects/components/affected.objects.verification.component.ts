import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription, Subject, Observable } from 'rxjs/Rx';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import {
    ResponseModel, GlobalStateService, UtilityService,
    KeyValue, AuthModel, GlobalConstants
} from '../../../../shared';

@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.verification.html'
})
export class AffectedObjectsVerificationComponent implements OnInit {
    public isShowVerifyAffectedCargo: boolean = true;
    public isVerifiedCargoManifestDownloadLink: boolean = true;
    public currentDepartmentId: number = 0;
    protected _onRouteChange: Subscription;
    affectedObjectsForVerification: AffectedObjectsToView[] = [];
    verifiedAffectedObjects: AffectedObjectModel[];
    date: Date = new Date();
    currentIncident: number;
    isArchive: boolean = false;
    allSelectVerify: boolean;
    userid: number;
    credential: AuthModel;
    downloadPath: string;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of AffectedObjectsVerificationComponent.
     * @param {AffectedObjectsService} affectedObjectsService
     * @param {GlobalStateService} globalState
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @param {Router} _router
     * @memberof AffectedObjectsVerificationComponent
     */
    constructor(private affectedObjectsService: AffectedObjectsService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private _router: Router) { }


    getAffectedObjects(incidentId): void {
        this.affectedObjectsService.GetFilterByIncidentId(incidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                if (response.Records[0]) {
                    this.affectedObjectsForVerification = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
                }
                this.isVerifiedStatusChange();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    selectAllVerify(value: any): void {
        this.affectedObjectsForVerification.forEach((x) => {
            x.IsVerified = value.checked;
        });
    }

    isVerifiedStatusChange(): void {
        this.allSelectVerify = this.affectedObjectsForVerification.length != 0
            && this.affectedObjectsForVerification.filter((x) => {
                return x.IsVerified == true;
            }).length == this.affectedObjectsForVerification.length;
    }

    saveVerifiedObjects(): void {
        const datenow = this.date;
        this.verifiedAffectedObjects = this.affectedObjectsService.MapAffectedPeopleToSave(this.affectedObjectsForVerification, this.userid);
        this.affectedObjectsService.CreateBulkObjects(this.verifiedAffectedObjects)
            .subscribe((response: AffectedObjectModel[]) => {
                this.toastrService.success('Selected Objects are verified.', 'Success', this.toastrConfig);
                this.getAffectedObjects(this.currentIncident);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/CargoVerifiedManifest/' + this.currentIncident;
        this.getAffectedObjects(this.currentIncident);
    }

    ngOnInit(): any {
        this.isArchive = false;
        this.allSelectVerify = false;
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard,
            (model: KeyValue) => this.departmentChangeHandler(model));

        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncident = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/CargoVerifiedManifest/' + this.currentIncident;
        this.getAffectedObjects(this.currentIncident);
        this.credential = UtilityService.getCredentialDetails();
        this.userid = +this.credential.UserId;

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveIncidentBorrowingCompletionResponse.Key, () => {
                this.getAffectedObjects(this.currentIncident);
            });
    }

    ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }
}