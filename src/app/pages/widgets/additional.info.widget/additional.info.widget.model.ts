export class AdditionalInfoModel {
    IncidentId: number;
    EmergencyLocation: string;
    WhereHappend: string;
    FlightNo: string;
    FlightTaleNumber: string;
    OriginCode: string;
    DestinationCode: string;
    EmergencyCategory:string;
    DepartureDate: Date;
    ArrivalDate: Date;


    constructor() {
        this.IncidentId = 0;
        this.EmergencyLocation = '';
        this.WhereHappend = '';
        this.FlightNo = '';
        this.FlightTaleNumber = '';
        this.OriginCode = '';
        this.DestinationCode = '';
        this.EmergencyCategory='';
        this.DepartureDate = new Date();
        this.ArrivalDate  = new Date();
    }
}