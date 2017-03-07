import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserProfileModel } from './userProfile.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface
} from '../../../../shared';


@Injectable()
export class UserProfileService implements IServiceInretface<UserProfileModel>{
    private _dataService: DataService<UserProfileModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<UserProfileModel>('UserProfiles', option);

    }

    GetAll(): Observable<ResponseModel<UserProfileModel>> {
        return this._dataService.Query().Execute();
    }

    Get(id: string | number): Observable<UserProfileModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: UserProfileModel): Observable<UserProfileModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: UserProfileModel[]): Observable<UserProfileModel[]> {
        return Observable.of(entities);
    }

    Update(entity: UserProfileModel): Observable<UserProfileModel> {
        let key: string = entity.UserProfileId.toString();
        return this._dataService.Patch(entity, key).Execute();
    }

    Delete(entity: UserProfileModel): void {
    }
}