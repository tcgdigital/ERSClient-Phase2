import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { QuickLinkModel } from './quicklink.model';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';

@Injectable()
export class QuickLinkService extends ServiceBase<QuickLinkModel> {

    /**
     * Creates an instance of QuickLinkService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf QuickLinkService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'QuickLinks');
    }

    GetAll(): Observable<ResponseModel<QuickLinkModel>> {
        let quickLinks: ResponseModel<QuickLinkModel>;
        return this._dataService
            .Query()
            .Expand('QuickLinkGroup($select=GroupName)')
            .OrderBy("CreatedOn desc")
            .Execute().map((data: ResponseModel<QuickLinkModel>) => {
                quickLinks = data;
                quickLinks.Records.forEach(x => x.Active = (x.ActiveFlag == 'Active'));
                return quickLinks;
            });
    }

     GetQuery(query: string): Observable<ResponseModel<QuickLinkModel>> {
       let quickLinks: ResponseModel<QuickLinkModel>;
        return this._dataService
            .Query()
            .Expand('QuickLinkGroup($select=GroupName)')
            .OrderBy("CreatedOn desc")
            .Filter(query) .Execute().map((data: ResponseModel<QuickLinkModel>) => {
                quickLinks = data;
                quickLinks.Records.forEach(x => x.Active = (x.ActiveFlag == 'Active'));
                return quickLinks;
          
            });
    }
}