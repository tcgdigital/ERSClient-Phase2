import { Component, ViewEncapsulation } from '@angular/core';
import { ChecklistModel } from './components';

@Component({
    selector: 'check-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/checklist.view.html',
    styleUrls: ['./styles/checklist.style.scss']
})
export class ChecklistComponent {
    checkList: ChecklistModel;
}