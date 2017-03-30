import { Component, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../services';

// import 'style-loader!./content.header.style.scss';

@Component({
    selector: 'content-header',
    templateUrl: './content.header.view.html',
    styleUrls:['/content.header.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentHeaderComponent {
    public activePageTitle: string = '';

    constructor(private globalState: GlobalStateService) {
        this.globalState.Subscribe('menu.activeLink', (activeLink) => {
            if (activeLink) {
                this.activePageTitle = activeLink.title;
            }
        });
    }
}