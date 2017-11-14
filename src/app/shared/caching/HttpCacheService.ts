import { Injectable } from '@angular/core';
import {
    Http, Headers, Request, RequestOptions,
    ConnectionBackend, RequestOptionsArgs,
    Response
} from "@angular/http";
import { Observable, Subscriber } from 'rxjs';

import * as lodash from 'lodash';
import * as localForage from 'localforage';


@Injectable()
export class HttpCacheService extends Http {

    constructor(private backend: ConnectionBackend, private defaultOptions: RequestOptions) {
        super(backend, defaultOptions);

        localForage.config({
            // driver: localForage.WEBSQL,
            name: 'HttpCache',
            storeName: 'endpoints',
            description: 'Store http responses'
        });
    }

    public request(req: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        let url = typeof req === 'string' ? req : req.url;

        let reqResponse: Observable<Response> = new Observable((subscriber: Subscriber<Response>) => {
            Observable.fromPromise(localForage.getItem(url))
                .subscribe((localData: Response) => {
                    if (localData != null)
                        subscriber.next(localData);

                    super.request(url, options)
                        .map((resp: Response) => {
                            if (typeof resp === 'object')
                                return resp.json();
                            else
                                return resp;

                        }).subscribe((remoteData: Response) => {
                            if (lodash.isEqual(remoteData, localData))
                                subscriber.complete();
                            else {
                                Observable.fromPromise(localForage.setItem(url, remoteData))
                                    .subscribe((saved) => {
                                        subscriber.next(remoteData);
                                        subscriber.complete();
                                    });
                            }
                        });
                });
        });

        return reqResponse;
    }
}