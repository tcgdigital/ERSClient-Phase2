import { Observable } from 'rxjs/Rx';
import { IServiceInretface, ResponseModel, EmergencySituation, TemplateMediaType } from '../../../shared';
import { UserDepartmentNotificationMapper, MessageTemplate, NotifyPeopleModel } from './notifypeople.model';
import { UserdepartmentNotificationMapperModel } from '../../shared.components';
import { DepartmentModel, TemplateModel } from '../../masterdata';
import { AppendedTemplateModel } from '../../masterdata/appendedtemplate';

export interface INotifyPeopleService extends IServiceInretface<UserDepartmentNotificationMapper> {

    GetUserDepartmentNotificationMapperByIncident(incidentId: number, callback?: ((_: UserdepartmentNotificationMapperModel[]) => void)): void;

    GetAllDepartmentMatrix(departmentId: number, incidentId: number, callback?: ((_: NotifyPeopleModel[]) => void)): void;

    FillDepartmentMatrix(allDepartments: ResponseModel<DepartmentModel>, initialparentDepartmentId: number): void;

    GetAllByIncident(incidentId: number): Observable<ResponseModel<UserDepartmentNotificationMapper>>;

    GetDepartmentUser(departmentIdProjection: string, incidentId: number, callback?: ((_: NotifyPeopleModel[]) => void)): void;

    FindIdRecursively(notifyPeopleModel: NotifyPeopleModel[], id: number): void;

    NotifyPeopleCall(checkedIds: number[], departmentId: number, incidentId: number,
        emargencySituation: EmergencySituation, mediaType: TemplateMediaType,
        callback?: ((_: TemplateModel) => void)): void;

    CreateAppendedTemplate(appendedTemplate: AppendedTemplateModel, incidentId: number,
        callback?: ((_: boolean) => void)): void

    NotifyTemplate(template: AppendedTemplateModel, incidentId: number,
        callback?: ((_: boolean) => void)): void

    GetGeneralNotificationMessageTemplate(): Observable<MessageTemplate>;
}