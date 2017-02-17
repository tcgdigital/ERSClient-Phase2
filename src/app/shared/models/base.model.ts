
export abstract class BaseModel {
    public ActiveFlag: string;
    public CreatedBy: string;
    public CreatedOn: string;
    public UpdatedBy: string;
    public UpdatedOn: string;
}

export enum WEB_METHOD {
    GET = <any>'GET',
    POST = <any>'POST',
    PUT = <any>'PUT',
    PATCH = <any>'PATCH',
    DELETE = <any>'DELETE',
    BATCHPOST = <any>'BATCHPOST'
}