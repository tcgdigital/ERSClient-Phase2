import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UserPermissionModel } from "../../masterdata/userpermission/components/userpermission.model";
import { NotifyPeopleModel, UserDepartmentNotificationMapper } from "./notifypeople.model";
import { INotifyPeopleService } from './INotifyPeopleService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';
import { UserPermissionService } from '../../masterdata/userpermission/components/userpermission.service';
import { DepartmentModel } from '../../masterdata/department';

@Injectable()
export class NotifyPeopleService extends ServiceBase<UserDepartmentNotificationMapper> implements INotifyPeopleService {
    public allDepartmentUserPermission: NotifyPeopleModel[] = [];
    private _bulkDataService: DataService<NotifyPeopleModel>;
    constructor(private dataServiceFactory: DataServiceFactory,
        private userPermissionService: UserPermissionService) {
        super(dataServiceFactory, 'NotifyDepartmentUsers');
    }

    public GetDepartmentSubDepartmentUser(departmentId: number): NotifyPeopleModel[] {
        let count: number = 1;
        let arrayDepartmentIds: number[] = [];
        arrayDepartmentIds.push(departmentId);
        this.medthod(arrayDepartmentIds, count);
        return this.allDepartmentUserPermission;
    }


    public GetAllByIncident(incidentId: number): Observable<ResponseModel<UserDepartmentNotificationMapper>> {
        return this._dataService.Query()
            .Select('Department, UserDepartmentNotificationMapperId')
            .Expand('Department($select=DepartmentId, DepartmentName)')
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }

    public CreateNotifyUserMatrix(departmentId: number, departmentName: string, count: number): number {
        this.userPermissionService.GetAllDepartmentUsers(departmentId)
            .subscribe((userPermissions: ResponseModel<UserPermissionModel>) => {
                let notifyModel: NotifyPeopleModel = new NotifyPeopleModel();
                notifyModel.id = count;
                notifyModel.text = departmentName;
                notifyModel.population = '';
                notifyModel.checked = false;
                userPermissions.Records.forEach((item: UserPermissionModel, index: number) => {
                    let notifyModelInner: NotifyPeopleModel = new NotifyPeopleModel();
                    count = count + 1;
                    notifyModelInner.id = count;
                    notifyModelInner.text = item.User.Email;
                    notifyModelInner.population = '';
                    notifyModelInner.checked = false;
                    notifyModel.children = [];
                    notifyModel.children.push(notifyModelInner);
                });
                this.allDepartmentUserPermission.push(notifyModel);

            });
        return count;
    }

    public medthod(deptIds: number[], count: number): void {
        let localCount = count;
        if (deptIds.length > 0) {
            deptIds.forEach((item: number) => {
                ///// User Permission Service
                this.userPermissionService.GetAllSubDepartments(item)
                    .subscribe((departments: ResponseModel<DepartmentModel>) => {
                        if (departments.Count > 0) {
                            let arrayDepartmentIds: number[] = [];
                            departments.Records.forEach((dept: DepartmentModel) => {
                                arrayDepartmentIds.push(dept.DepartmentId);
                                localCount = this.CreateNotifyUserMatrix(dept.DepartmentId, dept.DepartmentName, localCount)
                                localCount++;
                            })
                            this.medthod(arrayDepartmentIds, localCount);
                        }

                    })
            });
        }

    }

}