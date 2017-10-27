import {
    Component, OnInit, Input, ViewChild,
    Output, EventEmitter, ViewEncapsulation,
    SimpleChange
} from '@angular/core';
import { KeyValue, ResponseModel } from '../../../shared/models';
import { GlobalConstants, GlobalStateService } from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { QuickLinkModel } from '../../masterdata/quicklink/components';
import { QuickLinkService } from '../../masterdata/quicklink/components';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'quick-link-widget',
    templateUrl: './quicklink.quickview.widget.view.html',
    styleUrls: ['./quicklink.quickview.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class QuickLinkQuickViewWidgetComponent implements OnInit {
    @Input('currentIncident') currentIncident: number;
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;

    public incidentId: number;
    quicklinks: QuickLinkModel[] = [];
    public isShowPage: boolean = true;
    public currentDepartmentId: number;
    public currentIncidentIdLocal: number;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;

    constructor(private quicklinkService: QuickLinkService, private globalState: GlobalStateService) { }

    ngOnInit() {
        this.incidentId = 0;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.currentIncidentIdLocal = this.currentIncident;
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
        this.getQuickLinks();
    }

    getQuickLinks(): void {
        this.quicklinkService.GetAll()
            .subscribe((response: ResponseModel<QuickLinkModel>) => {
                this.quicklinks = response.Records;
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