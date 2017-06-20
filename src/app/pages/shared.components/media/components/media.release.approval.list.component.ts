import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
import { MediaModel } from './media.model';
import { MediaService } from './media.service';
import {
    ResponseModel, DataExchangeService, GlobalConstants,
    GlobalStateService, KeyValue, UtilityService
} from '../../../../shared';

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
        private globalState: GlobalStateService) { }

    getMediaReleases(departmentId, incidentId): void {
        this.mediaService.Query(departmentId, incidentId)
            .subscribe((response: ResponseModel<MediaModel>) => {                
                this.mediaReleases = response.Records.
                filter(a=>a.MediaReleaseStatus === 'SentForApproval' || a.MediaReleaseStatus === 'Published');
                console.log(this.mediaReleases);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onMediaSuccess(mediaQuery: MediaModel): void {
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdateMediaRelease(mediaQueryModelUpdate: MediaModel): void {
        let mediaReleaseModelToSend = Object.assign({}, mediaQueryModelUpdate)
        this.dataExchange.Publish("OnMediaReleaseApproverUpdate", mediaReleaseModelToSend);
    }

    ngOnInit(): void {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
        this.downloadPath =  GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/' + this.currentIncidentId + '/';
        this.dataExchange.Subscribe("MediaModelSaved", model => this.onMediaSuccess(model));
        this.dataExchange.Subscribe("MediaModelSentForApproval", model => this.onMediaSuccess(model));
        this.dataExchange.Subscribe("MediaModelUpdated", model => this.onMediaSuccess(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
        this.downloadPath =  GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/' + this.currentIncidentId + '/';
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('MediaModelSaved');
        this.dataExchange.Unsubscribe('MediaModelUpdated');
        this.dataExchange.Unsubscribe('MediaModelSentForApproval');
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }
}