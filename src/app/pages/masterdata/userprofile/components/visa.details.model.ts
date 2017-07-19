import { BaseModel } from '../../../../shared';
import { UserProfileModel } from './userprofile.model'

export class VisaDetailsModel extends BaseModel{
    public VisaDetailsId : number;
    public VisaNumber : string;
    public VisaValidity? : Date;
    public UserId? : number;
    public User? : UserProfileModel;
}