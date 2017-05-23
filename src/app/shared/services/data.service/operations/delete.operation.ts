
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpInterceptorService } from '../../../interceptor';
import { BaseModel, WEB_METHOD } from '../../../models';
import { DataProcessingService, DataOperation } from '../index';

/**
 * Data operation specific for DELETE request
 *
 * @export
 * @class DeleteOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class DeleteOperation<T extends BaseModel> extends DataOperation<BaseModel> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptor: HttpInterceptorService,
        private typeName: string,
        private key: string) {
        super(dataProcessingService, httpService,httpInterceptor, typeName, key);
    }

    /**
     * Execute DELETE request
     *
     * @returns {Observable<T>}
     *
     * @memberOf DeleteOperation
     */
    public Execute(): Observable<T> {
        let uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        let requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.DELETE, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.delete(uri, requestOps));
    }
}