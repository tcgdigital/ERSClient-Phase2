import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IncidentModel } from '../incident';
import { LocationService, Location } from '../../shared';

@Component({
    selector: 'incident-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/incident.html',
    styles: [`
        .sebm-google-map-container{
            height:275px;
        }
    `]
})
export class IncidentComponent implements OnInit {
    incident: IncidentModel;
    lat: number = 51.678418;
    lng: number = 7.809007;
    zoom: number = 8;

    location: Location;

    constructor(private locationService: LocationService) {

    }

    ngOnInit(): any {
        // this.locationService.GetLocation('Kolkata')
        //     .subscribe((loc: Location) => this.location = loc);
    }

    ngOnDestroy(): void {

    }
}