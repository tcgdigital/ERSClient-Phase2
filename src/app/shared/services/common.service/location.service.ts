import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { Location } from '../../models';
import * as loadGoogleMapsApi from 'load-google-maps-api-2';

@Injectable()
export class LocationService {
    private api: any;
    private google: any;

    constructor() {
        // console.log(this.google);
        // if (!this.google.maps)
        //     this.api = loadGoogleMapsApi({ version: 3, key: 'AIzaSyA7flhwfs8nIwqnisopkJAu77ettcUPAYM' });
    }

    public GetLocation(location: string): Observable<Location> {
        if (!this.google.maps) {
            return new Observable((observer: Observer<Location>) => {
                Observable.fromPromise(this.api)
                    .subscribe((googleMaps: any) => {
                        this.fetchLocationByApi(location, googleMaps, observer);
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            });
        } else {
            return new Observable((observer: Observer<Location>) => {
                const googleMaps = new this.google.maps.Geocoder();
                console.log(googleMaps);
                this.fetchLocationByApi(location, googleMaps, observer);
            });
        }



        // if (navigator.geolocation) {
        //     return new Observable((observer: Observer<Location>) => {
        //         // Invokes getCurrentPosition method of Geolocation API.
        //         navigator.geolocation.getCurrentPosition(
        //             (position: Position) => {
        //                 observer.next(new Location(position.coords.latitude, position.coords.longitude));
        //                 observer.complete();
        //             },
        //             (error: PositionError) => {
        //                 console.log('Geolocation service: ' + error.message);
        //                 observer.error(error);
        //             }
        //         );
        //     });
        // }
    }

    private fetchLocationByApi(location: string, apiInstance: any, observer: Observer<Location>): void {
        try {
            const geocoder = new apiInstance.Geocoder();
            if (geocoder) {
                geocoder.geocode({ 'address': location }, (results: any, status: string) => {
                    if (status === 'OK') {
                        console.log(results);
                        // return new Location(results[0].geometry.location.latitude, results[0].geometry.location.longitude);
                        observer.next(new Location(results[0].geometry.location.latitude, results[0].geometry.location.longitude));
                        observer.complete();
                    } else {
                        observer.error('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }
        } catch (ex) {
            observer.error(ex);
        }
    }
}