import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataServiceFactory, DataExchangeService } from '../../../shared'
import { BroadcastWidgetModel } from './broadcast.widget.model'
import { BroadcastWidgetService } from './broadcast.widget.service'

@Component({
    selector: 'broadcast-widget',
    templateUrl: './broadcast.widget.view.html',
    styleUrls:['./broadcast.widget.style.scss']
})
export class BroadcastWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    LatestBroadcasts: Observable<BroadcastWidgetModel[]>;  
    AllPublishedBroadcasts: Observable<BroadcastWidgetModel[]>; 
    isHidden: boolean = true;

    constructor(private broadcastWidgetService: BroadcastWidgetService,
        private dataExchange: DataExchangeService<BroadcastWidgetModel>) { }

    ngOnInit() { 
        this.getLatestBroadcasts();
        this.getAllPublishedBroadcasts();
    }

    getLatestBroadcasts(): void {
        let data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetLatestBroadcastsByIncidentAndDepartment(this.departmentId,this.incidentId)
            .flatMap(x=>x).take(2)            
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{
                console.log(`Error: ${error}`);
            },
            ()=>this.LatestBroadcasts = Observable.of(data));
            //console.log(this.LatestBroadcasts);            
    } 

    getAllPublishedBroadcasts(): void {
        let data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetAllPublishedBroadcastsByIncident(this.incidentId)
            .flatMap(x=>x)            
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{
            console.log(`Error: ${error}`);
            },
            ()=>this.AllPublishedBroadcasts = Observable.of(data));
    } 

    openBroadcastMessages(isHide: boolean, event: Event){
         this.isHidden = isHide;
         event.preventDefault();
     }  
}
