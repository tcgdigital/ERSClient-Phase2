import { BaseModel } from '../../../shared';
import { UserProfileModel } from '../../masterdata/userprofile';
import { DepartmentModel } from '../../masterdata/department';
import { IncidentModel } from '../../incident';

export class NotifyPeopleModel extends BaseModel {
    public id: number;
    public text: string;
    public population: string;
    public checked: boolean;
    public children: NotifyPeopleModel[];
    public User: UserProfileModel;
    public DepartmentId: number;
    public DepartmantName: string;

    constructor() {
        super();
        this.id = 0;
        this.text = '';
        this.population = '';
        this.checked = false;
        this.children = [];
        this.User = new UserProfileModel();
        this.DepartmentId = 0;
        this.DepartmantName = '';
    }
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
    public Message: string;

    constructor() {
        super();
        this.UserId = 0;
        this.IsActive = false;
        this.IncidentId = 0;
        this.DepartmentId = 0;
        this.CreatedBy = 0;
        this.UserName = '';
        this.SituationId = '';
        this.IncidentId = 0;
        this.AttachmentSingle = '';
        this.ContactNumber = '';
        this.AlternetContactNumber = '';
        this.EmailId = '';
        this.Message = '';

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
    public Incident?: IncidentModel;
}

export class MessageTemplate {
    public GeneralMessageTemplate: string;
}