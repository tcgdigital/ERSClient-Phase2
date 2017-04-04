import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { ActionableModel } from './actionable.model';
import { ActionableService } from './actionable.service';
import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants,
    FileUploadService, GlobalStateService
} from '../../../../shared';

@Component({
    selector: 'actionable-active',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/actionable.active.html',
    styleUrls: ['../styles/actionable.style.scss']
})
export class ActionableActiveComponent implements OnInit, OnDestroy, AfterContentInit {
    @ViewChild('myFileInput') myInputVariable: any;

    editActionableModel: ActionableModel = null;
    tempActionable: ActionableModel = null;
    activeActionables: ActionableModel[] = [];
    filesToUpload: Array<File>;
    filepathWithLinks: string = null;
    fileName: string = null;

    public form: FormGroup;

    private departmentId: number = null;
    private incidentId: number = null;

    /**
     * Creates an instance of ActionableActiveComponent.
     * @param {FormBuilder} formBuilder 
     * @param {ActionableService} actionableService 
     * @param {DataExchangeService<boolean>} dataExchange 
     * 
     * @memberOf ActionableActiveComponent
     */
    constructor(formBuilder: FormBuilder, private actionableService: ActionableService,
        private fileUploadService: FileUploadService,
        private dataExchange: DataExchangeService<boolean>, private globalState: GlobalStateService) {
        this.filesToUpload = [];
    }

    /**
     * 
     * 
     * @returns {*} 
     * 
     * @memberOf ActionableActiveComponent
     */
    ngOnInit(): any {

        this.departmentId = 1;
        this.incidentId = 96;
        this.getAllActiveActionable(this.incidentId, this.departmentId);
        this.form = this.resetActionableForm();
        this.dataExchange.Subscribe("OpenActionablePageInitiate", model => this.onOpenActionablePageInitiate(model));
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incidentId): void {
        this.incidentId = incidentId;
        this.getAllActiveActionable(this.incidentId, this.departmentId);
    }

    private departmentChangeHandler(departmentId): void {
        this.departmentId = departmentId;
        this.getAllActiveActionable(this.incidentId, this.departmentId);
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
        this.getAllActiveActionable(this.incidentId, this.departmentId);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OpenActionablePageInitiate");
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    onIncidentDepartmentChange():void{
        this.departmentId = 1;
        this.incidentId = 96;
        this.getAllActiveActionable(this.incidentId, this.departmentId);
        this.form = this.resetActionableForm();
    }

    ngAfterContentInit(): void {
        this.setRagIntervalHandler();
    }

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
        alert(incidentId +"  :  "+ departmentId);
        this.actionableService.GetAllOpenByIncidentIdandDepartmentId(incidentId, departmentId)
            .subscribe((response: ResponseModel<ActionableModel>) => {
                this.activeActionables = response.Records;
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

    actionableDetail(editedActionableModel: ActionableModel): void {
        this.form = new FormGroup({
            Comments: new FormControl(editedActionableModel.Comments),
            URL: new FormControl(editedActionableModel.URL)
        });
        editedActionableModel.show = true;
    }

    cancelUpdateCommentAndURL(editedActionableModel: ActionableModel): void {
        this.myInputVariable.nativeElement.value = "";
        this.filepathWithLinks = null;
        this.fileName = null;
        editedActionableModel.show = false;
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
                editedActionableModel.show = false;
                this.tempActionable = this.activeActionables
                    .find((item: ActionableModel) => item.ActionId == editedActionableModel.ActionId);
                this.tempActionable.Comments = this.editActionableModel.Comments;
                this.tempActionable.UploadLinks = this.filepathWithLinks;
                this.tempActionable.FileName = this.fileName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    activeActionableClick(activeActionablesUpdate: ActionableModel[]): void {
        let filterActionableUpdate = activeActionablesUpdate
            .filter((item: ActionableModel) => item.Done == true);

        this.batchUpdate(filterActionableUpdate.map(x => {
            return {
                ActionId: x.ActionId,
                ActualClose: new Date(),
                ClosedBy: 1,
                CompletionStatus: "Close",
                ClosedOn: new Date()
            };
        }));
    }

    private batchUpdate(data: any[]) {
        this.actionableService.BatchOperation(data)
            .subscribe(x => {
                this.getAllActiveActionable(this.incidentId, this.departmentId);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

}