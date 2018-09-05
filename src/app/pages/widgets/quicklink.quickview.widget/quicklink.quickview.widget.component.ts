import {
    Component, OnInit, Input, ViewEncapsulation, OnDestroy
} from '@angular/core';
import { KeyValue, ResponseModel } from '../../../shared/models';
import { GlobalConstants, GlobalStateService } from '../../../shared';
import { QuickLinkModel } from '../../masterdata/quicklink/components';
import { QuickLinkService } from '../../masterdata/quicklink/components';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'quick-link-widget',
    templateUrl: './quicklink.quickview.widget.view.html',
    styleUrls: ['./quicklink.quickview.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class QuickLinkQuickViewWidgetComponent implements OnInit, OnDestroy {
    @Input('currentIncident') currentIncident: number;
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;

    public incidentId: number;
    quicklinks: QuickLinkModel[] = [];
    public isShowPage: boolean = true;
    public currentDepartmentId: number;
    public currentIncidentIdLocal: number;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private quicklinkService: QuickLinkService,
        private globalState: GlobalStateService) { }

    ngOnInit() {
        this.incidentId = 0;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.currentIncidentIdLocal = this.currentIncident;

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));
        this.getQuickLinks();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getQuickLinks(): void {
        this.quicklinkService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<QuickLinkModel>) => {
                this.quicklinks = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    delQuickLink(quickLinkId: number, quickLink: QuickLinkModel): void {
        this.quicklinkService.Delete(quickLinkId, quickLink)
            .subscribe((response: QuickLinkModel) => {
                this.getQuickLinks();
            });
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }
}