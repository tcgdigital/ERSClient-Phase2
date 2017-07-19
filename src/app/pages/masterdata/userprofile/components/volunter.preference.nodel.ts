import { BaseModel } from '../../../../shared';
import { UserProfileModel } from './userprofile.model'

export class VolunterPreferenceModel extends BaseModel{
    public VolunterPreferenceId : number;
    public VoluterPreferenceName : string;

    public UserId? : number;
    public User? : UserProfileModel;
}