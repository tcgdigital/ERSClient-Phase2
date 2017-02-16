import { BaseModel } from './base.model';

export class ResponseModel<T extends BaseModel | any>{
    public Records: T[] | any[];
    public Count: number;
}