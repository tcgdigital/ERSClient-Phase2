import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { BroadCastModel } from './broadcast.model';
import { BroadcastService } from './broadcast.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'broadcast-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.list.view.html'
})
export class BroadcastListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    broadcastMessages: BroadCastModel[] = [];
    publishedBroadcastsLatest: BroadCastModel[] = [];
    publishedBroadcastsAll: BroadCastModel[] = [];

    constructor(private broadCastService: BroadcastService,
        private dataExchange: DataExchangeService<BroadCastModel>) { }

    getBroadCasts(): void {
        this.broadCastService.Query(+this.initiatedDepartmentId, +this.currentIncidentId)
            .subscribe((response: ResponseModel<BroadCastModel>) => {
                this.broadcastMessages = response.Records;
            });
    }

    onBroadcastSuccess(broadcast: BroadCastModel): void {
        this.getBroadCasts();
    }

    UpdateBroadcast(broadcastModelUpdate: BroadCastModel): void {
        let broadcastModelToSend = Object.assign({}, broadcastModelUpdate)
        this.dataExchange.Publish("OnBroadcastUpdate", broadcastModelToSend);
    }

    // getLatestPublishedBroadcasts(): void {
    //     this.broadCastService.GetLatest(+this.initiatedDepartmentId, +this.currentIncidentId)
    //         .subscribe((response: ResponseModel<BroadCastModel>) => {
    //             this.publishedBroadcastsLatest = response.Records;
    //         });
    // }

    // getAllPublishedBroadcasts(): void {
    //     this.broadCastService.GetPublished(+this.currentIncidentId)
    //         .subscribe((response: ResponseModel<BroadCastModel>) => {
    //             this.publishedBroadcastsAll = response.Records;
    //             this.publishedBroadcastsAll.forEach(item => item.InitiateDepartmentName = "Command Center"); // This will be changed in future
    //         });
    // }

    ngOnInit(): void {
        this.getBroadCasts();
        // this.getLatestPublishedBroadcasts();
        // this.getAllPublishedBroadcasts();

        this.dataExchange.Subscribe("BroadcastModelUpdated", model => this.onBroadcastSuccess(model));
        this.dataExchange.Subscribe("BroadcastModelSaved", model => this.onBroadcastSuccess(model))
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("BroadcastModelSaved");
        this.dataExchange.Unsubscribe("BroadcastModelUpdated");
    }
}