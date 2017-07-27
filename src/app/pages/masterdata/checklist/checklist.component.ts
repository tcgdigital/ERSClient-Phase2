import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChecklistModel } from './components';
import {
    UtilityService,KeyValue,
    GlobalStateService
} from '../../../shared';

@Component({
    selector: 'check-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/checklist.view.html',
    styleUrls: ['./styles/checklist.style.scss']
})
export class ChecklistComponent implements OnInit {
    public isShowAddChecklist: boolean = true;
    public checkList: ChecklistModel;
    public currentDepartmentId: number;
    /**
     *
     */
    constructor(private globalState: GlobalStateService) {

    }
    ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }
}