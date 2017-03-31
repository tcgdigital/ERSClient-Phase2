import {
    Component, ViewEncapsulation,
    Output, EventEmitter
} from '@angular/core';
import { GlobalStateService } from '../../services';

@Component({
    selector: '[page-header]',
    templateUrl: './page.header.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PageHeaderComponent {
    @Output() toggleSideMenu: EventEmitter<any> = new EventEmitter<any>();

    public onToggleSideMenu($event): void {
        console.log('page header click');
        this.toggleSideMenu.emit($event);
    }
}