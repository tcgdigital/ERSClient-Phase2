import { Http } from '@angular/http';
import { HttpInterceptorService } from '../../../interceptor';
import { Observable } from 'rxjs/Rx';
import { BaseModel, WEB_METHOD } from '../../../models';
import { DataProcessingService, DataOperation } from '../index';
import { GlobalConstants } from '../../../constants';

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
        private httpInterceptorService: HttpInterceptorService,
        private typeName: string,
        private key: string,
        private actionSuffix?: string) {
        super(dataProcessingService, httpService, httpInterceptorService, typeName, key);
        if (actionSuffix) {
            this.ActionSuffix = actionSuffix;
            this.dataProcessingService.EndPoint = GlobalConstants.API;
        }
    }



    /**
     * Execute GET request
     *
     * @returns {Observable<T>}
     *
     * @memberOf GetOperation
     */
    public Execute(): Observable<T> {
        const uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.actionSuffix);
        const requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.GET, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.get(uri, requestOps))  as Observable<T>;
    }
}

/**
 * Data operation specific for GET request for any data model
 *
 * @export
 * @class GetOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class SimpleGetOperation<T extends any> extends DataOperation<any> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptorService: HttpInterceptorService,
        private typeName: string,
        private actionSuffix?: string) {
        super(dataProcessingService, httpService, httpInterceptorService, typeName);

        if (actionSuffix) {
            this.ActionSuffix = actionSuffix;
            this.dataProcessingService.EndPoint = GlobalConstants.API;
        }
    }

    /**
     * Execute GET request
     *
     * @returns {Observable<T>}
     *
     * @memberOf GetOperation
     */
    public Execute(): Observable<T> {
        const uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.actionSuffix);

        const requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.GET, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.get(uri, requestOps));
    }
}

/**
 * Data operation specific for GET request for any data model
 *
 * @export
 * @class GetOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class BulkGetOperation<T extends any> extends DataOperation<any> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptorService: HttpInterceptorService,
        private typeName: string,
        private actionSuffix?: string) {
        super(dataProcessingService, httpService, httpInterceptorService, typeName);

        if (actionSuffix) {
            this.ActionSuffix = actionSuffix;
            this.dataProcessingService.EndPoint = GlobalConstants.API;
        }
    }

    /**
     * Execute GET request
     *
     * @returns {Observable<T>}
     *
     * @memberOf GetOperation
     */
    public Execute(): Observable<T[]> {
        const uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.actionSuffix);

        const requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.GET, this.RequestHeaders);

        return super.HandleResponses(this.HttpService.get(uri, requestOps));
    }
}