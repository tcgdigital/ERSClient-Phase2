import {
    Component, ViewEncapsulation,
    Output, EventEmitter
} from '@angular/core';
import { GlobalStateService } from '../../services';

@Component({
    selector: '[brand-header]',
    templateUrl: './brand.header.view.html',
    styleUrls: ['./brand.header.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BrandHeaderComponent {
    @Output() hambargerClicked: EventEmitter<any> = new EventEmitter<any>();

    public logoImage: string = 'assets/images/logo.png';
    public logoUrl: string = '#';

    public onHambargerClicked($event): void {
        console.log('brand header click');
        this.hambargerClicked.emit($event);
    }


    // public isScrolled: boolean = false;
    // public isMenuCollapsed: boolean = false;

    // constructor(private globalState: GlobalStateService) {
    //     this.globalState.Subscribe('menu.isCollapsed', (isCollapsed) => {
    //         this.isMenuCollapsed = isCollapsed;
    //     });
    // }

    // public ToggleMenu() {
    //     this.isMenuCollapsed = !this.isMenuCollapsed;
    //     this.globalState.NotifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    //     return false;
    // }

    // public ScrolledChanged(isScrolled) {
    //     this.isScrolled = isScrolled;
    // }
}