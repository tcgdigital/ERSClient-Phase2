import { Component, ViewEncapsulation } from '@angular/core';
import { QuickLinkModel } from './components/quicklink.model';

@Component({
    
    selector: 'quick-link-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/quicklink.view.html',
    styleUrls:['./styles/quicklink.style.scss']
})
export class QuickLinkComponent {
    public quickLink: QuickLinkModel;
}