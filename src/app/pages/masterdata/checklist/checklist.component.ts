import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChecklistModel } from './components';
import {
    UtilityService,KeyValue,
    GlobalStateService,
    GlobalConstants
} from '../../../shared';

@Component({
    selector: 'check-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/checklist.view.html',
    styleUrls: ['./styles/checklist.style.scss']
})
export class ChecklistComponent implements OnInit {
    public isShowAddEditChecklist: boolean = true;
    public checkList: ChecklistModel;
    public currentDepartmentId: number;

    /**
     *Creates an instance of ChecklistComponent.
     * @param {GlobalStateService} globalState
     * @memberof ChecklistComponent
     */
    constructor(private globalState: GlobalStateService) {
    }

    ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, 
            (model) => this.departmentChangeHandler(model));
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }
}