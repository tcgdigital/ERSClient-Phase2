import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import {
    DataExchangeService, GlobalStateService,
    KeyValue, UtilityService, TextAccordionModel, GlobalConstants
} from '../../../shared';
import { MediaReleaseWidgetModel } from './mediaRelease.widget.model';
import { MediaModel } from '../../shared.components';
import { MediaReleaseWidgetService } from './mediaRelease.widget.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'mediaRelease-widget',
    templateUrl: './mediaRelease.widget.view.html',
    styleUrls: ['./mediaRelease.widget.style.scss']
})
export class MediaReleaseWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalMediaRelease') public childModal: ModalDirective;

    mediaReleases: Observable<TextAccordionModel[]>;
    AllMediaReleases: Observable<MediaReleaseWidgetModel[]>;
    currentDepartmentId: number;
    currentIncidentId: number;
    currentMediaRelaseModel: MediaReleaseWidgetModel = new MediaReleaseWidgetModel();
    downloadPath: string;
    public isShow: boolean = true;
    public isShowViewAll: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    public isShowDownload: boolean = true;
<<<<<<< HEAD
    public downloadMediaReleaseAccessCode: string = 'DownloadMediaRelease';
=======
>>>>>>> master

    /**
     * Creates an instance of MediaReleaseWidgetComponent.
     * @param {MediaReleaseWidgetService} mediaReleaseWidgetService
     * @param {DataExchangeService<MediaReleaseWidgetModel>} dataExchange
     *
     * @memberOf MediaReleaseWidgetComponent
     */
    constructor(private mediaReleaseWidgetService: MediaReleaseWidgetService,
        private dataExchange: DataExchangeService<MediaReleaseWidgetModel>, private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/Media/' + this.currentIncidentId + '/';

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MediaMessageViewAll')) {
            this.getAllMediaReleases();
        }
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MediaMessage')) {
            this.getLatestMediaReleases(this.currentIncidentId);
        }

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.MediaReleasePublished,
            (model: MediaModel) => this.onMediaReleasePublish(model));

        // Signalr Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveMediaMessageResponse.Key, (model: MediaReleaseWidgetModel) => {
                this.getLatestMediaReleases(this.currentIncidentId);
            });
    }

    public getLatestMediaReleases(incidentId): void {
        let data: MediaReleaseWidgetModel[] = [];

        this.mediaReleaseWidgetService.GetAllMediaReleaseByIncident(incidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .flatMap((x) => x)
            .take(3)
            .subscribe((x: MediaReleaseWidgetModel) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.mediaReleases = Observable.of(data
                    .map((x: MediaReleaseWidgetModel) => new TextAccordionModel(x.MediaReleaseType, x.PublishedOn,
                        this.downloadPath + x.MediaqueryId)));
            });
    }

    public getAllMediaReleases(callback?: Function): void {
        let data: MediaReleaseWidgetModel[] = [];

        this.mediaReleaseWidgetService.GetAllMediaReleaseByIncident(this.currentIncidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .flatMap((x) => x)
            .subscribe((x) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.AllMediaReleases = Observable.of(data);
                if (callback) {
                    callback();
                }
            });
    }

    public openMediaReleases(): void {
        this.getAllMediaReleases(() => {
            this.childModal.show();
        });
    }

    public hideMediaReleases(): void {
        this.childModal.hide();
    }

    ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.MediaReleasePublished);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/Media/' + this.currentIncidentId + '/';

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MediaMessageViewAll')) {
            this.getAllMediaReleases();
        }
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MediaMessage')) {
            this.getLatestMediaReleases(this.currentIncidentId);
        }
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MediaMessageViewAll')) {
            this.getAllMediaReleases();
        }
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MediaMessage')) {
            this.getLatestMediaReleases(this.currentIncidentId);
        }
    }

    private onMediaReleasePublish(mediaRelease: MediaModel): void {
        if (mediaRelease.IsPublished) {
            this.getLatestMediaReleases(this.currentIncidentId);
        }
    }
}
