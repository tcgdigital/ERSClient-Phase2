import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseModel, RequestModel, NameValue } from '../../models';
import { DataProcessingService } from './data.processing.service';
import { HttpInterceptorService } from '../../interceptor';
import {
    GetOperation,
    SimpleGetOperation,
    BulkGetOperation,
    QueryOperation,
    PostOperation,
    SimplePostOperation,
    JsonPostOperation,
    BulkPostOperation,
    BatchPostOperation,
    PutOperation,
    PatchOperation,
    DeleteOperation,
    CountOperation
} from './operations';

/**
 * Generic Data Service
 *
 * @export
 * @class DataService
 * @template T
 */
export class DataService<T extends BaseModel>{
    constructor(private typeName: string,
        private httpService: Http,
        private httpInterceptorService: HttpInterceptorService,
        private dataProcessingService: DataProcessingService,
        private actionSuffix?: string) {
    }

    /**
     * Get an instance of QueryOperation for OData query request
     *
     * @param {string} [query]
     * @returns {QueryOperation<T>}
     *
     * @memberOf DataService
     */
    public Query(): QueryOperation<T> {
        return new QueryOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName);
    }

    /**
     * Get an instance of QueryOperation for OData GET request
     *
     * @param {string} key
     * @returns {GetOperation<T>}
     *
     * @memberOf DataService
     */
    public Get(key: string): GetOperation<T> {
        return new GetOperation<T>(this.dataProcessingService, this.httpService,
            this.httpInterceptorService, this.typeName, key, this.actionSuffix);
    }

    /**
     * Get an instance of QueryOperation for API GET request
     *
     * @param {string} key
     * @returns {GetOperation<T>}
     *
     * @memberOf DataService
     */
    public SimpleGet(param: string = ''): SimpleGetOperation<any> {
        return new SimpleGetOperation<any>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, (param !== '') ? (this.actionSuffix + param) : this.actionSuffix);
    }

    public BulkGet(param: string = ''): BulkGetOperation<any[]> {
        return new BulkGetOperation<any>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, (param !== '') ? (this.actionSuffix + param) : this.actionSuffix);
    }

    /**
     * Get an instance of CountOperation for OData GET Count request
     *
     * @returns {CountOperation<T>}
     *
     * @memberOf DataService
     */
    public Count(): CountOperation<T> {
        return new CountOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName);
    }

    /**
     * Get an instance of PostOperation for URLEncoded POST request
     *
     * @param {*} entity
     * @param {string} key
     * @returns {SimplePostOperation<any>}
     *
     * @memberOf DataService
     */
    public SimplePost(entity: any): SimplePostOperation<any> {
        return new SimplePostOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, entity);
    }

    /**
     * Get an instance of PostOperation for JSON based POST request
     *
     * @param {*} entity
     * @returns {JsonPostOperation<any>}
     *
     * @memberof DataService
     */
    public JsonPost(entity: any): JsonPostOperation<any> {
        return new JsonPostOperation<T>(this.dataProcessingService,
            this.httpService, this.httpInterceptorService, this.typeName, entity, this.actionSuffix);
    }

    /**
     * Get an instance of QueryOperation for OData POST request
     *
     * @param {T} entity
     * @param {string} key
     * @returns {PostOperation<T>}
     *
     * @memberOf DataService
     */
    public Post(entity: T): PostOperation<T> {
        return new PostOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, entity);
    }

    /**
     * Get an instance of QueryOperation for Bulk API POST request
     *
     * @param {T[]} entities
     * @returns {BulkPostOperation<T>}
     *
     * @memberOf DataService
     */
    public BulkPost(entities: T[]): BulkPostOperation<T> {
        return new BulkPostOperation<T>(this.dataProcessingService,
            this.httpService, this.httpInterceptorService, this.typeName, entities, this.actionSuffix);
    }

    /**
     * Get an instance of QueryOperation for Batch OData POST request
     *
     * @param {Array<RequestModel<T>>} entities
     * @returns {BatchPostOperation<RequestModel<T>>}
     *
     * @memberOf DataService
     */
    public BatchPost<TOut extends BaseModel>(entities: Array<RequestModel<TOut>>):
        BatchPostOperation<RequestModel<TOut>> {
        return new BatchPostOperation<RequestModel<TOut>>(this.dataProcessingService, this.httpService, this.httpInterceptorService, entities);
    }

    /**
     * Get an instance of QueryOperation for OData PATCH request
     *
     * @param {*} entity
     * @param {string} key
     * @returns {PatchOperation<T>}
     *
     * @memberOf DataService
     */
    public Patch(entity: any, key: string): PatchOperation<T> {
        return new PatchOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, entity, key);
    }

    /**
     * Get an instance of QueryOperation for OData PATCH request with additional header information
     *
     * @param {*} entity
     * @param {string} key
     * @param {*} additionalHeader
     * @returns {PatchOperation<T>}
     * @memberof DataService
     */
    public PatchWithHeader(entity: any, key: string, additionalHeader: NameValue<string>): PatchOperation<T> {
        return new PatchOperation<T>(this.dataProcessingService, this.httpService, 
            this.httpInterceptorService, this.typeName, entity, key, additionalHeader);
    }

    /**
     * Get an instance of QueryOperation for PUT request
     *
     * @param {T} entity
     * @param {string} key
     * @returns {PutOperation<T>}
     *
     * @memberOf DataService
     */
    public Put(entity: T, key: string): PutOperation<T> {
        return new PutOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, entity, key);
    }

    /**
     * Get an instance of QueryOperation for DELETE request
     *
     * @param {string} key
     * @returns {DeleteOperation<T>}
     *
     * @memberOf DataService
     */
    public Delete(key: string): DeleteOperation<T> {
        return new DeleteOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, key);
    }

    /**
     * Get an instance of QueryOperation for custom function request
     *
     * @param {string} key
     * @param {string} actionName
     * @returns {GetOperation<any>}
     *
     * @memberOf DataService
     */
    public CustomFunction(key: string, actionName: string): GetOperation<any> {
        return new GetOperation<T>(this.dataProcessingService, this.httpService, this.httpInterceptorService, this.typeName, key, actionName);
    }
}

