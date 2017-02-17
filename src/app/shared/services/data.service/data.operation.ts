import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { BaseModel, ResponseModel } from '../../models';
import { DataProcessingService } from './data.processing.service';

export abstract class DataOperation<T extends BaseModel | any> {

    protected DataProcessingService: DataProcessingService;
    protected HttpService: Http;
    protected RequestHeaders: Headers;
    protected TypeName: string = '';
    protected Key: string = '';
    protected ActionSuffix: string = '';
    protected Entity: T;
    protected Entities: T[];

    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeName: string);

    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[]);

    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[],
        key?: string);

    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[],
        keyOrEntity?: string | T,
        key?: string);

    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeNameOrEntities: string | T[],
        keyOrEntity?: string | T,
        key?: string,
        actionSuffix?: string) {
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
    protected HandleResponse(entity: Observable<Response>): Observable<T | any> {
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
    protected HandleResponses(entity: Observable<Response>): Observable<T[] | any[]> {
        return entity.map(this.DataProcessingService.ExtractQueryResults)
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
    protected HandleResponsesWithCount(entity: Observable<Response>): Observable<ResponseModel<T>> {
        return entity.map(this.DataProcessingService.ExtractQueryResultsWithCount)
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