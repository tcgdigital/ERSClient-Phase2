import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { BaseModel, WEB_METHOD, ResponseModel } from '../../../models';
import { UtilityService } from '../../../services';
import { DataProcessingService, DataOperation } from '../index';

/**
 * Data operation specific for odata query
 *
 * @export
 * @class QueryOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class QueryOperation<T extends BaseModel> extends DataOperation<T> {
    private _select: string;
    private _expand: string;

    private _filter: string;
    private _top: string;
    private _skip: string;
    private _orderby: string;
    private _count: string = 'true';

    /**
     * Creates an instance of QueryOperation.
     * @param {DataProcessingService} dataProcessingService 
     * @param {Http} httpService 
     * @param {string} typeName 
     * 
     * @memberOf QueryOperation
     */
    constructor(dataProcessingService: DataProcessingService,
        httpService: Http,
        typeName: string) {
        super(dataProcessingService, httpService, typeName);
    }

    /**
     * Select operation on data query response
     *
     * @param {(string | string[])} select
     * @returns {QueryOperation<T>}
     *
     * @memberOf QueryOperation
     */
    public Select(...select: string[]): QueryOperation<T> {
        this._select = UtilityService.ParseStringOrStringArray(select);
        return this;
    }

    /**
     * Expand operation on data query response
     *
     * @param {(string | string[])} expand
     * @returns {QueryOperation<T>}
     *
     * @memberOf QueryOperation
     */
    public Expand(...expand: string[]): QueryOperation<T> {
        this._expand = UtilityService.ParseStringOrStringArray(expand);
        return this;
    }

    /**
     * Filter operation on data query response
     *
     * @param {string} filter
     * @returns {QueryOperation<T>}
     *
     * @memberOf QueryOperation
     */
    public Filter(filter: string): QueryOperation<T> {
        this._filter = filter;
        return this;
    }

    /**
     * Top operation on data query response
     *
     * @param {string} top
     * @returns {QueryOperation<T>}
     *
     * @memberOf QueryOperation
     */
    public Top(top: string): QueryOperation<T> {
        this._top = top;
        return this;
    }

    /**
     * Skip operation on data query response
     *
     * @param {string} skip
     * @returns {QueryOperation<T>}
     *
     * @memberOf QueryOperation
     */
    public Skip(skip: string): QueryOperation<T> {
        this._skip = skip;
        return this;
    }

    /**
     * Count operation on data query response
     *
     * @param {string} count
     * @returns {QueryOperation<T>}
     *
     * @memberOf QueryOperation
     */
    public Count(count: string): QueryOperation<T> {
        this._count = count;
        return this;
    }

    /**
     * OrderBy operation on data query response
     *
     * @param {string} orderby
     * @returns {QueryOperation<T>}
     *
     * @memberOf QueryOperation
     */
    public OrderBy(orderby: string): QueryOperation<T> {
        this._orderby = orderby;
        return this;
    }

    /**
     * Execute requet query operation
     *
     * @returns {Observable<ResponseModel<T>>}
     *
     * @memberOf QueryOperation
     */
    public Execute(): Observable<ResponseModel<T>> {
        let params: URLSearchParams = this.GetQueryParams();
        let uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);

        let requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.GET, this.RequestHeaders, params);

        return super.HandleResponsesWithCount(this.HttpService.get(uri, requestOps));
    }

    /**
     * Generate OData URL search parameters
     *
     * @private
     * @returns {URLSearchParams}
     *
     * @memberOf QueryOperation
     */
    private GetQueryParams(externalFilter: string = ''): URLSearchParams {
        let params = new URLSearchParams();

        if (this._select && this._select.length > 0) params.set(this.DataProcessingService.Key.select, this._select);
        if (this._expand && this._expand.length > 0) params.set(this.DataProcessingService.Key.expand, this._expand);

        if (this._filter) { params.set(this.DataProcessingService.Key.filter, this._filter); }
        if (this._top) { params.set(this.DataProcessingService.Key.top, this._top); }
        if (this._skip) { params.set(this.DataProcessingService.Key.skip, this._skip); }
        if (this._orderby) { params.set(this.DataProcessingService.Key.orderby, this._orderby); }
        if (this._count) { params.set(this.DataProcessingService.Key.count, this._count); }

        return params;
    }
}
