import { Component, ViewEncapsulation } from '@angular/core';
import { Route} from '@angular/router';
import { AffectedObjectsListComponent } from './components';

@Component({
    selector: 'affectedobject-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.objects.view.html',
    styleUrls:['./styles/affected.objects.style.scss']
})

export class AffectedObjectsComponent {
}