import { BaseModel, ResponseModel, NameValue } from '../../models';
import { Observable } from 'rxjs/Rx';

export interface IServiceInretface<T extends BaseModel> {
    GetAll(): Observable<ResponseModel<T>>;

    Get(id: string|number): Observable<T>;

    Create(entity: T): Observable<T>;

    CreateBulk(entities: T[]): Observable<T[]>;

    Update(entity: T): Observable<T>;

    UpdateWithHeader(entity: T, header: NameValue<string>): Observable<T>;

    Delete(key: number, entity ?: T): void;
}