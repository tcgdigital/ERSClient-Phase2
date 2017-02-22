import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { QuickLinkModel } from './quicklink.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    IServiceInretface
} from '../../../../shared';

@Injectable()
export class QuickLinkService implements IServiceInretface<QuickLinkModel> {
    private _dataService: DataService<QuickLinkModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<QuickLinkModel>('QuickLinks', option);
    }

    GetAll(): Observable<ResponseModel<QuickLinkModel>> {
        let checkLists: ResponseModel<QuickLinkModel>;
        return this._dataService.Query()
            .OrderBy("CreatedOn desc")
            .Execute().map((data: ResponseModel<QuickLinkModel>) => {
                checkLists = data;
                for (var x of checkLists.Records) {
                    if (x.ActiveFlag == 'Active') {
                        x.Active = true;
                    }
                    else {
                        x.Active = false;
                    }
                }
                return checkLists;
            });
    }

    Get(id: string | number): Observable<QuickLinkModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: QuickLinkModel): Observable<QuickLinkModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: QuickLinkModel[]): Observable<QuickLinkModel[]> {
        return Observable.of(entities);
    }

    Update(entity: QuickLinkModel): Observable<QuickLinkModel> {
        let key: string = entity.QuickLinkId.toString()
        return this._dataService.Patch(entity, key).Execute();
    }

    Delete(entity: QuickLinkModel): void {
    }
}