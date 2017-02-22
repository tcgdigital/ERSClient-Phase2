import { Component, ViewEncapsulation } from '@angular/core';
import { ChecklistModel } from './components';

@Component({
    selector: 'check-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/checklist.view.html'
})
export class ChecklistComponent {
    checkList: ChecklistModel;
}