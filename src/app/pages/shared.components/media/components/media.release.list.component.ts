import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
import { MediaModel } from './media.model';
import { MediaService } from './media.service';
import { ResponseModel, DataExchangeService ,GlobalStateService} from '../../../../shared';

@Component({
    selector: 'mediaRelease-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.list.view.html'
})
export class MediaReleaseListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() incidentId: string;

    mediaReleases: MediaModel[] = [];
    currentIncidentId : number;
    currentDepartmentId : number;

    constructor(private mediaService: MediaService,
        private dataExchange: DataExchangeService<MediaModel>, private globalState: GlobalStateService) { }

    getMediaReleases(departmentId , incidentId): void {
        this.mediaService.Query(departmentId, incidentId)
            .subscribe((response: ResponseModel<MediaModel>) => {                
                this.mediaReleases = response.Records;               
            }, (error: any)=>{
                console.log(`Error: ${error}`);
            });       
    }

    onMediaSuccess(mediaQuery: MediaModel): void {
        this.getMediaReleases(this.currentDepartmentId ,this.currentIncidentId);
    }

    UpdateMediaRelease(mediaQueryModelUpdate: MediaModel): void {
        let mediaReleaseModelToSend = Object.assign({}, mediaQueryModelUpdate)
        this.dataExchange.Publish("OnMediaReleaseUpdate", mediaReleaseModelToSend);
    }

    ngOnInit(): void {
        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this.getMediaReleases(this.currentDepartmentId ,this.currentIncidentId);       
        this.dataExchange.Subscribe("MediaModelSaved", model => this.onMediaSuccess(model));
        this.dataExchange.Subscribe("MediaModelUpdated", model => this.onMediaSuccess(model));
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
    }

     private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
        this.getMediaReleases(this.currentDepartmentId ,this.currentIncidentId);
    }

    private departmentChangeHandler(departmentId): void {
        this.currentDepartmentId = departmentId;
        this.getMediaReleases(this.currentDepartmentId ,this.currentIncidentId);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('MediaModelSaved');
        this.dataExchange.Unsubscribe('MediaModelUpdated');
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}