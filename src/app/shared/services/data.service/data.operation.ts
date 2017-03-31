import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { BaseModel, ResponseModel } from '../../models';
import { DataProcessingService } from './data.processing.service';

export abstract class DataOperation<T> {

    protected DataProcessingService: DataProcessingService;
    protected HttpService: Http;
    protected RequestHeaders: Headers;
    protected TypeName: string = '';
    protected Key: string = '';
    protected ActionSuffix: string = '';
    protected Entity: T;
    protected Entities: T[];

    /**
     * Creates an instance of DataOperation.
     * 
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {string} typeName
     * 
     * @memberOf DataOperation
     */
    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeName: string);

    /**
     * Creates an instance of DataOperation.
     * 
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {(string | T[])} typeNameOrEntities
     * 
     * @memberOf DataOperation
     */
    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[]);

    /**
     * Creates an instance of DataOperation.
     * 
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {(string | T[])} typeNameOrEntities
     * @param {string} [key]
     * 
     * @memberOf DataOperation
     */
    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[],
        key?: string);

    /**
     * Creates an instance of DataOperation.
     * 
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {(string | T[])} typeNameOrEntities
     * @param {(string | T)} [keyOrEntity]
     * @param {string} [key]
     * 
     * @memberOf DataOperation
     */
    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[],
        keyOrEntity?: string | T,
        key?: string);

    /**
     * Creates an instance of DataOperation.
     * 
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {(string | T[])} typeNameOrEntities
     * @param {(string | T)} [keyOrEntity]
     * @param {string} [key]
     * @param {string} [actionSuffix]
     * 
     * @memberOf DataOperation
     */
    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[],
        keyOrEntity?: string | T,
        key?: string,
        actionSuffix?: string) {

        // this.RequestHeaders = new Headers();
        this.HttpService = httpService;
        this.DataProcessingService = dataProcessingService;

        if (typeof typeNameOrEntities === 'string') {
            this.TypeName = <string>typeNameOrEntities;
        } else {
            this.Entities = <T[]>typeNameOrEntities;
        }

        if (keyOrEntity) {
            if (typeof keyOrEntity === 'string') {
                this.Key = <string>keyOrEntity;
            } else {
                this.Entity = <T>keyOrEntity;
            }
        }
        if (actionSuffix) this.ActionSuffix = actionSuffix;
        if (key) this.Key = key;
    }

    /**
     * Handle response for single entity
     *
     * @protected
     * @param {Observable<Response>} entity
     * @returns {(Observable<T | any>)}
     *
     * @memberOf DataOperation
     */
    protected HandleResponse(entity: Observable<Response>): Observable<T> {
        return entity.map(this.DataProcessingService.ExtractQueryResult)
            .catch((error: any) => {
                this.DataProcessingService.HandleError(error);
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    /**
     * Handle response for collection of entities
     *
     * @protected
     * @param {Observable<Response>} entity
     * @returns {(Observable<T[] | any[]>)}
     *
     * @memberOf DataOperation
     */
    protected HandleResponses(entity: Observable<Response>): Observable<T[]> {
        return entity.map(this.DataProcessingService.ExtractQueryResults)
            .catch((error: any) => {
                this.DataProcessingService.HandleError(error);
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    /**
     * Handle response for collection of entities for batch operation
     * 
     * @protected
     * @param {Observable<Response>} entity
     * @returns {(Observable<T[] | any[]>)}
     * 
     * @memberOf DataOperation
     */
    protected HandleBatchResponses<TOut extends BaseModel>(entity: Observable<Response>): Observable<ResponseModel<TOut>>{
        return entity.map(this.DataProcessingService.ExtractBatchQueryResults)
            .catch((error: any) => {
                this.DataProcessingService.HandleError(error);
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    /**
     * Handle response for collection of entities with number of record count
     *
     * @protected
     * @param {Observable<Response>} entity
     * @returns {Observable<ResponseModel<T>>}
     *
     * @memberOf DataOperation
     */
    protected HandleResponsesWithCount<TOut extends BaseModel>(entity: Observable<Response>): Observable<ResponseModel<TOut>> {
        return entity.map(this.DataProcessingService.ExtractQueryResultsWithCount)
            .catch((error: any) => {
                this.DataProcessingService.HandleError(error);
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    /**
     *  Handle response for number of record count
     * 
     * @protected
     * @param {Observable<Response>} entity 
     * @returns {Observable<number>} 
     * 
     * @memberOf DataOperation
     */
    protected HandleResponseCount(entity: Observable<Response>): Observable<number> {
        return entity.map(this.DataProcessingService.ExtractCount)
            .catch((error: any) => {
                this.DataProcessingService.HandleError(error);
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    /**
     * Definition of abstruct execute functon
     *
     * @abstract
     * @param {any} args
     * @returns {Observable<any>}
     *
     * @memberOf DataOperation
     */
    abstract Execute(...args): Observable<any>;
}