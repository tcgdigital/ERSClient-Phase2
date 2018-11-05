import {
    Component, OnInit, Input, Output,
    ViewChild, ViewEncapsulation, EventEmitter, OnDestroy
} from '@angular/core';
import * as moment from 'moment/moment';
import * as _ from 'underscore';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata';
import {
    ResponseModel, GlobalConstants
} from '../../../shared';
import {
    OrganizationModel, OrganizationService,
    AircraftTypeModel, AircraftTypeService
} from '../../shared.components';
import { EmergencyLocationService, EmergencyLocationModel } from '../../masterdata/emergencylocation';
import { FormGroup, FormControl } from '@angular/forms';
import { ZoneIndicator, TimeZoneService } from "../../shared.components/timezone";
import { Observable, Subject } from 'rxjs/Rx';
import { IncidentModel } from '../../incident/components/incident.model';
import { InvolvePartyModel } from '../../shared.components/involveparties/components/involveparty.model';
import { FlightModel } from '../../shared.components/flights/components/flight.model';
import { IncidentDataExchangeModel } from '../../incident/components/incidentDataExchange.model';
import { ReadOnlyIncidentWidgetService } from './readOnlyIncident.widget.service';
import { KeyValue, UtilityService, Severity } from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'view-readOnly-incident-widget',
    templateUrl: './readOnlyIncident.widget.view.html',
    styleUrls: ['./readOnlyIncident.widget.style.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ReadOnlyIncidentWidgetService, OrganizationService, AircraftTypeService]
})
export class ReadOnlyIncidentWidgetComponent implements OnInit, OnDestroy {
    @Input() public currentIncidentLocal: KeyValue;
    @Input() public useLink: boolean;
    @Input() public loadOnInitialize: boolean = false;
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;

    @Output() ShowWindowEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() HideWindowEvent: EventEmitter<any> = new EventEmitter<any>();

    public incidentDataExchangeModel: IncidentDataExchangeModel = null;
    public disableIsDrillPopup: boolean;
    public IsDrillPopup: boolean;
    public isFlightRelatedPopup: boolean = false;
    public incidentId: number;
    public incidentDate: Date;
    public formPopup: FormGroup;
    public EmergencyDateLocal: Date;
    public ReportedDateLocal: Date;
    public ScheduleDepartureLocal: Date;
    public ScheduleArrivalLocal: Date;
    public BorrowedIncidentName: string;
    public isDataLoaded: boolean = false;

    public severities: KeyValue[] = new Array<KeyValue>();
    public activeEmergencyTypes: EmergencyTypeModel[] = new Array<EmergencyTypeModel>();
    public affectedStations: EmergencyLocationModel[] = new Array<EmergencyLocationModel>();
    public activeOrganizations: OrganizationModel[] = new Array<OrganizationModel>();
    public activeAircraftTypes: AircraftTypeModel[] = new Array<AircraftTypeModel>();
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(
        private readOnlyIncidentWidgetService: ReadOnlyIncidentWidgetService,
        private organizationService: OrganizationService,
        private emergencyLocationService: EmergencyLocationService,
        private aircraftTypeService: AircraftTypeService,
        private timeZoneService: TimeZoneService,
        private emergencyTypeService: EmergencyTypeService) { }

