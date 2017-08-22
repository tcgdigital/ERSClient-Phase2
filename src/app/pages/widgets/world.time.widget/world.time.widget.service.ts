import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { IncidentModel } from '../../incident/components/incident.model';
import { EmergencyLocationModel }
    from '../../masterdata/emergencylocation/components/emergencylocation.model';
import { ITimeZone } from '../../../shared/models/base.model';

import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService
} from '../../../shared';

@Injectable()
export class WorldTimeWidgetService {
    private _incidentService: DataService<IncidentModel>;
    private _emergencyLocationService: DataService<EmergencyLocationModel>;

    /**
     * Creates an instance of WorldTimeWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * @memberof WorldTimeWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._incidentService = this.dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);

        this._emergencyLocationService = this.dataServiceFactory
            .CreateServiceWithOptions<EmergencyLocationModel>('EmergencyLocations', option);
    }

    /**
     * Get Emergency Location by Incident Id
     * 
     * @param {number} incidentId 
     * @returns {Observable<EmergencyLocationModel>} 
     * @memberof WorldTimeWidgetService
     */
    public GetEmergencyLicationByIncidentId(incidentId: number): Observable<ITimeZone> {
        return this._incidentService.Get(incidentId.toString())
            .Execute()
            .flatMap((incident: IncidentModel) => {
                return this._emergencyLocationService.Query()
                    .Filter(`IATA eq '${incident.EmergencyLocation}' and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
                    .Execute()
            }).map((location: ResponseModel<EmergencyLocationModel>) => {
                return this.GetTimeZones(location.Records)[0];
            });
    }

    /**
     * Get all emergency locations
     * 
     * @returns {Observable<ITimeZone[]>} 
     * @memberof WorldTimeWidgetService
     */
    public GetEmergencyLications(): Observable<ITimeZone[]> {
        return this._emergencyLocationService.Query()
            .Filter(`ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Execute()
            .map((location: ResponseModel<EmergencyLocationModel>) => {
                let timeZones: ITimeZone[] = this.GetTimeZones(location.Records);
                if (timeZones.length > 0) {
                    return timeZones.sort((a: ITimeZone, b: ITimeZone) => {
                        return ((+a.decimaloffset < +b.decimaloffset) ? -1 
                            : ((+a.decimaloffset > +b.decimaloffset) ? 1 : 0));
                    });
                } else {
                    return new Array<ITimeZone>();
                }
            });
    }

    /**
     * Get timezone
     * 
     * @private
     * @param {EmergencyLocationModel[]} locations 
     * @returns {ITimeZone[]} 
     * @memberof WorldTimeWidgetService
     */
    private GetTimeZones(locations: EmergencyLocationModel[]): ITimeZone[] {
        return locations.map((x: EmergencyLocationModel) => {
            try {
                return {
                    abbr: x.IATA,
                    city: x.City,
                    country: x.Country,
                    zonename: (x.TimeZone == null || x.TimeZone == '') ? '(UTC) Greenwich, England' :
                        x.TimeZone.indexOf(x.City) > -1 ? x.TimeZone : `${x.TimeZone} - (${x.City})`,
                    utcoffset: (x.TimeZone == null || x.TimeZone == '' || !(/\(([^)]+)\)/gi.test(x.TimeZone))) ? '(UTC)' :
                        /\(([^)]+)\)/gi.exec(x.TimeZone)[1],
                    decimaloffset: (x.UTCOffset == null || x.UTCOffset == '') ? '0' :
                        Math.abs(+(x.UTCOffset)) > 3600000 ? (+(x.UTCOffset) / 3600000).toString() : '0'
                } as ITimeZone;
            } catch (ex) {
                console.log(ex);
            }
        });
    }
}