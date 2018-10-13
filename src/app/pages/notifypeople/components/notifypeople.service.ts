import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { UserPermissionModel, UserPermissionService } from "../../masterdata/userpermission";
import {
    NotifyPeopleModel, NotificationContactsWithTemplateModel,
    UserDepartmentNotificationMapper, MessageTemplate
} from "./notifypeople.model";
import {
    AppendedTemplateModel,
    AppendedTemplateService
} from "../../masterdata/appendedtemplate";

import { INotifyPeopleService } from './INotifyPeopleService';
import {
    ResponseModel, DataService, DataServiceFactory, DataProcessingService,
    ServiceBase, GlobalConstants, UtilityService, IEmergencySituationEnum, IKeyValue, EmergencySituation, TemplateMediaType
} from '../../../shared';
import {
    UserdepartmentNotificationMapperModel, UserdepartmentNotificationMapperService
} from "../../shared.components/userdepartmentnotificationmapper";
import { TemplateModel, TemplateService } from "../../masterdata/template";
import { IncidentModel, IncidentService } from "../../incident";
import { DepartmentModel, DepartmentService } from "../../masterdata/department";

@Injectable()
export class NotifyPeopleService extends ServiceBase<UserdepartmentNotificationMapperModel> implements INotifyPeopleService {

    public allDepartmentUserPermission: NotifyPeopleModel[] = [];
    public arrayMatrix: any[];
    public departmentArray: number[];
    public departmentIdProjection: string;
    public allDepartments: ResponseModel<DepartmentModel>;
    public notifyPeopleModel: NotifyPeopleModel;
    public notifyPeopleModels: NotifyPeopleModel[];
    public currentIncident: IncidentModel;
    public currentDepartment: DepartmentModel;
    public notificationContactsWithTemplate: NotificationContactsWithTemplateModel;
    public notificationContactsWithTemplates: NotificationContactsWithTemplateModel[];
    public userDepartmentNotificationMappers: UserdepartmentNotificationMapperModel[];