    public ngOnInit(): void {
        if (this.loadOnInitialize)
            this.Initialization(() => { this.isDataLoaded = true; });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public onViewIncidentClick(): void {
        if (this.currentIncidentLocal.Value != undefined)
            this.incidentId = this.currentIncidentLocal.Value;
        else
            this.incidentId = +this.currentIncidentLocal;

        if (!this.loadOnInitialize)
            this.Initialization(() => {
                if (this.incidentId == 0 && this.currentIncidentLocal.Value != undefined)
                    this.incidentId = this.currentIncidentLocal.Value;
                else
                    this.incidentId = +this.currentIncidentLocal;
                this.isDataLoaded = true;
                this.FetchIncident.call(this);
            });
        else
            this.FetchIncident();
    }

    public fetchBorrowedIncident(incidentId: number): void {
        this.readOnlyIncidentWidgetService.GetIncidentByIncidentId(incidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((item: IncidentModel) => {
                this.BorrowedIncidentName = item.EmergencyName;
                this.loadDataIncidentViewPopup();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public loadDataIncidentViewPopup(): void {
        const offsetVal: string = '';
        this.disableIsDrillPopup = true;
        this.EmergencyDateLocal = new Date(new Date(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).toLocaleString() + ' UTC');
        this.ReportedDateLocal = new Date(new Date(this.incidentDataExchangeModel.IncidentModel.ReportedDate).toLocaleString() + ' UTC');

        this.formPopup = new FormGroup({
            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            AffectedCountryPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyCountry),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY HH:mm')),
            EmergencyDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).utc().format('DD-MM-YYYY HH:mm')),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            WhatHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
            WhereHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
            OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
            SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
            ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
            ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
            ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
            SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
            ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MM-YYYY HH:mm')),
            ReportedDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).utc().format('DD-MM-YYYY HH:mm')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
            BorrowedIncidentPopup: new FormControl(this.BorrowedIncidentName),
        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;

        this.isFlightRelatedPopup = false;
        if (this.incidentDataExchangeModel.FLightModel.FlightNo !== 'DUMMY_FLIGHT') {

            this.ScheduleDepartureLocal = new Date(new Date(this.incidentDataExchangeModel.FLightModel.DepartureDate).toLocaleString() + ' UTC');
            this.ScheduleArrivalLocal = new Date(new Date(this.incidentDataExchangeModel.FLightModel.ArrivalDate).toLocaleString() + ' UTC');

            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                AffectedCountryPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyCountry),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY HH:mm')),
                EmergencyDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).utc().format('DD-MM-YYYY HH:mm')),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                WhatHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
                WhereHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
                OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
                SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
                ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
                ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
                ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
                SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
                ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MM-YYYY HH:mm')),
                ReportedDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).utc().format('DD-MM-YYYY HH:mm')),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                BorrowedIncidentPopup: new FormControl(this.BorrowedIncidentName),
                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('DD-MM-YYYY HH:mm')),
                ScheduleddepartureLOCPopup: new FormControl(''),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('DD-MM-YYYY HH:mm')),
                ScheduledarrivalLOCPopup: new FormControl(''),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber),
                AircraftTypeIdPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.AircraftTypeId)
            });

            let localDepartureDate: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.DepartureDate);
            this.formPopup.get('ScheduleddeparturePopup').setValue(localDepartureDate);

            let localArrivalDate: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDate);
            this.formPopup.get('ScheduledarrivalPopup').setValue(localArrivalDate);

            let localDepartureDateLoc: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.DepartureDateLocal);
            this.formPopup.get('ScheduleddepartureLOCPopup').setValue(localDepartureDateLoc);

            let localArrivalDateLoc: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDateLocal);
            this.formPopup.get('ScheduledarrivalLOCPopup').setValue(localArrivalDateLoc);

            let manila: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDateLocal);
            this.formPopup.get('ReportedDatePopup').setValue(manila);

            let reportedUtc: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDateLocal);
            this.formPopup.get('ReportedDateLocalPopup').setValue(reportedUtc);

            let dateLOC: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDateLocal);
            this.formPopup.get('EmergencyDatePopup').setValue(dateLOC);

            let dateUTC: string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDateLocal);
            this.formPopup.get('EmergencyDateLocalPopup').setValue(dateUTC);

            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
        }
        this.childModalViewIncident.show();
    }

    public hideIncidentView(): void {
        this.childModalViewIncident.hide();
    }

    public GetUTCOffsetHours(isOrigin: boolean): string {
        let originOrDestinationIATA: string = '';
        let UTC_TimeZone: string = '';
        let UTC_OffsetNumber: number = 0.0;
        let isNegative: boolean = false;
        if (isOrigin) {
            originOrDestinationIATA = this.incidentDataExchangeModel.FLightModel.OriginCode;
        }
        else {
            originOrDestinationIATA = this.incidentDataExchangeModel.FLightModel.DestinationCode;
        }
        UTC_TimeZone = this.affectedStations.find((item: EmergencyLocationModel) =>
            item.IATA == originOrDestinationIATA
        ).TimeZone;
        return UTC_TimeZone;
    }

    private GetLocalDateTime(utc: Date, isOrigin: boolean, callback?: ((_: Date) => void)): void {
        let timeZone: string = this.GetUTCOffsetHours(isOrigin);
        let zi = new ZoneIndicator();
        zi.Year = utc.getFullYear().toString();
        zi.Month = (utc.getMonth() + 1).toString();
        zi.Day = utc.getDate().toString();
        zi.Hour = utc.getHours().toString();
        zi.Minute = utc.getMinutes().toString();
        zi.Second = utc.getSeconds().toString();
        zi.CurrentTime = new Date();
        zi.ZoneName = timeZone;
        let localDate = new Date();

        this.timeZoneService.GetLocalTime(zi)
            .subscribe((result: ZoneIndicator) => {
                localDate = new Date(result.CurrentTime);

                if (callback)
                    callback(localDate);
            });
    }

    resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            OrganizationIdPopup: new FormControl(''),
            EmergencyTypeIdPopup: new FormControl('0'),
            AffectedStationIdPopup: new FormControl('0'),
            AffectedCountryPopup: new FormControl(''),
            EmergencyDatePopup: new FormControl(''),
            EmergencyDateLocalPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
            DescriptionPopup: new FormControl(''),
            WhatHappendPopup: new FormControl(''),
            WhereHappendPopup: new FormControl(''),
            OtherConfirmationInformationPopup: new FormControl(''),
            SourceInformationPopup: new FormControl(''),
            ReportedByNamePopup: new FormControl(''),
            ReportedByAddressPopup: new FormControl(''),
            ContactOfWitnessPopup: new FormControl(''),
            SenderOfCrisisInformationPopup: new FormControl(''),
            ReportedDatePopup: new FormControl(''),
            ReportedDateLocalPopup: new FormControl(''),
            SeverityPopup: new FormControl('0'),
            BorrowedIncidentPopup: new FormControl(''),
            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduleddepartureLOCPopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            ScheduledarrivalLOCPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl(''),
            AircraftTypeIdPopup: new FormControl(''),
        });
        this.IsDrillPopup = false;
    }

    private DateFormat(date: Date): string {
        let hours = new Date(date).getHours();
        const months: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return `${new Date(date).getDate()}-${months[new Date(date).getMonth()]}-${new Date(date).getFullYear()} ${((new Date(date).getHours()) < 10) ?
            ("0" + (new Date(date).getHours())) : (new Date(date).getHours())}:${(new Date(date).getMinutes() < 10) ?
                ("0" + (new Date(date).getMinutes())) : (new Date(date).getMinutes())}`;
    }

    private Initialization(callback: () => void = null): void {
        this.incidentId = 0;
        this.incidentDate = new Date();
        this.severities = UtilityService.GetKeyValues(Severity);
        this.resetIncidentViewForm();

        let observables: Array<Observable<ResponseModel<any>>> = new Array<Observable<ResponseModel<any>>>();
        observables.push(this.organizationService.GetAllActiveOrganizations());
        observables.push(this.emergencyTypeService.GetAllActive());
        observables.push(this.aircraftTypeService.GetAllActiveAircraftTypes());
        observables.push(this.emergencyLocationService.GetAllActiveEmergencyLocations());

        Observable.forkJoin(observables)
            //.debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<any>[]) => {
                if (response && response.length > 0) {
                    this.activeOrganizations = _.isEmpty(response[0].Records) ?
                        new Array<OrganizationModel>() : response[0].Records as OrganizationModel[];

                    this.activeEmergencyTypes = _.isEmpty(response[1].Records) ?
                        new Array<EmergencyTypeModel>() : response[1].Records as EmergencyTypeModel[];

                    this.activeAircraftTypes = _.isEmpty(response[2].Records) ?
                        new Array<AircraftTypeModel>() : response[2].Records as AircraftTypeModel[];

                    this.affectedStations = _.isEmpty(response[3].Records) ?
                        new Array<EmergencyLocationModel>() :
                        (response[3].Records as EmergencyLocationModel[])
                            .sort((a: EmergencyLocationModel, b: EmergencyLocationModel) => {
                                return (a.AirportName.toUpperCase() > b.AirportName.toUpperCase()) ? 1 :
                                    ((b.AirportName.toUpperCase() > a.AirportName.toUpperCase()) ? -1 : 0);
                            });

                    if (callback != null)
                        callback();
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private FetchIncident(): void {
        this.readOnlyIncidentWidgetService.GetIncidentByIncidentId(this.incidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((item: IncidentModel) => {
                this.incidentDataExchangeModel = new IncidentDataExchangeModel();
                this.incidentDataExchangeModel.IsFlightRelated = false;
                this.incidentDataExchangeModel.IncidentModel = new IncidentModel();
                this.incidentDataExchangeModel.IncidentModel = item;

                if (item.InvolvedParties.length > 0) {
                    this.incidentDataExchangeModel.InvolvedPartyModel = new InvolvePartyModel();
                    this.incidentDataExchangeModel.InvolvedPartyModel = item.InvolvedParties[0];
                    if (item.InvolvedParties[0].Flights.length > 0) {
                        this.incidentDataExchangeModel.IsFlightRelated = true;
                        this.incidentDataExchangeModel.FLightModel = new FlightModel();
                        this.incidentDataExchangeModel.FLightModel = item.InvolvedParties[0].Flights[0];
                    }
                }
                if (this.incidentDataExchangeModel.IncidentModel.BorrowedIncident != null) {
                    this.fetchBorrowedIncident(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident);
                }
                else {
                    this.loadDataIncidentViewPopup();
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }
}