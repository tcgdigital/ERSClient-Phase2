import { Component, ViewEncapsulation } from '@angular/core';
import { MediaModel } from './media.model';

@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.view.html'
})
export class MediaReleaseComponent {
    evtMediaRelease: MediaModel;

    getNotification(evt: MediaModel) {
        this.evtMediaRelease = evt;
    }
}