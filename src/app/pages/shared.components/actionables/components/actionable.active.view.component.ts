import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild, Injector
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';


import { ActionableModel } from './actionable.model';
import { ActionableService } from './actionable.service';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department/components';
import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants, KeyValue,
    FileUploadService, GlobalStateService, SharedModule, AuthModel
} from '../../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';



@Component({
    selector: 'actionable-active',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/actionable.active.html'
})
export class ActionableActiveComponent implements OnInit, OnDestroy, AfterContentInit {
    @ViewChild('myFileInput') myInputVariable: any;
    @ViewChild('childModal') public childModal: ModalDirective;

    editActionableModel: ActionableModel = null;
    tempActionable: ActionableModel = null;
    activeActionables: ActionableModel[] = [];
    filesToUpload: Array<File>;
    filepathWithLinks: string = null;
    fileName: string = null;
    actionableModelToUpdate: ActionableModel = null;
    actionableWithParents: ActionableModel[] = [];
    parentChecklistIds: number[] = [];
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    public globalStateProxyOpen: GlobalStateService;
    public form: FormGroup;

    private currentDepartmentId: number = null;
    private currentIncident: number = null;

    /**
     * Creates an instance of ActionableActiveComponent.
     * @param {FormBuilder} formBuilder 
     * @param {ActionableService} actionableService 
     * @param {DataExchangeService<boolean>} dataExchange 
     * 
     * @memberOf ActionableActiveComponent
     */
    constructor(formBuilder: FormBuilder, private actionableService: ActionableService,
        private fileUploadService: FileUploadService, private departmentService: DepartmentService,
        private dataExchange: DataExchangeService<boolean>, private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router,
        private injector: Injector) {
        this.filesToUpload = [];
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    public ngOnInit(): any {
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncident = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAllActiveActionable(this.currentIncident, this.currentDepartmentId);
                }
                else {
                    this.isArchive = false;
                    this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAllActiveActionable(this.currentIncident, this.currentDepartmentId);
                }
            }
        });
        this.credential = UtilityService.getCredentialDetails();
        this.form = this.resetActionableForm();
        this.actionableModelToUpdate = new ActionableModel();
        this.dataExchange.Subscribe("OpenActionablePageInitiate", model => this.onOpenActionablePageInitiate(model));

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    private hasChildChecklist(checkListId): boolean {
        if (this.parentChecklistIds.length != 0)
            return this.parentChecklistIds.some(x => x == checkListId);
        else
            return false;

    }

    openChildActionable(actionable: ActionableModel): void {
        actionable["expanded"] = !actionable["expanded"];
        this.actionableService.GetChildActionables(actionable.ChklistId, this.currentIncident)
            .subscribe((responseActionable: ResponseModel<ActionableModel>) => {
                this.departmentService.GetDepartmentNameIds()
                    .subscribe((response: ResponseModel<DepartmentModel>) => {
                        let childActionables: ActionableModel[] = [];
                        childActionables = responseActionable.Records;
                        childActionables.forEach(x => {
                            x["DepartmentName"] = response.Records.find(y => { return y.DepartmentId == x.DepartmentId; }).DepartmentName;
                        });
                        actionable["actionableChilds"] = childActionables;

                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncident = incident.Value;
        this.getAllActiveActionable(this.currentIncident, this.currentDepartmentId);
        this.form = this.resetActionableForm();
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getAllActiveActionable(this.currentIncident, this.currentDepartmentId);
        this.form = this.resetActionableForm();
    }

    /**
     * 
     * 
     * @private
     * @param {ActionableModel} [actionable] 
     * @returns {FormGroup} 
     * 
     * @memberOf ActionableActiveComponent
     */
    private resetActionableForm(actionable?: ActionableModel): FormGroup {
        return new FormGroup({
            Comments: new FormControl(''),
            URL: new FormControl('')
        });
    }

    /**
     * 
     * 
     * @param {boolean} isOpen 
     * 
     * @memberOf ActionableActiveComponent
     */
    onOpenActionablePageInitiate(isOpen: boolean): void {
        this.getAllActiveActionable(this.currentIncident, this.currentDepartmentId);

    };

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OpenActionablePageInitiate");
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    };

    ngAfterContentInit(): void {
        this.setRagIntervalHandler();
    };

    IsDone(event: any, editedActionable: ActionableModel): void {
        if (!event.checked) {
            editedActionable.Done = false;
        }
        else {
            editedActionable.Done = true;
        }
        let tempActionable = this.activeActionables.filter(function (item: ActionableModel) {
            return (item.ActionId == editedActionable.ActionId);
        });
        tempActionable[0].Done = editedActionable.Done;
    }

    upload(actionableClicked: ActionableModel) {
        if (this.filesToUpload.length > 0) {
            let baseUrl = GlobalConstants.EXTERNAL_URL;
            this.fileUploadService.uploadFiles<string>(baseUrl + "api/fileUpload/upload", this.filesToUpload)
                .subscribe((result: string) => {
                    this.filepathWithLinks = `${GlobalConstants.EXTERNAL_URL}UploadFiles/${result.replace(/^.*[\\\/]/, '')}`;
                    let extension = result.replace(/^.*[\\\/]/, '').split('.').pop();
                    this.fileName = `Checklist_${actionableClicked.CheckListCode}_${actionableClicked.IncidentId}.${extension}`;
                }, (error) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    clearFileUpload(event: any): void {
        this.myInputVariable.nativeElement.value = "";
        this.filepathWithLinks = null;
        this.fileName = null;
    }

    getAllActiveActionable(incidentId: number, departmentId: number): void {
        this.actionableService.GetAllOpenByIncidentIdandDepartmentId(incidentId, departmentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.activeActionables = response.Records;
                this.activeActionables.forEach(x => {
                    x["expanded"] = false;
                    x["actionableChilds"] = [];
                });
                this.getAllActiveActionableByIncident(this.currentIncident);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllActiveActionableByIncident(incidentId): void {
        this.actionableService.GetAllOpenByIncidentId(incidentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.actionableWithParents = response.Records;
                this.parentChecklistIds = this.actionableWithParents.map(function (actionable) {
                    let Id = actionable.ParentCheckListId;
                    return Id;
                })
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    private setRagIntervalHandler(): void {
        Observable.interval(10000).subscribe(_ => {
            this.activeActionables.forEach((item: ActionableModel) => {
                item.RagColor = this.actionableService.setRagColor(item.AssignedDt, item.ScheduleClose);
                console.log(`Schedule run RAG ststus: ${item.RagColor}`);
            });
        }, (error: any) => {
            console.log(`Error: ${error}`);
        });
    }

    openActionableDetail(editedActionableModel: ActionableModel): void {
        this.form = new FormGroup({
            Comments: new FormControl(editedActionableModel.Comments),
            URL: new FormControl(editedActionableModel.URL)
        });
        // editedActionableModel.show = true;
        this.actionableModelToUpdate = editedActionableModel;
        this.childModal.show();
    }

    cancelUpdateCommentAndURL(editedActionableModel: ActionableModel): void {
        this.myInputVariable.nativeElement.value = "";
        this.filepathWithLinks = null;
        this.fileName = null;
        this.childModal.hide();
    }

    updateCommentAndURL(values: Object, editedActionableModel: ActionableModel): void {
        this.editActionableModel = new ActionableModel();
        this.editActionableModel.ActionId = editedActionableModel.ActionId;
        this.editActionableModel.Comments = this.form.controls['Comments'].value;
        if (this.filepathWithLinks != "") {
            this.editActionableModel.UploadLinks = this.filepathWithLinks;
        }

        this.actionableService.Update(this.editActionableModel)
            .subscribe((response: ActionableModel) => {
                this.toastrService.success('Actionable comments updated successfully.', 'Success', this.toastrConfig);
                editedActionableModel.show = false;
                this.tempActionable = this.activeActionables
                    .find((item: ActionableModel) => item.ActionId == editedActionableModel.ActionId);
                this.tempActionable.Comments = this.editActionableModel.Comments;
                this.tempActionable.UploadLinks = this.filepathWithLinks;
                this.tempActionable.FileName = this.fileName;
                this.childModal.hide();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    activeActionableClick(activeActionablesUpdate: ActionableModel[]): void {

        let filterActionableUpdate = activeActionablesUpdate
            .filter((item: ActionableModel) => item.Done == true);
        if (filterActionableUpdate.length > 0) {
            filterActionableUpdate.forEach(x => {
                delete x["expanded"];
                delete x["actionableChilds"];

            });
            this.batchUpdate(filterActionableUpdate.map(x => {
                return {
                    ActionId: x.ActionId,
                    ActualClose: new Date(),
                    ClosedBy: this.credential.UserId,
                    CompletionStatus: "Close",
                    ClosedOn: new Date()
                };
            }));
        }
        else {
            this.toastrService.error("Please select at least one checklist", 'Error', this.toastrConfig);
        }
    }


    private batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe(x => {
                this.toastrService.success('Actionables updated successfully.', 'Success', this.toastrConfig);
                this.getAllActiveActionable(this.currentIncident, this.currentDepartmentId);
                this.globalStateProxyOpen.NotifyDataChanged('checkListStatusChange', null);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

}