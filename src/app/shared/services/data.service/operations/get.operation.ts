import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { BaseModel, WEB_METHOD } from '../../../models';
import { DataProcessingService, DataOperation } from '../index';

/**
 * Data operation specific for GET request
 *
 * @export
 * @class GetOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class GetOperation<T extends BaseModel> extends DataOperation<BaseModel> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private typeName: string,
        private key: string,
        private actionSuffix?: string) {
        super(dataProcessingService, httpService, typeName, key);
    }

    /**
     * Execute GET request
     *
     * @returns {Observable<T>}
     *
     * @memberOf GetOperation
     */
    public Execute(): Observable<T> {
        let uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.actionSuffix);
        let requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.GET, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.get(uri, requestOps));
    }
}