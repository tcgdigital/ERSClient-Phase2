import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { ChecklistModel } from './checklist.model';
import { ChecklistService } from './checklist.service';
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataExchangeService, UtilityService, GlobalStateService
    , SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue, KeyValue
} from '../../../../shared';
import { DepartmentModel, DepartmentService } from '../../department';
import { EmergencyTypeModel, EmergencyTypeService } from '../../emergencytype';

@Component({
    selector: 'checklist-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/checklist.list.view.html',
    styleUrls: ['../styles/checklist.style.scss']
})
export class ChecklistListComponent implements OnInit {
    checkLists: ChecklistModel[] = [];
    activeCheckLists: ChecklistModel[] = [];
    activeDepartments: DepartmentModel[] = [];
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    checkListModelPatch: ChecklistModel = null;
    date: Date = new Date();
    currentDepartmentId: number;
    searchConfigs: SearchConfigModel<any>[] = [];
    parentChecklistListForSearch: NameValue<number>[] = [];
    emergencyTypesForSearch: NameValue<number>[] = [];

    constructor(private checkListService: ChecklistService, private emergencytypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<ChecklistModel>, private globalState: GlobalStateService) { }

    findIfParent(item: ChecklistModel): any {
        return item.ParentCheckListId != null;
    };


    getCheckLists(departmentId): void {
        this.checkListService.GetAllByDepartment(departmentId)
            .subscribe((response: ResponseModel<ChecklistModel>) => {
                response.Records.forEach(x => {
                    x.Active = (x.ActiveFlag == 'Active');
                });
                this.checkLists = response.Records;
                this.parentChecklistListForSearch = this.checkLists.filter(this.findIfParent)
                    .map(x => new NameValue<number>(x.ParentCheckList.CheckListCode, x.ParentCheckListId));
                 this.initiateSearchConfigurations();

            });
    }

    getEmergencyTypes(): void {
        this.emergencytypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.emergencyTypesForSearch = response.Records.map(x => new NameValue<number>(x.EmergencyTypeName, x.EmergencyTypeId));
            });
             this.initiateSearchConfigurations();
    }

    getAllActiveCheckLists(): void {
        this.checkListService.GetAllActiveCheckLists()
            .subscribe((response: ResponseModel<ChecklistModel>) => {
                this.activeCheckLists = response.Records;
            });
    }

    onCheckListModelSavedSuccess(data: ChecklistModel): void {
        this.checkLists.unshift(data);
    }

    ngOnInit(): void {
        //this.getAllActiveCheckLists();
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.getCheckLists(this.currentDepartmentId);
        this.dataExchange.Subscribe("checkListModelSaved",
            model => this.onCheckListModelSavedSuccess(model));
        this.dataExchange.Subscribe("checkListListReload",
            model => this.onCheckListModelReloadSuccess(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
        this.initiateSearchConfigurations();
    }

    private departmentChangeHandler(department : KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getCheckLists(this.currentDepartmentId);
    }


    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("checkListModelSaved");
        this.dataExchange.Unsubscribe("checkListListReload");
    }

    editChecklist(editedChecklistModel: ChecklistModel): void {
        this.dataExchange.Publish("checklistModelEdited", editedChecklistModel);
    }

    onCheckListModelReloadSuccess(editedChecklistModel: ChecklistModel): void {
        this.getCheckLists(this.currentDepartmentId);
    }

    IsActive(event: any, editedCheckList: ChecklistModel): void {
        this.checkListModelPatch = new ChecklistModel(false);
        this.checkListModelPatch.CheckListId = editedCheckList.CheckListId;
        this.checkListModelPatch.deleteAttributes();
        this.checkListModelPatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.checkListModelPatch.ActiveFlag = 'InActive';
        }
        this.checkListService.Update(this.checkListModelPatch)
            .subscribe((response: ChecklistModel) => {
                this.getCheckLists(this.currentDepartmentId);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }


    private initiateSearchConfigurations(): void {
        let status: NameValue<string>[] = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('InActive', 'InActive'),
        ]
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'CheckListCode',
                Description: 'Checklist Code',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'CheckListDetails',
                Description: 'Checklist Details',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'ParentCheckListId',
                Description: 'Parent Checklist',
                PlaceHolder: 'Select Parent Checklist',
                Value: '',
                ListData: this.checkListService.GetAllParents(this.currentDepartmentId)
                    .map(x => x.Records)
                    .map(x => x.map(y => new NameValue<number>(y.ParentCheckList.CheckListCode, y.ParentCheckListId)))
            }),
            new SearchDropdown({
                Name: 'EmergencyTypeId',
                Description: 'Emergency Type',
                PlaceHolder: 'Select Emergency Type',
                Value: '',
                ListData: this.emergencytypeService.GetAll()
                    .map(x => x.Records)
                    .map(x => x.map(y => new NameValue<number>(y.EmergencyTypeName, y.EmergencyTypeId)))
            }),
            new SearchTextBox({
                Name: 'URL',
                Description: 'URL',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Duration',
                Description: 'Duration',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'ActiveFlag',
                Description: 'Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            })
        ];        
    }
      invokeSearch(query: string): void {
        if (query !== '') {
            query = `${query} and DepartmentId eq ${this.currentDepartmentId}`;
            this.checkListService.GetQuery(query)
                .subscribe((response: ResponseModel<ChecklistModel>) => {
                   response.Records.forEach(x => {
                    x.Active = (x.ActiveFlag == 'Active');
                });
                this.checkLists = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
    }

    invokeReset(): void {
        this.getCheckLists(this.currentDepartmentId);
    }
}