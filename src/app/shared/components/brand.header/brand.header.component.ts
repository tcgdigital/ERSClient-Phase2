import {
    Component, ViewEncapsulation,
    Output, EventEmitter, Input
} from '@angular/core';
import { GlobalStateService } from '../../services';

@Component({
    selector: '[brand-header]',
    templateUrl: './brand.header.view.html',
    styleUrls: ['./brand.header.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BrandHeaderComponent {
    @Input() userName: string;
    @Input() lastLogin: Date;

    @Output() hambargerClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() contactClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() helpClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() logoutClicked: EventEmitter<any> = new EventEmitter<any>();

    public logoImage: string = 'assets/images/logo.png';
    public logoUrl: string = '#';

    public onHambargerClicked($event): void {
        console.log('brand header click');
        this.hambargerClicked.emit($event);
    }

    public onContactClicked($event): void {
        this.contactClicked.emit($event);
    }

    public onHelpClicked($event): void {
        this.helpClicked.emit($event);
    }

    public onLogoutClicked($event): void{
        this.logoutClicked.emit($event);
    }
}