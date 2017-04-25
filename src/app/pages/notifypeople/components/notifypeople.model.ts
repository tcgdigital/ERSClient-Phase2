import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';
import { UserProfileModel } from '../../masterdata/userprofile';
import { DepartmentModel } from '../../masterdata/department';
import { IncidentModel } from '../../incident';

export class NotifyPeopleModel extends BaseModel {
    public id: number;
    public text: string;
    public population: string;
    public checked: boolean;
    public children: NotifyPeopleModel[];

    constructor() {
        super();
        this.id = 0;
        this.text = '';
        this.population = '';
        this.checked = false;
        this.children = [];
    }
}


export class UserDepartmentNotificationMapper extends BaseModel {
    public UserDepartmentNotificationMapperId: number;
    public UserId: number;
    public DepartmentId: number;
    public NotificationId: number;
    public IncidentId: number;
    public SendOn: Date;

    public UserProfile?: UserProfileModel;
    public Department?: DepartmentModel;
    //   public  Notification Notification : ;
    public Incident?: IncidentModel;
}


export class NotificationContactsWithTemplateModel extends BaseModel {
    public UserId: number;
    public IsActive: boolean;
    public IncidentId: number;
    public DepartmentId: number;
    public CreatedBy: number;
    public UserName: string;
    public SituationId: string;
    public AttachmentSingle: string;
    public ContactNumber: string;
    public AlternetContactNumber: string;
    public EmailId: string;
}