    private _externalNotification: DataService<any>;
    private _bulkDataService: DataService<NotificationContactsWithTemplateModel>;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private dataServiceFactory: DataServiceFactory,
        private userPermissionService: UserPermissionService,
        private templateService: TemplateService,
        private incidentService: IncidentService,
        private departmentService: DepartmentService,
        private appendedTemplateService: AppendedTemplateService,
        private userdepartmentNotificationMapperService: UserdepartmentNotificationMapperService) {
        super(dataServiceFactory, 'NotifyDepartmentUsers');

        const option: DataProcessingService = new DataProcessingService();

        this.arrayMatrix = [];
        this.departmentArray = [];
        this.departmentIdProjection = '';
        this.notificationContactsWithTemplates = [];
        this.userDepartmentNotificationMappers = [];

        this._externalNotification = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<UserPermissionModel>
            ('ExternalNotification', 'GetGeneralNotificationMessageTemplate', option);
    }

    public GetUserDepartmentNotificationMapperByIncident(incidentId: number,
        callback?: ((_: UserdepartmentNotificationMapperModel[]) => void)): void {
        this.userdepartmentNotificationMapperService.GetUserDepartmentNotificationMapperFromIncident(incidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<UserdepartmentNotificationMapperModel>) => {
                response.Records.forEach((item: UserdepartmentNotificationMapperModel) => {
                    this.userDepartmentNotificationMappers.push(item);
                });
                if (callback) {
                    callback(this.userDepartmentNotificationMappers);
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public GetAllDepartmentMatrix(departmentId: number, incidentId: number,
        callback?: ((_: NotifyPeopleModel[]) => void)): void {
        this.userPermissionService.GetAllDepartmentMatrix()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((departments: ResponseModel<DepartmentModel>) => {
                this.departmentIdProjection = '';
                this.arrayMatrix = [];
                this.departmentArray = [];
                this.FillDepartmentMatrix(departments, departmentId);
                this.arrayMatrix.forEach((item: number, index: number) => {
                    this.departmentArray.push(item[0]);
                    if (index == 0) {
                        this.departmentIdProjection = `DepartmentId eq ${item[0]}`;
                    }
                    else {
                        this.departmentIdProjection = this.departmentIdProjection + ` or DepartmentId eq ${item[0]}`;
                    }
                });
                this.GetDepartmentUser(this.departmentIdProjection, incidentId, (item: NotifyPeopleModel[]) => {
                    if (callback) {
                        callback(item);
                    }
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public FillDepartmentMatrix(allDepartments: ResponseModel<DepartmentModel>,
        initialparentDepartmentId: number): void {
        let AllSubDepartmentModels: DepartmentModel[] = allDepartments.Records.filter((item: DepartmentModel) => {
            return item.ParentDepartmentId == initialparentDepartmentId;
        });
        let array: number[] = [];
        array.push(initialparentDepartmentId);

        //let count: number = 0;
        AllSubDepartmentModels.forEach((item: DepartmentModel, index: number) => {
            //count++;
            array.push(item.DepartmentId);
        });
        this.arrayMatrix.push(array);
        for (let i: number = 1; i < array.length; i++) {
            this.FillDepartmentMatrix(allDepartments, array[i]);
        }
    }

    public GetAllByIncident(incidentId: number):
        Observable<ResponseModel<UserDepartmentNotificationMapper>> {
        return this._dataService.Query()
            .Select('Department, UserDepartmentNotificationMapperId')
            .Expand('Department($select=DepartmentId, DepartmentName)')
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }

    public GetDepartmentUser(departmentIdProjection: string, incidentId: number,
        callback?: ((_: NotifyPeopleModel[]) => void)): void {
        this.allDepartmentUserPermission = [];
        let count: number = 1;

        this.userPermissionService.GetAllDepartmentsFromDepartmentIdProjection(departmentIdProjection)
            .map((item: ResponseModel<DepartmentModel>) => {
                this.allDepartments = item;
            })
            .flatMap((result) => this.userPermissionService.GetAllDepartmentUsersFromDepartmentIdProjection(departmentIdProjection))
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((userPermissions: ResponseModel<UserPermissionModel>) => {

                this.GetUserDepartmentNotificationMapperByIncident(incidentId,
                    (resultUserdepartmentNotificationMapper: UserdepartmentNotificationMapperModel[]) => {
                        count = 1;
                        this.departmentArray.forEach((itemDepartmentId: number, index: number) => {

                            let userPermissionsLocal: UserPermissionModel[] = userPermissions.Records.filter((item: UserPermissionModel) => {
                                return item.DepartmentId == itemDepartmentId;
                            });
                            let notifyModel: NotifyPeopleModel = new NotifyPeopleModel();
                            notifyModel.id = count;
                            let departmentLocal = this.allDepartments.Records.filter((item: DepartmentModel) => {
                                return item.DepartmentId == itemDepartmentId;
                            });

                            notifyModel.text = departmentLocal[0].DepartmentName;
                            notifyModel.population = '';
                            notifyModel.checked = false;
                            notifyModel.DepartmentId = departmentLocal[0].DepartmentId;
                            notifyModel.children = [];

                            userPermissionsLocal.forEach((eachUserPermission: UserPermissionModel, index: number) => {
                                let notifyModelInner: NotifyPeopleModel = new NotifyPeopleModel();
                                count = count + 1;

                                notifyModelInner.id = count;
                                notifyModelInner.text = ''; //eachUserPermission.User.Email;
                                notifyModelInner.population = '';

                                if (eachUserPermission.IsHod) {
                                    notifyModelInner.population = 'true';
                                }

                                notifyModelInner.checked = false;
                                let filterItems = resultUserdepartmentNotificationMapper
                                    .filter((itemFind: UserdepartmentNotificationMapperModel) => {
                                        return (itemFind.UserId == eachUserPermission.User.UserProfileId
                                            && itemFind.DepartmentId == departmentLocal[0].DepartmentId);
                                    });

                                if (filterItems.length > 0) {
                                    notifyModelInner.checked = true;
                                }

                                notifyModelInner.User = eachUserPermission.User;
                                notifyModelInner.DepartmentId = departmentLocal[0].DepartmentId;
                                notifyModelInner.children = [];
                                notifyModel.children.push(notifyModelInner);
                            });

                            this.allDepartmentUserPermission.push(notifyModel);
                            count++;
                        });

                        if (callback) {
                            callback(this.allDepartmentUserPermission);
                        }
                    });

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public FindIdRecursively(notifyPeopleModel: NotifyPeopleModel[], id: number): void {
        notifyPeopleModel.forEach((item: NotifyPeopleModel) => {
            if (item.id == id) {
                if (item.text.indexOf('@') > -1) {
                    this.notifyPeopleModel = item;
                    this.notifyPeopleModels.push(this.notifyPeopleModel);
                }
            }
            else {
                if (item.children !== undefined) {
                    if (item.children.length > 0) {
                        this.FindIdRecursively(item.children, id);
                    }
                }
            }
        });

    }

    public NotifyPeopleCall(checkedIds: number[], departmentId: number,
        incidentId: number, emargencySituation: EmergencySituation, mediaType: TemplateMediaType,
        callback?: ((_: TemplateModel) => void)): void {

        this.notifyPeopleModels = [];
        var currentIncidentModel: IncidentModel = new IncidentModel();

        checkedIds.forEach((itemId: number) => {
            this.FindIdRecursively(this.allDepartmentUserPermission, itemId);
        });

        this.incidentService.Get(incidentId)
            .map((incidentResponse: IncidentModel) => {
                this.currentIncident = new IncidentModel();
                this.currentIncident.IncidentId = incidentResponse.IncidentId;
                this.currentIncident.EmergencyName = incidentResponse.EmergencyName;
                currentIncidentModel = incidentResponse;
            })
            .flatMap(() => this.departmentService.Get(departmentId))
            .map((departmentResponse: DepartmentModel) => {
                this.currentDepartment = departmentResponse;
            })
            .flatMap(() => this.templateService.GetByEmergencySituationId(+emargencySituation))
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<TemplateModel>) => {
                let template: TemplateModel = result.Records.find((item: TemplateModel) => {
                    return item.TemplateMediaId.toString() == TemplateMediaType[mediaType].toString();
                });
                if (template) {
                    let subject: string = template.Subject;
                    let description: string = template.Description;

                    if (this.currentIncident.IsDrill) {
                        description = description.replace('{{IS_DRILL}}', 'drill');
                    }
                    else {
                        description = description.replace('{{IS_DRILL}}', '');
                    }
                    description = description.replace('(space)', ' ');
                    description = description.replace('(space)', ' ');
                    description = description.replace('{{EMERGENCY_ID}}', `${currentIncidentModel.IncidentId}`);
                    description = description.replace('{{EMERGENCY_NAME}}', `${currentIncidentModel.EmergencyName}`);

                    subject = subject.replace('{{EMERGENCY_NAME}}', `${currentIncidentModel.EmergencyName}`);
                    template.Description = description;
                    template.Subject = subject;

                    if (callback) {
                        callback(template);
                    }
                }

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public CreateAppendedTemplate(appendedTemplate: AppendedTemplateModel,
        incidentId: number, callback?: ((_: boolean) => void)): void {
        debugger;
        delete appendedTemplate.Active;
        this.appendedTemplateService.CreateAppendedTemplate(appendedTemplate)
            .subscribe((appendedTemplate: AppendedTemplateModel) => {
                this.NotifyTemplate(appendedTemplate, incidentId, callback);

                /*
                this.notificationContactsWithTemplates = [];

                this.notifyPeopleModels.forEach((item: NotifyPeopleModel, index: number) => {
                    let notificationContactsWithTemplate: NotificationContactsWithTemplateModel = new NotificationContactsWithTemplateModel();
                    notificationContactsWithTemplate.UserId = item.User.UserProfileId;
                    notificationContactsWithTemplate.IsActive = true;
                    notificationContactsWithTemplate.IncidentId = incidentId;
                    notificationContactsWithTemplate.DepartmentId = item.DepartmentId;
                    notificationContactsWithTemplate.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                    notificationContactsWithTemplate.UserName = item.User.Name;
                    notificationContactsWithTemplate.SituationId = GlobalConstants.EmergencySituationEnum
                        .find(x => x.EmergencySituationId === appendedTemplate.EmergencySituationId).enumtype;
                    notificationContactsWithTemplate.AttachmentSingle = '';
                    notificationContactsWithTemplate.ContactNumber = item.User.MainContact;
                    notificationContactsWithTemplate.AlternetContactNumber = item.User.AlternateContact;
                    notificationContactsWithTemplate.EmailId = item.User.Email;
                    notificationContactsWithTemplate.Message = appendedTemplate.Description;
                    this.notificationContactsWithTemplates.push(notificationContactsWithTemplate);
                });

                this.CreateBulkInsert(incidentId, this.notificationContactsWithTemplates)
                    .subscribe((response: NotificationContactsWithTemplateModel[]) => {
                        if (callback) {
                            callback(true);
                        }
                    }, (error: any) => {
                        if (callback) {
                            callback(false);
                        }
                        console.log(`Error: ${error.message}`);
                    });
                */

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public NotifyTemplate(template: AppendedTemplateModel, incidentId: number,
        callback?: ((_: boolean) => void)): void {
        debugger;
        this.notificationContactsWithTemplates = [];

        this.notifyPeopleModels.forEach((item: NotifyPeopleModel, index: number) => {
            let notificationContactsWithTemplate: NotificationContactsWithTemplateModel = new NotificationContactsWithTemplateModel();
            notificationContactsWithTemplate.UserId = item.User.UserProfileId;
            notificationContactsWithTemplate.IsActive = true;
            notificationContactsWithTemplate.IncidentId = incidentId;
            notificationContactsWithTemplate.DepartmentId = item.DepartmentId;
            notificationContactsWithTemplate.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
            notificationContactsWithTemplate.UserName = item.User.Name;
            notificationContactsWithTemplate.SituationId = GlobalConstants.EmergencySituationEnum
                .find(x => x.EmergencySituationId === template.EmergencySituationId).enumtype;
            notificationContactsWithTemplate.AttachmentSingle = '';
            notificationContactsWithTemplate.ContactNumber = item.User.MainContact;
            notificationContactsWithTemplate.AlternetContactNumber = item.User.AlternateContact;
            notificationContactsWithTemplate.EmailId = item.User.Email;
            notificationContactsWithTemplate.Message = template.Description;
            this.notificationContactsWithTemplates.push(notificationContactsWithTemplate);
        });

        this.CreateBulkInsert(incidentId, this.notificationContactsWithTemplates)
            .subscribe((response: NotificationContactsWithTemplateModel[]) => {
                if (callback) {
                    callback(true);
                }
            }, (error: any) => {
                if (callback) {
                    callback(false);
                }
                console.log(`Error: ${error.message}`);
            });
    }

    public GetGeneralNotificationMessageTemplate(): Observable<MessageTemplate> {
        return this._externalNotification.SimpleGet()
            .Execute().map((resp) => {
                return <MessageTemplate>resp;
            });
    }

    CreateBulkInsert(incidentId: number, entities: NotificationContactsWithTemplateModel[]):
        Observable<NotificationContactsWithTemplateModel[]> {
        let option: DataProcessingService = new DataProcessingService();

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<NotificationContactsWithTemplateModel>
            ('UserDepartmentNotificationMapperBatch', `InsertUserDepartmentNotificationMapperBulk/${incidentId}`, option);

        return this._bulkDataService.BulkPost(entities).Execute();
    }
}