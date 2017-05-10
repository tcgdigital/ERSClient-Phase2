import { BaseModel } from '../../../../shared';
import { NotificationModel } from "../../notification";
import { DepartmentModel } from "../../../masterdata/department";
import { UserPermissionModel } from "../../../masterdata/userpermission";


export class UserProfileModel extends BaseModel {
    public UserProfileId: number;
    public UserId: string;
    public IgaCode: string;
    public Name: string;
    public Email: string;
    public Designation: string;
    public DepartmentCode: string;
    public DepartmentName: string;
    public Location: string;
    public DateOfJoining?: Date;
    public DateOfBirth?: Date;
    public ManagerName: string;
    public ManagerEmailId: string;
    public Gender: string;
    public DoRes?: Date;
    public DoRel?: Date;
    public EmployeeGroup: string;
    public EmployeeSubGroup: string;
    public Grade: string;
    public HOD: string;
    public LastPromotionDate?: Date;
    public MainContact: string;
    public PersonalEmailId: string;
    public ConfirmationDate?: Date;
    public EmployementStatus: string;
    public AlternateContact: string;
    public DeviceId: string;
    public RegistrationId: string;
    public DeviceOS: string;
    public isActive: boolean;
    public ResignedOn?: Date;


    public UserPermissions?: UserPermissionModel[];
    public Notifications?: NotificationModel[];
    public Departments?: DepartmentModel[];
	/**
	 * Creates an instance of UserProfileModel.
	 * 
	 * @memberOf UserProfileModel
	 */
    constructor() {
        super();
        this.UserProfileId = 0;
        this.UserId = '';
        this.IgaCode = '';
        this.Name = '';
        this.Email = '';
        this.Designation = '';
        this.DepartmentCode = '';
        this.DepartmentName = '';
        this.Location = '';
        this.DateOfJoining = null;
        this.DateOfBirth = null;
        this.ManagerName = '';
        this.ManagerEmailId = '';
        this.Gender = '';
        this.DoRes = null;
        this.DoRel = null;
        this.EmployeeGroup = '';
        this.EmployeeSubGroup = '';
        this.Grade = '';
        this.HOD = '';
        this.LastPromotionDate = null;
        this.MainContact = '';
        this.PersonalEmailId = '';
        this.ConfirmationDate = null;
        this.EmployementStatus = '';
        this.AlternateContact = '';
        this.DeviceId = '';
        this.RegistrationId = '';
        this.DeviceOS = '';
        this.isActive = false;
        this.ResignedOn = null;
    }
}