import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {Subscription } from 'rxjs/Rx';
import { MediaModel } from './media.model';
import { MediaService } from './media.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue,UtilityService
} from '../../../../shared';

@Component({
    selector: 'mediaRelease-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.list.view.html'
})
export class MediaReleaseListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() incidentId: string;

    mediaReleases: MediaModel[] = [];
    currentIncidentId: number;
    currentDepartmentId: number;
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;

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

    getMediaReleases(departmentId, incidentId): void {
        this.mediaService.Query(departmentId, incidentId)
            .subscribe((response: ResponseModel<MediaModel>) => {
                this.mediaReleases = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onMediaSuccess(mediaQuery: MediaModel): void {
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdateMediaRelease(mediaQueryModelUpdate: MediaModel): void {
        let mediaReleaseModelToSend = Object.assign({}, mediaQueryModelUpdate)
        this.dataExchange.Publish("OnMediaReleaseUpdate", mediaReleaseModelToSend);
    }

    ngOnInit(): void {
        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
                }
                else {
                    this.isArchive = false;
                    this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
                   this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
                }
            }
        });
        

        this.dataExchange.Subscribe("MediaModelSaved", model => this.onMediaSuccess(model));
        this.dataExchange.Subscribe("MediaModelUpdated", model => this.onMediaSuccess(model));
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getMediaReleases(this.currentDepartmentId, this.currentIncidentId);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('MediaModelSaved');
        this.dataExchange.Unsubscribe('MediaModelUpdated');
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}