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
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'mediaRelease-approval-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.approval.list.view.html'
})
export class MediaReleaseApprovalListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    mediaReleases: MediaModel[] = [];
    currentIncidentId: number;
    currentDepartmentId: number;
    downloadPath: string;
    isArchive: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

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
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<MediaModel>) => {
                this.mediaReleases = response.Records.
                    filter((a) => a.MediaReleaseStatus === 'SentForApproval');
                // console.log(this.mediaReleases);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    onMediaSuccess(mediaQuery: MediaModel): void {
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdateMediaRelease(mediaQueryModelUpdate: MediaModel): void {
        const mediaReleaseModelToSend = Object.assign({}, mediaQueryModelUpdate);
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.OnMediaReleaseApproverUpdate, mediaReleaseModelToSend);
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

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.MediaModelSentForApproval,
            (model: MediaModel) => this.onMediaSuccess(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.MediaModelApprovalUpdated,
            (model: MediaModel) => this.onMediaSuccess(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard,
            (model: KeyValue) => this.departmentChangeHandler(model));

        // Signalr Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveMediaMessageSendForApprovalResponse.Key, (model: MediaModel) =>
                this.getMediaReleases(model.ApproverDepartmentId, model.IncidentId));

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveMediaMessagePublishedResponse.Key, (model: MediaModel) =>
                this.getMediaReleases(model.ApproverDepartmentId, model.IncidentId));

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveMediaMessageUpdateResponse.Key, (model: MediaModel) =>
                this.getMediaReleases(model.ApproverDepartmentId, model.IncidentId));
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.MediaModelSaved);
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.MediaModelUpdated);
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.MediaModelSentForApproval);

        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
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