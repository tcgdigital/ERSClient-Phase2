import {
    Component, OnInit, Input, OnDestroy,
    ViewEncapsulation, ViewChild
} from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import {
    DataExchangeService,
    UtilityService, GlobalConstants,
    TextAccordionModel, GlobalStateService, KeyValue
} from '../../../shared';
import { BroadcastWidgetModel } from './broadcast.widget.model';
import { BroadCastModel } from '../../shared.components';
import { BroadcastWidgetService } from './broadcast.widget.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'broadcast-widget',
    templateUrl: './broadcast.widget.view.html',
    styleUrls: ['./broadcast.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BroadcastWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('childBroadcastByDept') public childBroadcastByDept: ModalDirective;

    LatestBroadcasts: Observable<TextAccordionModel[]>;
    AllPublishedBroadcasts: BroadcastWidgetModel[] = new Array<BroadcastWidgetModel>();
    LatestBroadcastModels: BroadcastWidgetModel[] = new Array<BroadcastWidgetModel>();
    AllBroadCastByIncidentAndDepartment: BroadcastWidgetModel[] = new Array<BroadcastWidgetModel>();

    isHidden: boolean = true;
    currentIncidentId: number;
    currentDepartmentId: number;
    public isShow: boolean = true;
    public isShowViewAll: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     * Creates an instance of BroadcastWidgetComponent.
     * @param {BroadcastWidgetService} broadcastWidgetService
     * @param {DataExchangeService<BroadcastWidgetModel>} dataExchange
     * @param {GlobalStateService} globalState
     *
     * @memberOf BroadcastWidgetComponent
     */
    constructor(private broadcastWidgetService: BroadcastWidgetService,
        private dataExchange: DataExchangeService<BroadcastWidgetModel>,
        private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;

        if (UtilityService.GetNecessaryPageLevelPermissionValidation
            (this.currentDepartmentId, 'BroadcastMessageWidgetViewAll')) {
            this.getAllPublishedBroadcasts();
        }

        if (UtilityService.GetNecessaryPageLevelPermissionValidation
            (this.currentDepartmentId, 'BroadcastMessageWidget')) {
            this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
            this.getAllBroadcastByIncidentAndDepartment();
        }

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.BroadcastPublished,
            (model) => this.onBroadcastPublish(model));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveBroadcastCreationResponse.Key, (model: BroadCastModel) => {
                this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
            });

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveBroadcastModificationResponse.Key, (model: BroadCastModel) => {
                this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
            });
    }

    public getLatestBroadcasts(departmentId, incidentId): void {
        this.LatestBroadcastModels = new Array<BroadcastWidgetModel>();

        this.broadcastWidgetService
            .GetLatestBroadcastsByIncidentAndDepartment(departmentId, incidentId)
            .takeUntil(this.ngUnsubscribe)
            .flatMap(x => x)
            .subscribe(a => {
                let existingIndex = this.LatestBroadcastModels.findIndex(b => b.BroadcastId == a.BroadcastId);
                if (existingIndex == -1)
                    this.LatestBroadcastModels.push(a);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.LatestBroadcasts = Observable.of(this.LatestBroadcastModels
                    .map((x: BroadcastWidgetModel) => new TextAccordionModel(x.Message, x.SubmittedOn, '')));
            });
    }

    public getAllPublishedBroadcasts(callback?: Function): void {
        const data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetAllPublishedBroadcastsByIncident(this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
            .flatMap((x) => x)
            .subscribe((x) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.AllPublishedBroadcasts = data;
                if (callback) {
                    callback();
                }
            });
    }

    getAllBroadcastByIncidentAndDepartment(callback?: Function): void {
        const data: BroadcastWidgetModel[] = [];

        this.broadcastWidgetService
            .GetAllBroadcastsByIncidentAndDepartment(this.currentDepartmentId, this.currentIncidentId)
            .takeUntil(this.ngUnsubscribe)
            .flatMap((x) => x)
            .subscribe((x) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.AllBroadCastByIncidentAndDepartment = data;
                console.log(this.AllBroadCastByIncidentAndDepartment);
                if (callback) {
                    callback();
                }
            });
    }

    public openBroadcastMessagesByDepartment(): void {
        // this.getAllPublishedBroadcasts(() => {
        //     this.childModal.show();
        // });

        this.getAllBroadcastByIncidentAndDepartment(() => {
            this.childBroadcastByDept.show();
        })
    }

    public openBroadcastMessages(): void {
        this.getAllPublishedBroadcasts(() => {
            this.childModal.show();
        });
    }

    public hideAllBroadcastMessages(): void {
        this.childModal.hide();
    }

    public hideAllBroadcastMessageByDept(): void {
        this.childBroadcastByDept.hide();
    }

    ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChange);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.BroadcastPublished);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;

        if (UtilityService.GetNecessaryPageLevelPermissionValidation
            (this.currentDepartmentId, 'BroadcastMessageWidgetViewAll')) {
            this.getAllPublishedBroadcasts();
        }

        if (UtilityService.GetNecessaryPageLevelPermissionValidation
            (this.currentDepartmentId, 'BroadcastMessageWidget')) {
            this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
            this.getAllBroadcastByIncidentAndDepartment();
        }
    }

    private onBroadcastPublish(broadcast: BroadCastModel): void {
        if (broadcast.IsSubmitted) {
            this.LatestBroadcastModels = [];
            this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
        }
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;

        if (UtilityService.GetNecessaryPageLevelPermissionValidation
            (this.currentDepartmentId, 'BroadcastMessageWidgetViewAll')) {
            this.getAllPublishedBroadcasts();
        }

        if (UtilityService.GetNecessaryPageLevelPermissionValidation
            (this.currentDepartmentId, 'BroadcastMessageWidget')) {
            this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
            this.getAllBroadcastByIncidentAndDepartment();
        }
    }
}
