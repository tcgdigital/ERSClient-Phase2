import {
    Component, ViewEncapsulation,
    Input, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable,Subscription } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';

import { ActionableModel } from './actionable.model';
import { ActionableService } from './actionable.service';
import {
    ResponseModel, DataExchangeService, KeyValue,
    UtilityService, GlobalConstants, GlobalStateService, AuthModel
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
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive : boolean = false;

    constructor(formBuilder: FormBuilder, private actionableService: ActionableService,
        private dataExchange: DataExchangeService<boolean>, private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router) {

    }

    ngOnInit(): any {
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncident = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
                }
                else {
                    this.isArchive = false;
                    this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
                }
            }
        });
        this.credential = UtilityService.getCredentialDetails();


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
        if (filterActionableUpdate.length > 0) {
            this.batchUpdate(filterActionableUpdate.map(x => {
                return {
                    ActionId: x.ActionId,
                    ActualClose: new Date(),
                    CompletionStatus: "Open",
                    ReopenedBy: this.credential.UserId,
                    ReopenedOn: new Date()
                };
            }));
        }
        else {
            this.toastrService.error("Please select at least one checklist", 'Error', this.toastrConfig);
        }
    }

    batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe(x => {
                this.toastrService.success('Actionables updated successfully.', 'Success', this.toastrConfig);
                this.getAllCloseActionable(this.currentIncident, this.currentDepartmentId);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelUpdateCommentAndURL(): void {
        this.childModal.hide();
    }
}