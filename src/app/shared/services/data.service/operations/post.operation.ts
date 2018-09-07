import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpInterceptorService } from '../../../interceptor';
import {
    BaseModel, WEB_METHOD,
    RequestModel, ResponseModel, NameValue
} from '../../../models';
import { UtilityService } from '../../../services';
import { DataProcessingService, DataOperation } from '../index';
import { GlobalConstants } from '../../../constants';

/**
 * Data operation specific for JSON based POST request
 *
 * @export
 * @class PostOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class PostOperation<T extends BaseModel> extends DataOperation<BaseModel> {
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
        private httpInterceptor: HttpInterceptorService,
        private typeName: string,
        private entity: T) {
        super(dataProcessingService, httpService, httpInterceptor, typeName, entity);
        this.ActionSuffix = '';
        this.RequestHeaders = new Headers({
            'Content-Type': 'application/json; charset=utf-8; odata.metadata=none',
            'Accept': 'application/json; charset=utf-8; odata.metadata=none'
        });
    }

    /**
     * Execute POST request
     *
     * @returns {Observable<T>}
     *
     * @memberOf PostOperation
     */
    public Execute(): Observable<T> {
        const body: string = JSON.stringify(this.entity);
        const uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);

        const requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.POST, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.post(uri, body, requestOps)) as Observable<T>;
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
export class SimplePostOperation<T extends any> extends DataOperation<any> {

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
        private httpInterceptor: HttpInterceptorService,
        private typeName: string,
        private entity: any) {
        super(dataProcessingService, httpService, httpInterceptor, typeName, entity);
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
        const body: string = UtilityService.ObjectToUrlEncodedString(this.entity);
        const uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        const requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.SIMPLEPOST, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.post(uri, body, requestOps));
    }
}

/**
 * Data operation specific for simple JSON based POST request
 *
 * @export
 * @class JsonPostOperation
 * @extends {DataOperation<any>}
 * @template T
 */
export class JsonPostOperation<T extends any> extends DataOperation<any> {

    /**
     * Creates an instance of SimpleJsonPostOperation.
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {string} typeName
     * @param {T[]} entities
     * @param {string} [actionSufix]
     *
     * @memberof SimpleJsonPostOperation
     */
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptor: HttpInterceptorService,
        private typeName: string,
        private entities: T[],
        private actionSufix?: string) {
        super(dataProcessingService, httpService, httpInterceptor, entities);

        this.TypeName = typeName;
        if (actionSufix) this.ActionSuffix = actionSufix;
        this.dataProcessingService.EndPoint = GlobalConstants.API;
        this.RequestHeaders = new Headers(this.dataProcessingService.RequestHeader);
    }

    /**
     * Execute POST request
     *
     * @returns {Observable<any>}
     *
     * @memberOf SimplePostOperation
     */
    public Execute(): Observable<any> {
        const body: string = JSON.stringify(this.entities);
        const uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);

        const requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.POST, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.post(uri, body, requestOps));
    }
}

/**
 * Data operation specific for JSON based Bulk POST request
 *
 * @export
 * @class BulkPostOperation
 * @extends {DataOperation<BaseModel>}
 * @template T
 */
export class BulkPostOperation<T extends BaseModel> extends DataOperation<BaseModel>{
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptor: HttpInterceptorService,
        private typeName: string,
        private entities: T[],
        private actionSufix?: string) {
        super(dataProcessingService, httpService, httpInterceptor, entities);

        this.TypeName = typeName;

        if (actionSufix && actionSufix != null && actionSufix != undefined)
            this.ActionSuffix = actionSufix;

        this.dataProcessingService.EndPoint = GlobalConstants.API;
        this.RequestHeaders = new Headers({
            'Content-Type': 'application/json; charset=utf-8; odata.metadata=none',
            'Accept': 'application/json; charset=utf-8; odata.metadata=none'
        });
    }

    /**
     * Execute bulk POST request
     *
     * @returns {Observable<T[]>}
     *
     * @memberOf BulkPostOperation
     */
    public Execute(): Observable<T[]> {
        const body: string = JSON.stringify(this.entities);
        const uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);

        const requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.POST, this.RequestHeaders);

        return super.HandleResponses(this.HttpService.post(uri, body, requestOps)) as Observable<T[]>;
    }
}

/**
 * Data operation specific for JSON based batch request with any combination of requests
 * (GET, POST, PUT, PATCH, DELETE)
 *
 * @export
 * @class BatchPostOperation
 * @extends {DataOperation<RequestModel<BaseModel>>}
 * @template T
 */
export class BatchPostOperation<T extends RequestModel<BaseModel>>
    extends DataOperation<RequestModel<BaseModel>>{
    private uniqueId: string;

    /**
     * Creates an instance of BatchPostOperation.
     *
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {RequestModel<BaseModel>[]} entities
     *
     * @memberOf BatchPostOperation
     */
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptor: HttpInterceptorService,
        private entities: Array<RequestModel<BaseModel>>) {
        super(dataProcessingService, httpService, httpInterceptor, entities);
        this.uniqueId = UtilityService.UUID();
        this.dataProcessingService.EndPoint = GlobalConstants.BATCH;
        this.RequestHeaders = new Headers({
            'Content-Type': 'multipart/mixed; boundary=batch_' + this.uniqueId,
            // 'Host': GlobalConstants.EXTERNAL_URL,
            'Accept': 'text/plain'
        });
    }

    /**
     * Execute batch request
     *
     * @returns {Observable<T[]>}
     *
     * @memberOf BatchPostOperation
     */
    public Execute(): Observable<ResponseModel<BaseModel>> {
        const body: string = this.DataProcessingService
            .GenerateBachBodyPayload(this.entities, this.uniqueId);

        const uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);

        const requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.BATCHPOST, this.RequestHeaders);

        return super.HandleBatchResponses<BaseModel>(this.HttpService.post(uri, body, requestOps));
    }
}