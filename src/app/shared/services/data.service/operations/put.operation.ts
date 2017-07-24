import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpInterceptorService } from '../../../interceptor';
import { BaseModel, WEB_METHOD } from '../../../models';
import { DataProcessingService, DataOperation } from '../index';

/**
 * Data operation specific for JSON based PUT request
 *
 * @export
 * @class PutOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class PutOperation<T extends BaseModel> extends DataOperation<BaseModel> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptor: HttpInterceptorService,
        private typeName: string,
        private entity: T,
        private key: string,
        private actionSuffix?: string) {
        super(dataProcessingService, httpService, httpInterceptor, typeName, entity, key);
    }

    /**
     * Execute PUT request
     *
     * @returns {Observable<T>}
     *
     * @memberOf PutOperation
     */
    public Execute(): Observable<T> {
        const body = JSON.stringify(this.entity);
        const uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.actionSuffix);

        const requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.PUT, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.put(uri, body, requestOps)) as Observable<T>;
    }
}