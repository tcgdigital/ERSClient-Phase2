import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
import { MediaModel } from './media.model';
import { MediaService } from './media.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'mediaRelease-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.list.view.html'
})
export class MediaReleaseListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    mediaReleases: MediaModel[] = [];

    constructor(private mediaService: MediaService,
        private dataExchange: DataExchangeService<MediaModel>) { }

    getMediaReleases(): void {
        this.mediaService.GetPublished(+this.currentIncidentId)
            .subscribe((response: ResponseModel<MediaModel>) => {                
                this.mediaReleases = response.Records;               
            }, (error: any)=>{
                console.log(`Error: ${error}`);
            });       
    }

    onMediaSuccess(mediaQuery: MediaModel): void {
        this.getMediaReleases();
    }

    UpdateMediaRelease(mediaQueryModelUpdate: MediaModel): void {
        let mediaReleaseModelToSend = Object.assign({}, mediaQueryModelUpdate)
        this.dataExchange.Publish("OnMediaReleaseUpdate", mediaReleaseModelToSend);
    }

    ngOnInit(): void {
        this.getMediaReleases();
        this.dataExchange.Subscribe("MediaModelUpdated", model => this.onMediaSuccess(model));
        this.dataExchange.Subscribe("MediaModelSaved", model => this.onMediaSuccess(model))
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('MediaModelSaved');
        this.dataExchange.Unsubscribe('MediaModelUpdated');
    }
}