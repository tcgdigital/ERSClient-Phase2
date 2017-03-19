import { Component, ViewEncapsulation } from '@angular/core';
import { Route} from '@angular/router';
import { AffectedPeopleListComponent, AffectedPeopleVerificationComponent } from './components';

@Component({
    selector: 'affectedpeople-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.people.view.html'
})

export class AffectedPeopleComponent {
}