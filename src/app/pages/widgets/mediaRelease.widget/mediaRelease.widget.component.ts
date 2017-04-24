import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataServiceFactory, DataExchangeService, GlobalStateService, KeyValue } from '../../../shared'
import { MediaReleaseWidgetModel } from './mediaRelease.widget.model'
import { MediaReleaseWidgetService } from './mediaRelease.widget.service'
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'mediaRelease-widget',
    templateUrl: './mediaRelease.widget.view.html',
    styleUrls: ['./mediaRelease.widget.style.scss']
})
export class MediaReleaseWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    isHidden: boolean = true;
    @ViewChild('childModalMediaRelease') public childModal: ModalDirective;

    mediaReleases: Observable<MediaReleaseWidgetModel[]>;
    AllMediaReleases: Observable<MediaReleaseWidgetModel[]>;
    currentDepartmentId: number;
    currentIncidentId: number;

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
        this.currentDepartmentId = this.departmentId;
        this.getLatestMediaReleases(this.currentIncidentId);
        this.getAllMediaReleases();
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
    };

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getLatestMediaReleases(this.currentIncidentId);
        this.getAllMediaReleases();
    };
  
    public getLatestMediaReleases(incidentId): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(incidentId)
            .flatMap(x => x)
            .take(2)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            },
            () => this.mediaReleases = Observable.of(data));
    }

    public getAllMediaReleases(callback?: Function): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(this.currentIncidentId)
            .flatMap(x => x)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            },
            () => {
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
        this.globalState.Unsubscribe('incidentChange');
    }
}
