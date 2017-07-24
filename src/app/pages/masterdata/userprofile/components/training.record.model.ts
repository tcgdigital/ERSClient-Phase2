import { BaseModel } from '../../../../shared';
import { UserProfileModel } from './userprofile.model'

export class TrainingRecordModel extends BaseModel{
    public TrainingRecordId : number;
    public CourseName : string;
    public CourseStartDate? : Date;
    public CourseEndDate? : Date;
    
    public UserId? : number;
    public User? : UserProfileModel;
}