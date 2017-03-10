import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
import { MediaModel } from './media.model';
import { MediaService } from './media.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'mediaQuery-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.list.view.html'
})
export class MediaQueryListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    MediaQueries: MediaModel[] = [];

    constructor(private mediaQueryService: MediaService,
        private dataExchange: DataExchangeService<MediaModel>) { }

    getMediaQueries(): void {
        this.mediaQueryService.Query(+this.initiatedDepartmentId, +this.currentIncidentId)
            .subscribe((response: ResponseModel<MediaModel>) => {
                this.MediaQueries = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onMediaSuccess(mediaQuery: MediaModel): void {
        this.getMediaQueries();
    }

    ngOnInit(): void {
        this.getMediaQueries();
        this.dataExchange.Subscribe("MediaModelUpdated", model => this.onMediaSuccess(model));
        this.dataExchange.Subscribe("MediaModelSaved", model => this.onMediaSuccess(model))
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('MediaModelSaved');
        this.dataExchange.Unsubscribe('MediaModelUpdated');
    }
}