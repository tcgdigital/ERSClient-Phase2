import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { BaseModel, WEB_METHOD } from '../../../models';
import { UtilityService } from '../../../services';
import { DataProcessingService, DataOperation } from '../index';


/**
 * Data operation specific for JSON based POST request
 *
 * @export
 * @class PostOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class PostOperation<T extends BaseModel> extends DataOperation<T> {
    /**
     * Creates an instance of PostOperation.
     *
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {string} typeName
     * @param {T} entity
     *
     * @memberOf PostOperation
     */
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private typeName: string,
        private entity: T) {
        super(dataProcessingService, httpService, typeName, entity);
        this.ActionSuffix = '';
    }

    /**
     * Execute POST request
     *
     * @returns {Observable<T>}
     *
     * @memberOf PostOperation
     */
    public Execute(): Observable<T> {
        let body = JSON.stringify(this.entity);
        let uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        let requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.POST, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.post(uri, body, requestOps));
    }
}


/**
 * Data operation specific for simple URLEncoded based POST request
 *
 * @export
 * @class SimplePostOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class SimplePostOperation<T extends any> extends DataOperation<T> {

    /**
     * Creates an instance of SimplePostOperation.
     *
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {string} typeName
     * @param {*} entity
     *
     * @memberOf SimplePostOperation
     */
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private typeName: string,
        private entity: any) {
        super(dataProcessingService, httpService, typeName, entity);
        this.RequestHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    /**
     * Execute POST request
     *
     * @returns {Observable<any>}
     *
     * @memberOf SimplePostOperation
     */
    public Execute(): Observable<any> {
        let body: string = UtilityService.ObjectToUrlEncodedString(this.entity);
        let uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        let requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.POST, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.post(uri, body, requestOps));
    }
}