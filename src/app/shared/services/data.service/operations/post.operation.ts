import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { BaseModel, WEB_METHOD, RequestModel, ResponseModel } from '../../../models';
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
        let body: string = JSON.stringify(this.entity);
        let uri: string = this.dataProcessingService
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
        let uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        let requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.SIMPLEPOST, this.RequestHeaders);

        console.log(body);
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
        private typeName: string,
        private entities: T[],
        private actionSufix?: string) {
        super(dataProcessingService, httpService, entities);

        this.TypeName = typeName;
        if (actionSufix)
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
        let body: string = JSON.stringify(this.entities);
        let uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        
        console.log(uri);
        let requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.POST, this.RequestHeaders);

        return super.HandleResponses(this.HttpService.post(uri, body, requestOps));
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
export class BatchPostOperation<T extends RequestModel<BaseModel>> extends DataOperation<RequestModel<BaseModel>>{
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
        private entities: Array<RequestModel<BaseModel>>) {
        super(dataProcessingService, httpService, entities);

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
        let body: string = this.DataProcessingService.GenerateBachBodyPayload(this.entities, this.uniqueId);
        let uri: string = this.dataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);
        let requestOps: RequestOptions = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.BATCHPOST, this.RequestHeaders);

        return super.HandleBatchResponses<BaseModel>(this.HttpService.post(uri, body, requestOps));
    }
}