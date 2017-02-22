
export abstract class BaseModel {
    public ActiveFlag: string;
    public CreatedBy: number;
    public CreatedOn: Date;
    public UpdatedBy: number;
    public UpdatedOn: Date;
}

export enum WEB_METHOD {
    GET = <any>'GET',
    POST = <any>'POST',
    SIMPLEPOST = <any>'SIMPLEPOST',
    PUT = <any>'PUT',
    PATCH = <any>'PATCH',
    DELETE = <any>'DELETE',
    BATCHPOST = <any>'BATCHPOST'
}