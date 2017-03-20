import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataServiceFactory, DataExchangeService } from '../../../shared'
import { MediaReleaseWidgetModel } from './mediaRelease.widget.model'
import { MediaReleaseWidgetService } from './mediaRelease.widget.service'

@Component({
    selector: 'mediaRelease-widget',
    templateUrl: './mediaRelease.widget.view.html',
    styleUrls: ['./mediaRelease.widget.style.scss']
})
export class MediaReleaseWidgetComponent implements OnInit {
    
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    isHidden: boolean = true;

    mediaReleases: Observable<MediaReleaseWidgetModel[]>;
    AllMediaReleases: Observable<MediaReleaseWidgetModel[]>;

    constructor(private mediaReleaseWidgetService: MediaReleaseWidgetService,
        private dataExchange: DataExchangeService<MediaReleaseWidgetModel>) { }

    ngOnInit() { 
        this.getLatestMediaReleases();
        this.getAllMediaReleases();
    }

     getLatestMediaReleases(): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(this.incidentId)
            .flatMap(x=>x)
            .take(2)
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>this.mediaReleases = Observable.of(data));
    }

    getAllMediaReleases(): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(this.incidentId)
            .flatMap(x=>x)            
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>this.AllMediaReleases = Observable.of(data));
    }

    openMediaReleases(isHide: boolean, event: Event){
         this.isHidden = isHide;
         event.preventDefault();
     }
}