import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { RAGScaleModel } from './ragscale.model';
import { IRAGScaleService } from './IRAGScaleService';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase,UtilityService
} from '../../../../shared';
import {
    IncidentService,
    IncidentModel
} from '../../../incident';

@Injectable()
export class RAGScaleService
    extends ServiceBase<RAGScaleModel>
    implements IRAGScaleService {
    /**
     * Creates an instance of InvolvePartyService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf InvolvePartyService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'RagScales');
    }


    GetAllActive(): Observable<ResponseModel<RAGScaleModel>> {
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute()
            .share();
    }

    GetAllActiveByAppliedModule(appliedModule:string): Observable<ResponseModel<RAGScaleModel>> {
        return this._dataService.Query()
            .Filter(`ActiveFlag eq 'Active' and AppliedModule eq ${appliedModule}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    
}