import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment/moment';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata';
import {
    ResponseModel
} from '../../../shared';
import {
    OrganizationModel,
    OrganizationService,
    AircraftTypeModel,
    AircraftTypeService
} from '../../shared.components';
import { EmergencyLocationService, EmergencyLocationModel } from '../../masterdata/emergencylocation';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { TimeZoneModel, ZoneIndicator, TimeZoneModels, TimeZoneService } from "../../shared.components/timezone";
import { Observable } from 'rxjs/Rx';
import { IncidentModel } from '../../incident/components/incident.model';
import { InvolvePartyModel } from '../../shared.components/involveparties/components/involveparty.model';
import { FlightModel } from '../../shared.components/flights/components/flight.model';
import { IncidentDataExchangeModel } from '../../incident/components/incidentDataExchange.model';
import { PresidentMessageModel } from '../../shared.components';
import { ReadOnlyIncidentWidgetService } from './readOnlyIncident.widget.service';
import {
    DataServiceFactory, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService, Severity
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'view-readOnly-incident-widget',
    templateUrl: './readOnlyIncident.widget.view.html',
    styleUrls: ['./readOnlyIncident.widget.style.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ReadOnlyIncidentWidgetService, OrganizationService, AircraftTypeService]
})
export class ReadOnlyIncidentWidgetComponent implements OnInit {
    @Input() currentIncidentLocal: KeyValue;
    @Input() useLink: boolean;
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    disableIsDrillPopup: boolean;
    severities: KeyValue[] = [];
    public IsDrillPopup: boolean;
    isFlightRelatedPopup: boolean = false;
    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    public incidentId: number;
    public incidentDate: Date;
    public formPopup: FormGroup;
    public EmergencyDateLocal: Date;
    public ReportedDateLocal: Date;
    public ScheduleDepartureLocal: Date;
    public ScheduleArrivalLocal: Date;
    public activeEmergencyTypes: EmergencyTypeModel[] = [];
    public BorrowedIncidentName: string;
    affectedStations: EmergencyLocationModel[] = [];

    constructor(
        private readOnlyIncidentWidgetService: ReadOnlyIncidentWidgetService,
        private organizationService: OrganizationService,
        private emergencyLocationService: EmergencyLocationService,
        private aircraftTypeService: AircraftTypeService,
        private timeZoneService: TimeZoneService,
        private emergencyTypeService: EmergencyTypeService) { }

    ngOnInit() {
        this.incidentId = 0;

        this.incidentDate = new Date();
        this.severities = UtilityService.GetKeyValues(Severity);
        this.getAllActiveOrganizations();
        this.getAllActiveEmergencyTypes();
        this.getAllActiveAircraftTypes();
        this.resetIncidentViewForm();


        this.emergencyLocationService.GetAllActiveEmergencyLocations()
        .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
            result.Records.forEach((item: EmergencyLocationModel) => {
                const emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
                emergencyLocationModel.IATA = item.IATA;
                emergencyLocationModel.AirportName = item.AirportName;
                emergencyLocationModel.Country = item.Country;
                emergencyLocationModel.TimeZone = item.TimeZone;
                emergencyLocationModel.UTCOffset = item.UTCOffset;
                this.affectedStations.push(emergencyLocationModel);
                this.affectedStations.sort(function (a, b) { return (a.AirportName.toUpperCase() > b.AirportName.toUpperCase()) ? 1 : ((b.AirportName.toUpperCase() > a.AirportName.toUpperCase()) ? -1 : 0); });
            });
        });
    }

    getAllActiveOrganizations(): void {
        this.organizationService.GetAllActiveOrganizations()
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                this.activeOrganizations = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllActiveAircraftTypes(): void {
        this.aircraftTypeService.GetAllActiveAircraftTypes()
            .subscribe((response: ResponseModel<AircraftTypeModel>) => {
                this.activeAircraftTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public onViewIncidentClick(): void {
        if(this.currentIncidentLocal.Value!=undefined){
            this.incidentId = this.currentIncidentLocal.Value;
        }
        else{
            this.incidentId = +this.currentIncidentLocal;
        }
        
        this.readOnlyIncidentWidgetService.GetIncidentByIncidentId(this.incidentId)
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
            });
    }

    public fetchBorrowedIncident(incidentId: number): void {
        this.readOnlyIncidentWidgetService.GetIncidentByIncidentId(incidentId)
            .subscribe((item: IncidentModel) => {
                this.BorrowedIncidentName = item.EmergencyName;
                this.loadDataIncidentViewPopup();
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

            let localDepartureDate:string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.DepartureDate);
            this.formPopup.get('ScheduleddeparturePopup').setValue(localDepartureDate);
            // this.GetLocalDateTime(new Date(this.incidentDataExchangeModel.FLightModel.DepartureDate), true,(dt:Date) => {
            //     let localDepartureArrivalDate:string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.DepartureDate);
            //     this.formPopup.get('ScheduleddeparturePopup').setValue(localDepartureArrivalDate);
            // });

            let localArrivalDate:string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDate);
            this.formPopup.get('ScheduledarrivalPopup').setValue(localArrivalDate);
            // this.GetLocalDateTime(new Date(this.incidentDataExchangeModel.FLightModel.ArrivalDate), false,(dt:Date) => {
            //     let localDepartureArrivalDate:string = this.DateFormat(this.incidentDataExchangeModel.FLightModel.ArrivalDate);
            //     this.formPopup.get('ScheduledarrivalPopup').setValue(localDepartureArrivalDate);
            // });


            
            this.GetLocalDateTime(new Date(this.incidentDataExchangeModel.FLightModel.DepartureDate), true,(dt:Date) => {
                let localDepartureArrivalDate:string = this.DateFormat(dt);
                this.formPopup.get('ScheduleddepartureLOCPopup').setValue(localDepartureArrivalDate);
            });
            this.GetLocalDateTime(new Date(this.incidentDataExchangeModel.FLightModel.ArrivalDate), false,(dt:Date) => {
                let localDepartureArrivalDate:string = this.DateFormat(dt);
                this.formPopup.get('ScheduledarrivalLOCPopup').setValue(localDepartureArrivalDate);
            });
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

        //let localDate = new Date(utc + this.GetUTCOffsetHours(isOrigin));

        //return localDate;
    }

    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAllActive()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
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
        // let mid = (hours > 12) ? 'PM' : 'AM';
        const months: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        // return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()} ${((date.getHours() % 12) < 10) ? ("0" + (date.getHours() % 12)) : (date.getHours() % 12)}:${((date.getMinutes()) < 10) ? ("0" + (date.getMinutes())) : (date.getMinutes())} ${mid}`;
        return `${new Date(date).getDate()}-${months[new Date(date).getMonth()]}-${new Date(date).getFullYear()} ${((new Date(date).getHours()) < 10) ? ("0" + (new Date(date).getHours())) : (new Date(date).getHours())}:${(new Date(date).getMinutes() < 10) ? ("0" + (new Date(date).getMinutes())) : (new Date(date).getMinutes())}`;
    }

}