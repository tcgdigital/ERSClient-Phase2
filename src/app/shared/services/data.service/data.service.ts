import { Http } from '@angular/http';

import { BaseModel } from '../../models';
import { DataProcessingService } from './data.processing.service';
import {
    GetOperation,
    QueryOperation,
    PostOperation,
    SimplePostOperation,
    PutOperation,
    PatchOperation,
    DeleteOperation
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
        private dataProcessingService: DataProcessingService) {
    }

    /**
     * Get an instance of QueryOperation for OData request
     *
     * @returns {QueryOperation<T>}
     *
     * @memberOf DataService
     */
    public Query(): QueryOperation<T> {
        return new QueryOperation<T>(this.dataProcessingService, this.httpService, this.typeName);
    }

    /**
     * Get an instance of QueryOperation for GET request
     *
     * @param {string} key
     * @returns {GetOperation<T>}
     *
     * @memberOf DataService
     */
    public Get(key: string): GetOperation<T> {
        return new GetOperation<T>(this.dataProcessingService, this.httpService, this.typeName, key);
    }

    /**
     * Get an instance of QueryOperation for URLEncoded POST request
     *
     * @param {*} entity
     * @param {string} key
     * @returns {SimplePostOperation<any>}
     *
     * @memberOf DataService
     */
    public SimplePost(entity: any): SimplePostOperation<any> {
        return new SimplePostOperation<T>(this.dataProcessingService, this.httpService, this.typeName, entity);
    }

    /**
     * Get an instance of QueryOperation for POST request
     *
     * @param {T} entity
     * @param {string} key
     * @returns {PostOperation<T>}
     *
     * @memberOf DataService
     */
    public Post(entity: T): PostOperation<T> {
        return new PostOperation<T>(this.dataProcessingService, this.httpService, this.typeName, entity);
    }

    /**
     * Get an instance of QueryOperation for PATCH request
     *
     * @param {*} entity
     * @param {string} key
     * @returns {PatchOperation<T>}
     *
     * @memberOf DataService
     */
    public Patch(entity: any, key: string): PatchOperation<T> {
        return new PatchOperation<T>(this.dataProcessingService, this.httpService, this.typeName, entity, key);
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
        return new PutOperation<T>(this.dataProcessingService, this.httpService, this.typeName, entity, key);
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
        return new DeleteOperation<T>(this.dataProcessingService, this.httpService, this.typeName, key);
    }

    // public CustomAction(key: string, actionName: string, postData: any): Observable<any> {
    //     let body = JSON.stringify(postData);
    //     return new PutOperation<any>(this.dataProcessingService, this.httpService, this.typeName, body, key, actionName);
    // }

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
        return new GetOperation<T>(this.dataProcessingService, this.httpService, this.typeName, key, actionName);
    }
}

