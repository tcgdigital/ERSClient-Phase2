import { BaseModel } from "../../../../shared";
import { IncidentModel } from "../../../incident";
import { DepartmentModel } from "../../../masterdata/department";
import { AffectedPeopleModel } from "../../affected.people";
import { UserProfileModel } from "../../../masterdata/userprofile";

export class CareMemberTrackerModel extends BaseModel {
    public CareEngagementTrackId: number;
    public CareMemberName: string;
    public EffectedFrom: Date;
    public IncidentId: number;
    public UserProfileId: number;
    public DepartmentId: number;
    public AffectedPersonId?: number;

    public Incident: IncidentModel;
    public UserProfile: UserProfileModel
    public Department?: DepartmentModel;
    public AffectedPerson?: AffectedPeopleModel;

    /**
     *Creates an instance of CareMemberTrackerModel.
     * @memberof CareMemberTrackerModel
     */
    constructor() {
        super();
        
        this.CareEngagementTrackId = 0;
        this.CareMemberName = '';
        this.IncidentId = 0;
        this.UserProfileId = 0;
        this.DepartmentId = 0;
        this.AffectedPersonId = null;
        this.Incident = null;
        this.UserProfile = null;
        this.Department = null;
        this.AffectedPerson = null;
    }
}