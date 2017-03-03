import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { BaseModel, WEB_METHOD } from '../../../models';
import { DataProcessingService, DataOperation } from '../index';

/**
 * Data operation specific for JSON based PATCH request
 *
 * @export
 * @class PatchOperation
 * @extends {(DataOperation<T | any>)}
 * @template T
 */
export class PatchOperation<T extends BaseModel | any> extends DataOperation<BaseModel | any> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private typeName: string,
        private entity: T,
        private key: string) {
        super(dataProcessingService, httpService, typeName, entity);       
    }

    /**
     * Execute PATCH request
     *
     * @returns {(Observable<T | any>)}
     *
     * @memberOf PatchOperation
     */
    public Execute(): Observable<T | any> {
        let body = JSON.stringify(this.entity);
        debugger;
        let uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        let requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.PATCH, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.patch(uri, body, requestOps));
    }
}