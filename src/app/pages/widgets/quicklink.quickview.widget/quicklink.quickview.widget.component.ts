import {
    Component, OnInit, Input, ViewChild,
    Output, EventEmitter, ViewEncapsulation,
    SimpleChange
} from '@angular/core';
import { KeyValue } from '../../../shared/models';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'quick-link-widget',
    templateUrl: './quicklink.quickview.widget.view.html',
    styleUrls: ['./quicklink.quickview.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class QuickLinkQuickViewWidgetComponent implements OnInit {
    @Input() currentIncident: number;
    @ViewChild('childModalViewQLink') public childModalViewQLink: ModalDirective;
    public incidentId:number;
    constructor() { }

    ngOnInit() {
        this.incidentId=0;
        this.onViewQLinkClick();

    }

    public onViewQLinkClick(): void {
        debugger;
        this.incidentId = this.currentIncident;
        this.childModalViewQLink.show();
        
    }

    


}