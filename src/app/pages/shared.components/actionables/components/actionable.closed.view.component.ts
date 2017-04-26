import {
    Component, ViewEncapsulation,
    Input, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { ActionableModel } from './actionable.model';
import { ActionableService } from './actionable.service';
import {
    ResponseModel, DataExchangeService, KeyValue,
    UtilityService, GlobalConstants, GlobalStateService
} from '../../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';



@Component({
    selector: 'actionable-close',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/actionable.close.html'
})
export class ActionableClosedComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;

    closeActionables: ActionableModel[] = [];
    public form: FormGroup;
    private currentDepartmentId: number = null;
    private currentIncident: number = null;
    actionableModelToUpdate: ActionableModel;

    constructor(formBuilder: FormBuilder, private actionableService: ActionableService,
        private dataExchange: DataExchangeService<boolean>, private globalState: GlobalStateService) {

    }

    ngOnInit(): any {
        this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");

        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
        this.form = this.resetActionableForm();
        this.actionableModelToUpdate = new ActionableModel();
        this.dataExchange.Subscribe("CloseActionablePageInitiate", model => this.onCloseActionablePageInitiate(model));

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }


    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncident = incident.Value;
        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
    }

    private resetActionableForm(actionable?: ActionableModel): FormGroup {
        return new FormGroup({
            Comments: new FormControl(''),
            URL: new FormControl('')
        });
    }

    onCloseActionablePageInitiate(isClosed: boolean): void {
        this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("CloseActionablePageInitiate");
    }

    IsReopen(event: any, editedActionable: ActionableModel): void {
        if (!event.checked) {
            editedActionable.Done = false;
        }
        else {
            editedActionable.Done = true;
        }
        let tempActionable = this.closeActionables
            .find((item: ActionableModel) => item.ActionId == editedActionable.ActionId);
        tempActionable[0].Reopen = editedActionable.Reopen;
    }

    getAllCloseActionable(incidentId: number, departmentId: number): void {
        this.actionableService.GetAllCloseByIncidentIdandDepartmentId(incidentId, departmentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.closeActionables = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    openActionableDetail(editedActionableModel: ActionableModel): void {
        this.form = new FormGroup({
            Comments: new FormControl(editedActionableModel.Comments),
            URL: new FormControl(editedActionableModel.URL)
        });
        this.actionableModelToUpdate = editedActionableModel;
        this.childModal.show();
    }

    closedActionableClick(closedActionablesUpdate: ActionableModel[]): void {
        let filterActionableUpdate = closedActionablesUpdate.filter((item: ActionableModel) => {
            return (item.Done == true);
        });
        this.batchUpdate(filterActionableUpdate.map(x => {
            return {
                ActionId: x.ActionId,
                ActualClose: new Date(),
                CompletionStatus: "Open",
                ReopenedBy: 1,
                ReopenedOn: new Date()
            };
        }));
    }

    batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe(x => {
                this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelUpdateCommentAndURL(): void {
        this.childModal.hide();
    }
}