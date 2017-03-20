import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DemandService } from './demand.service';
import { DemandTypeService, DemandTypeModel } from '../../../masterdata/demandtype';
import { DemandModel } from './demand.model';
import { AffectedObjectsService, AffectedObjectsToView } from '../../affected.objects';
import { AffectedPeopleService, AffectedPeopleToView } from '../../affected.people';
import { InvolvePartyModel } from '../../involveparties';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { CommunicationLogModel } from '../../communicationlogs';
import { PageService , PageModel } from '../../../masterdata/department.functionality';
import { ResponseModel, DataExchangeService, GlobalConstants, KeyValue, AutocompleteComponent, UtilityService } from '../../../../shared';

@Component({
    selector: 'demand-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/demand.entry.view.html'
})
export class DemandEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    demandModel: DemandModel = new DemandModel();
    demandTypes: DemandTypeModel[];
    date: Date = new Date();
    Action: string;
    priorities: any[] = GlobalConstants.Priority;
    requesterTypes: any[] = GlobalConstants.RequesterType;
    departments: DepartmentModel[] =[];
    affectedPeople: AffectedPeopleToView[];
    affectedObjects: AffectedObjectsToView[];
    pdas: Array<KeyValue> = [];
    awbs: Array<KeyValue> = [];
    currentIncident: number = 88;
    currentDeptId: number = 2;
    parentDeptId: number = null;
    currentDepartmentName: string = "Command Centre";
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    showAdd: Boolean = true;
    buttonValue: String = "";
    // @Output() demandTypeSaveEvent: EventEmitter<DemandTypeModel> = new EventEmitter(true);

    constructor(private demandService: DemandService, private demandTypeService: DemandTypeService,
     private departmentService: DepartmentService, private pageService : PageService,
        private affectedObjectsService: AffectedObjectsService, private affectedPeopleService: AffectedPeopleService,
        private dataExchange: DataExchangeService<number>) {
        this.showAdd = false;
        this.buttonValue = "Create Demand";
    }

    getDemandType() {
        this.demandTypeService.GetAll()
            .subscribe((response: ResponseModel<DemandTypeModel>) => {
                this.demandTypes = response.Records;
                this.demandModel.DemandTypeId = (this.demandModel.DemandTypeId == 0)
                    ? this.demandTypes[0].DemandTypeId
                    : this.demandModel.DemandTypeId;
            });

    };

    getAllDepartments(): void {
        this.pageService.GetDepartmentsByPageCode("ViewDepartmentSpecificDemands")
            .subscribe((response: ResponseModel<PageModel>) => {
                let pagePermissions =UtilityService.pluck(response.Records[0], ['PagePermissions'])[0]; 
                pagePermissions.forEach(x=>{
                     this.departments.push(UtilityService.pluck(x, ['Department'])[0]);
                    });    
                console.log(this.departments);
                this.demandModel.TargetDepartmentId = (this.demandModel.TargetDepartmentId == 0)
                    ? this.departments[0].DepartmentId
                    : this.demandModel.TargetDepartmentId;
            });
    };

    getPassengersCrews(currentIncident) {
        this.affectedPeopleService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                // this.affectedPeople.forEach(x => {
                //     this.pdas.push(new KeyValue((x.PassengerName || x.CrewName), x.AffectedPersonId));
                // });
                console.log(this.pdas);
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };

    getCargo(currentIncident) {
        this.affectedObjectsService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
                // this.affectedObjects.forEach(x => {
                //     this.awbs.push(new KeyValue(x.AWB, x.AffectedObjectId));
                // });
                console.log(this.pdas);
            }, (error: any) => {
                console.log("error:  " + error);
            });

    };

    ChangeAffectedPeople() {

        if (this.demandModel.AffectedPersonId != 0) {
            this.form.controls["AffectedObjectId"].reset({ value: 0, disabled: true });
            this.demandModel.PDATicketNumber = this.affectedPeople.find(x => x.AffectedPersonId == this.demandModel.AffectedPersonId).TicketNumber;
            this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
        }
        else {
            this.form.controls["AffectedObjectId"].reset({ value: 0, disabled: false });
            this.form.controls["PDATicketNumber"].reset({ value: "", disabled: true });
        }



        console.log(this.demandModel.PDATicketNumber);
    };

    ChangeAffectedObjects() {
        //  this.demandModel.AffectedObjectId = message.Value;

        if (this.demandModel.AffectedObjectId != 0) {
            this.form.controls["AffectedPersonId"].reset({ value: 0, disabled: true });
            this.demandModel.PDATicketNumber = this.affectedObjects.find(x => x.AffectedObjectId == this.demandModel.AffectedObjectId).TicketNumber;
            this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });

        }
        else {
            this.form.controls["AffectedPersonId"].reset({ value: 0, disabled: false });
            this.form.controls["PDATicketNumber"].reset({ value: "", disabled: true });
        }
    };

    showAddRegion(ShowAdd: Boolean): void {
        if (ShowAdd) {
            this.showAdd = false;
            this.buttonValue = "Create Demand";
        }
        else {
            this.showAdd = true;
            this.buttonValue = "Cancel";
            // this.form = this.resetCheckListForm();
        }
    };

    setModelFormGroup(model: DemandModel, ...params: ((entity: DemandModel) => any)[]): void {
        let paramNames: string[] = [];
        if (params.length > 0) {
            params.forEach((x: Function) => {
                paramNames.push(UtilityService.getReturnType(x)[0]);
            });

            if (paramNames.length > 0) {
                paramNames.forEach((x: string) => {
                    this.form.controls[x].reset({ value: model[x], disabled: false });
                })
            }
        }
    };

    setModelForUpdate(id) {
        console.log("event demand update");
        this.demandService.Get(id).subscribe((response: DemandModel) => {
            this.demandModel = response;
            this.setModelFormGroup(response, x => x.DemandId, x => x.DemandTypeId, x => x.Priority, x => x.DemandDesc
                , x => x.RequestedBy, x => x.RequesterType, x => x.PDATicketNumber, x => x.TargetDepartmentId, x => x.ContactNumber
                , x => x.ScheduleTime, x => x.RequiredLocation);
            this.showAdd = true;
            this.buttonValue = "Cancel";
            this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
            this.form.controls["AffectedPersonId"].reset({ value: this.demandModel.AffectedPersonId, disabled: true });
            this.form.controls["AffectedObjectId"].reset({ value: this.demandModel.AffectedObjectId, disabled: true });
             this.form.controls["DemandTypeId"].reset({ value: this.demandModel.DemandTypeId, disabled: true });

        }, (error: any) => {
            console.log("error:  " + error);
        });

    };

    ngOnInit(): any {
        this.getDemandType();
        this.getAllDepartments();
        this.getPassengersCrews(this.currentIncident);
        this.getCargo(this.currentIncident);

        this.initializeForm();

        this.demandModel.DemandId = 0;
        this.demandModel.IncidentId = this.currentIncident;
        this.demandModel.RequesterDepartmentId = this.currentDeptId;
        this.demandModel.RequesterParentDepartmentId = this.parentDeptId;
        this.demandModel.AffectedObjectId = 0;
        this.demandModel.AffectedPersonId = 0;
        this.demandModel.DemandTypeId =0;
        this.demandModel.Priority ="0";
        this.demandModel.RequesterType ="0";
        this.demandModel.TargetDepartmentId = 0;

        this.Action = "Save";
        this.dataExchange.Subscribe("OnDemandUpdate", model => this.setModelForUpdate(model));
    };

    SetCommunicationLog(demand: DemandModel): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = demand.DemandStatusDescription + ", "
            + this.demandTypes.find(x => x.DemandTypeId == demand.DemandTypeId).DemandTypeName + " request for " +
            this.departments.find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName
            + ". Request Details : " + demand.DemandDesc + ". " + "created with status " + demand.ActiveFlag + ".";
        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = this.departments.find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName;
        this.communicationLog.RequesterType = "Request";
        this.communicationLog.DemandId = demand.DemandId;
        this.communicationLog.InteractionDetailsType = GlobalConstants.InteractionDetailsTypeDemand;
        if (demand.AffectedPersonId != null) {
            this.communicationLog.AffectedPersonId = demand.AffectedPersonId;
        }
        else {
            delete this.communicationLog.AffectedPersonId;
        }
        if (demand.AffectedObjectId != null) {
            this.communicationLog.AffectedObjectId = demand.AffectedObjectId;
        }
        else {
            delete this.communicationLog.AffectedObjectId;
        }
        this.communicationLogs.push(this.communicationLog);
        return this.communicationLogs;
    };

    initializeForm() {
        this.form = new FormGroup({
            DemandId: new FormControl(0),
            DemandTypeId: new FormControl(0),
            Priority: new FormControl(0),
            DemandDesc: new FormControl(),
            RequestedBy: new FormControl(),
            RequesterType: new FormControl(0),
            PDATicketNumber: new FormControl({ value: '', disabled: true }),
            TargetDepartmentId: new FormControl(0),
            ContactNumber: new FormControl(),
            ScheduleTime: new FormControl(),
            RequiredLocation: new FormControl(),
            AffectedPersonId: new FormControl(0),
            AffectedObjectId: new FormControl(0)
        });

    };

    onSubmit() {
        if (this.demandModel.DemandId == 0) {
            UtilityService.setModelFromFormGroup<DemandModel>(this.demandModel, this.form, x => x.DemandId, x => x.DemandTypeId, x => x.Priority,
                x => x.DemandDesc, x => x.RequestedBy, x => x.RequesterType, x => x.PDATicketNumber, x => x.TargetDepartmentId,
                x => x.ContactNumber, x => x.RequiredLocation, x => x.ScheduleTime, x => x.ContactNumber);
            if (this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId).IsAutoApproved) {
                this.demandModel.IsApproved = true;
                this.demandModel.ApproverDepartmentId = null;

            }
            else {
                this.demandModel.IsApproved = true;
                this.demandModel.ApproverDepartmentId = this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId).DepartmentId;
            }
            this.demandModel.DemandStatusDescription = 'New Request by ' + this.currentDepartmentName;
            this.demandModel.DemandCode = "DEM-" + UtilityService.UUID();
            if (this.demandModel.AffectedObjectId == 0) {
                delete this.demandModel.AffectedObjectId;
            }
            if (this.demandModel.AffectedPersonId == 0) {
                delete this.demandModel.AffectedPersonId;
            }
            this.demandModel.CommunicationLogs = this.SetCommunicationLog(this.demandModel);

            this.demandService.Create(this.demandModel)
                .subscribe((response: DemandModel) => {
                    alert("Demand successfully created");
                    this.initializeForm();
                    this.demandModel = new DemandModel();
                    this.showAdd = false;
                    this.buttonValue = "Create Demand";
                }, (error: any) => {
                    console.log(error);
                });

        }
        else {

            this.demandModel = new DemandModel();
            UtilityService.setModelFromFormGroup<DemandModel>(this.demandModel, this.form, x => x.DemandId, x => x.Priority,
                x => x.DemandDesc, x => x.RequestedBy, x => x.RequesterType, x => x.TargetDepartmentId,
                x => x.ContactNumber, x => x.RequiredLocation, x => x.ScheduleTime);

            this.demandService.Update(this.demandModel)
                .subscribe((response: DemandModel) => {
                    alert("Demand successfully updated");
                    this.initializeForm();
                    this.demandModel = new DemandModel();
                    this.showAdd = false;
                    this.buttonValue = "Create Demand";
                }, (error: any) => {
                    console.log(error);
                });




        }


    };

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnDemandUpdate");
    };
}