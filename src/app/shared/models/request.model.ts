import {  BaseModel, WEB_METHOD } from './base.model';
import { WEBREQUEST } from '../constants';

export class RequestModel<T extends BaseModel>{
    Url: string;
    Method: WEB_METHOD;
    Entity: T
}