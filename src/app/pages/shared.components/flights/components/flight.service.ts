import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { FlightModel } from './flight.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';
import {
    InvolvePartyModel,
    InvolvePartyService
} from '../../involveparties';

@Injectable()
export class FlightService {
    private _dataService: DataService<FlightModel>;

    constructor(private dataServiceFactory: DataServiceFactory,
        private involvePartyService: InvolvePartyService) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<FlightModel>('Flights', option);
    }

    GetAllFlights(): Observable<ResponseModel<FlightModel>> {
        return this._dataService.Query()
            .Expand('InvolvedParty($select=InvolvedPartyId,InvolvedPartyDesc)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllActiveFlights(): Observable<ResponseModel<FlightModel>> {
        return this._dataService.Query()
            .Select('FlightId', 'FlightNo', 'FlightTaleNumber', 'OriginCode',
            'DestinationCode', 'DepartureDate', 'ArrivalDate', 'LoadAndTrimInfo', 'CreatedBy', 'CreatedOn')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    CreateFlight(flightModel: FlightModel): Observable<FlightModel> {
        let flight: FlightModel;
        return this._dataService.Post(flightModel)
            .Execute()
            .map((data: FlightModel) => {
                flight = data;
                return data;
            })
            .flatMap((data: FlightModel) =>
                this.involvePartyService.Get(data.InvolvedPartyId)
            )
            .map((data: InvolvePartyModel) => {
                flight.InvolvedParty = data;
                return flight;
            });
    }

    EditFlight(flightModel: FlightModel): Observable<FlightModel> {
        let key: string = flightModel.FlightId.toString()
        return this._dataService.Patch(flightModel, key)
            .Execute();

    }

    GetFLightById(id: number): Observable<FlightModel> {
        return this._dataService.Get(id.toString())
            .Execute();
    }

    GetFlightByInvolvedPartyId(involvedPartyId: number): Observable<ResponseModel<FlightModel>> {
        return this._dataService.Query()
        .Filter(`InvolvedPartyId eq ${involvedPartyId}`)
        .Execute();
    }
}