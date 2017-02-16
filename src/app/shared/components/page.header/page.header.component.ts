import { Component } from '@angular/core';
import { GlobalStateService } from '../../services';

import 'style-loader!./page.header.style.scss';

@Component({
    selector: 'page-header',
    templateUrl: './page.header.view.html'
})
export class PageHeaderComponent {
    public isScrolled: boolean = false;
    public isMenuCollapsed: boolean = false;

    constructor(private globalState: GlobalStateService) {
        this.globalState.Subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    public ToggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this.globalState.NotifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    public ScrolledChanged(isScrolled) {
        this.isScrolled = isScrolled;
    }
}