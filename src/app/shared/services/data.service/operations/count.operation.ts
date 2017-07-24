import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpInterceptorService } from '../../../interceptor';
import { BaseModel, WEB_METHOD, ResponseModel } from '../../../models';
import { UtilityService } from '../../../services';
import { DataProcessingService, DataOperation } from '../index';
import { GlobalConstants } from '../../../constants';

/**
 * Data operation specific for odata query for record count
 *
 * @export
 * @class CountOperation
 * @extends {DataOperation<T>}
 * @template T
 */
export class CountOperation<T extends BaseModel> extends DataOperation<T> {

    private _filter: string;
    private _count: string = 'true';
    private _top: string = '0';

    /**
     * Creates an instance of CountOperation.
     * @param {DataProcessingService} dataProcessingService
     * @param {Http} httpService
     * @param {string} typeName
     *
     * @memberOf CountOperation
     */
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptor: HttpInterceptorService,
        private typeName: string) {
        super(dataProcessingService, httpService, httpInterceptor, typeName);
        this.dataProcessingService.EndPoint = GlobalConstants.ODATA;
    }

    /**
     * Filter operation
     *
     * @param {string} filter
     * @returns {CountOperation<T>}
     *
     * @memberOf CountOperation
     */
    public Filter(filter: string): CountOperation<T> {
        this._filter = filter;
        return this;
    }

    /**
     * Returns the count of Operation.
     *
     * @param {string} count
     * @returns {CountOperation<T>}
     *
     * @memberOf CountOperation
     */
    /*public Count(count: string): CountOperation<T> {
        this._count = count;
        return this;
    }*/

    /**
     * Execute the count operation
     *
     * @returns {Observable<number>}
     *
     * @memberOf CountOperation
     */
    public Execute(): Observable<number> {
        const params: URLSearchParams = this.GetQueryParams();
        const uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);

        const requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.GET, this.RequestHeaders, params);

        return super.HandleResponseCount(this.HttpService.get(uri, requestOps));
    }


    /**
     * Query operation builder.
     *
     * @private
     * @param {string} [externalFilter='']
     * @returns {URLSearchParams}
     *
     * @memberOf CountOperation
     */
    private GetQueryParams(externalFilter: string = ''): URLSearchParams {
        const params = new URLSearchParams();
        if (this._filter) { params.set(this.DataProcessingService.Key.filter, this._filter); }
        if (this._count) { params.set(this.DataProcessingService.Key.count, this._count); }
        if (this._top) { params.set(this.DataProcessingService.Key.top, this._top); }

        return params;
    }
}
