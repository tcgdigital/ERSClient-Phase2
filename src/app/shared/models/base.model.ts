
export abstract class BaseModel {
    public ActiveFlag: string;
    public CreatedBy: number;
    public CreatedOn: Date;
    public UpdatedBy?: number;
    public UpdatedOn?: Date;

    constructor() {
        this.ActiveFlag = 'Active';
        this.CreatedBy = 1;
        this.CreatedOn = new Date();

    }

    public deleteAttributes() {
        delete this.ActiveFlag;
        delete this.CreatedBy;
        delete this.CreatedOn;
    }
}

export enum WEB_METHOD {
    GET = <any>'GET',
    POST = <any>'POST',
    SIMPLEPOST = <any>'SIMPLEPOST',
    PUT = <any>'PUT',
    PATCH = <any>'PATCH',
    DELETE = <any>'DELETE',
    BATCHPOST = <any>'BATCHPOST',
    COUNT = <any>'COUNT'
}

export class KeyValue {
    constructor(public Key: string, public Value: number) { }
}

export class NameValue<T>{
    constructor(public Name: string, public Value: T) { }
}

export class KeyVal {
    constructor(public Key: string, public Value: string) { }
}

export class IncidentStatus {
    static Open: number = 1;
    static Close: number = 0;
}

export class Severity {
    static High: number = 1;
    static Medium: number = 2;
    static Low: number = 3;
}

export class InvolvedPartyType {
    static Flight: number = 1;
    static NonFlight: number = 2;
}

export class FileData {
    file: File;
    field: string;
}

export class Location {
    constructor(public latitude: number, public longitude: number) { }
}

export class AuthModel {
    public UserName: string;
    public UserId: string;
    public ClientId: string;
    public RequestedFrom: string;
    public aud: string;
    public exp: number;
    public iss: string;
    public nbf: number;
}

export class AccountResponse {
    public Code: number;
    public Message: string;
    public Data: any;
    public Url: string;
}

export class LicenseVerificationResponse {
    public Code: number;
    public Description: string;
}

export class LicenseInformationModel {
    public ClientCode: string;
    public ClientName: string;
    public MaxUsers: number;
    public EndingMonth: number;
    public EndingYear: number;
    public MacAddress: string;
    public Key: string;
    public IsValid: boolean;
}

export interface ITimeZone {
    abbr: string;
    city: string;
    country: string;
    zonename: string;
    utcoffset: string;
    decimaloffset: string;
}