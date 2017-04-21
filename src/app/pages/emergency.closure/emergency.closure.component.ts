import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';


import { DepartmentClosureService } from '../department.closure/components/department.closure.service';
import { DepartmentClosureModel } from '../department.closure';
import { IncidentService } from '../incident/components/incident.service';
import { IncidentModel } from '../incident/components/incident.model';
import { DepartmentService } from '../masterdata/department/components/department.service';
import { DepartmentModel } from '../masterdata/department';
import { EmergencyTypeDepartmentService } from '../masterdata/emergency.department/components/emergency.department.service';
import { EmergencyDepartmentModel } from '../masterdata/emergency.department';
import { UtilityService, ResponseModel } from '../../shared';

@Component({
    selector: 'emergency-closure',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/emergency.closure.view.html'

})
export class EmergencyClosureComponent implements OnInit {
    currentIncident: number;
    currentDepartmentId: number;
    incident: IncidentModel = null;


    constructor(private departmentClosureService: DepartmentClosureService, private incidentService: IncidentService,
    private departmentService : DepartmentService, private emergencyTypeDepartmentService : EmergencyTypeDepartmentService) {

    }

    ngOnInit(): any {

        this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");

    }

    ngOnDestroy(): void {

    }

    GetIncident(incidentId: number): void {
        this.incidentService.GetIncidentById(incidentId)
            .subscribe((response: IncidentModel) => {
                this.incident = response;
                this.getAllDepartmentsToNotify();
            });

        

    }


    getAllDepartmentsToNotify() : void {
        let allActiveDepartments: Observable<ResponseModel<DepartmentModel>>
            = this.departmentService.GetDepartmentIds();
        let emergencyDepartments: Observable<ResponseModel<EmergencyDepartmentModel>>
            = this.emergencyTypeDepartmentService.GetFilterByEmergencyTypeDepartmentId(this.incident.EmergencyTypeId);
        // let notifyDeptUsers: Observable<ResponseModel<EmergencyDepartmentModel>>
        //     = this.emergencyTypeService.GetAll();

        // Observable.merge(allChecklists, activeDepartments, activeEmergencyTypes)
        //     .subscribe(
        //     (response: ResponseModel<BaseModel>) => {
        //         if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'CheckListId')) {
        //             this.activeCheckLists = <ChecklistModel[]>response.Records;
        //             this.checkListModel.ParentCheckListId = this.activeCheckLists[0].CheckListId;
        //         } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'DepartmentId')) {
        //             this.activeDepartments = <DepartmentModel[]>response.Records;
        //             this.checkListModel.DepartmentId = this.activeDepartments[0].DepartmentId;
        //         } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'EmergencyTypeId')) {
        //             this.activeEmergencyTypes = <EmergencyTypeModel[]>response.Records;
        //             this.checkListModel.EmergencyTypeId = this.activeEmergencyTypes[0].EmergencyTypeId;
        //         }
        //     },
        //     (error) => { console.log(error); },
        //     () => {
               // this.form = this.resetCheckListForm();
               // this.initiateCheckListModel();
               // this.dataExchange.Subscribe("checklistModelEdited", model => this.onCheckListEditSuccess(model));
          //  }
    }
}