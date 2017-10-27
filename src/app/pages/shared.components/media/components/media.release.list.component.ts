import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
import { MediaModel } from './media.model';
import { MediaService } from './media.service';
import { Router } from '@angular/router';
import {
    ResponseModel, DataExchangeService, GlobalConstants,
    GlobalStateService, KeyValue, UtilityService
} from '../../../../shared';

@Component({
    selector: 'mediaRelease-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.list.view.html'
})
export class MediaReleaseListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    mediaReleases: MediaModel[] = [];
    currentIncidentId: number;
    currentDepartmentId: number;
    downloadPath: string;
    isArchive: boolean = false;
    /**
     * Creates an instance of MediaReleaseListComponent.
     * @param {MediaService} mediaService
     * @param {DataExchangeService<MediaModel>} dataExchange
     * @param {GlobalStateService} globalState
     *
     * @memberOf MediaReleaseListComponent
     */
    constructor(private mediaService: MediaService,
        private dataExchange: DataExchangeService<MediaModel>,
        private globalState: GlobalStateService, private _router: Router) { }

    getMediaReleases(departmentId: number, incidentId: number): void {
        this.mediaService.Query(departmentId, incidentId)
            .subscribe((response: ResponseModel<MediaModel>) => {
                this.mediaReleases = response.Records;
                // console.log(this.mediaReleases);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onMediaSuccess(mediaQuery: MediaModel): void {
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdateMediaRelease(mediaQueryModelUpdate: MediaModel): void {
        const mediaReleaseModelToSend = Object.assign({}, mediaQueryModelUpdate);
        this.dataExchange.Publish('OnMediaReleaseUpdate', mediaReleaseModelToSend);
    }

    ngOnInit(): void {
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.initiatedDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/Media/' + this.currentIncidentId + '/';
        this.dataExchange.Subscribe('MediaModelSaved', (model) => this.onMediaSuccess(model));
        this.dataExchange.Subscribe('MediaModelUpdated', (model) => this.onMediaSuccess(model));
        this.dataExchange.Subscribe('MediaModelApprovalUpdated', (model) => this.onMediaSuccess(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));

        // Signalr Notification
        this.globalState.Subscribe('ReceiveMediaMessageCreatedResponse', (model: MediaModel) =>
            this.getMediaReleases(model.InitiateDepartmentId, model.IncidentId));

        this.globalState.Subscribe('ReceiveMediaMessageUpdateResponse', (model: MediaModel) =>
            this.getMediaReleases(model.InitiateDepartmentId, model.IncidentId));

        this.globalState.Subscribe('ReceiveMediaMessageApprovedResponse', (model: MediaModel) =>
            this.getMediaReleases(model.InitiateDepartmentId, model.IncidentId));

        this.globalState.Subscribe('ReceiveMediaMessageRejectedResponse', (model: MediaModel) =>
            this.getMediaReleases(model.InitiateDepartmentId, model.IncidentId));
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe('MediaModelSaved');
        //this.dataExchange.Unsubscribe('MediaModelUpdated');
        //this.dataExchange.Unsubscribe('MediaModelApprovalUpdated');
        //this.globalState.Unsubscribe('incidentChangefromDashboard');
        //this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/Media/' + this.currentIncidentId + '/';
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }
}