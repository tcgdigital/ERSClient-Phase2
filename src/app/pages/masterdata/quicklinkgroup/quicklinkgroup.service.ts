import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { QuickLinkGroupModel } from './quicklinkgroup.model';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../shared';

@Injectable()
export class QuickLinkGroupService extends ServiceBase<QuickLinkGroupModel> {

    /**
     * Creates an instance of QuickLinkService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf QuickLinkService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'QuickLinkGroups');
    }

    GetAll(): Observable<ResponseModel<QuickLinkGroupModel>> {
        let quickLinkGroups: ResponseModel<QuickLinkGroupModel>;
        return this._dataService
            .Query()
            .OrderBy("CreatedOn desc")
            .Execute().map((data: ResponseModel<QuickLinkGroupModel>) => {
                quickLinkGroups = data;
                quickLinkGroups.Records.forEach(x => x.Active = (x.ActiveFlag == 'Active'));
                return quickLinkGroups;
            });
    }

    GetQuery(query: string): Observable<ResponseModel<QuickLinkGroupModel>> {
        let quickLinks: ResponseModel<QuickLinkGroupModel>;
        return this._dataService.Query()
            .Filter(query)
            .OrderBy("CreatedOn desc")
            .Execute()
            .map((data: ResponseModel<QuickLinkGroupModel>) => {
                quickLinks = data;
                quickLinks.Records.forEach(x => x.Active = (x.ActiveFlag == 'Active'));
                return quickLinks;
            });
    }
}