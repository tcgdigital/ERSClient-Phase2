import { Observable } from 'rxjs/Rx';
import { UserProfileModel } from './userprofile.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IUserProfileService extends IServiceInretface<UserProfileModel> {
    
}