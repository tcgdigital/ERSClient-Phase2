import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { DepartmentClosureService } from '../department.closure/components/department.closure.service';
import { DepartmentClosureModel } from '../department.closure';
import { IncidentService } from '../incident/components/incident.service';
import { IncidentModel } from '../incident/components/incident.model';
import { DepartmentService } from '../masterdata/department/components/department.service';
import { DepartmentModel } from '../masterdata/department';
import { EmergencyTypeDepartmentService } from '../masterdata/emergency.department/components/emergency.department.service';
import { EmergencyDepartmentModel } from '../masterdata/emergency.department';
import { NotifyPeopleService } from '../notifypeople/components/notifypeople.service';
import { ActionableService } from '../shared.components/actionables/components/actionable.service';
import { DemandService } from '../shared.components/demand/components/demand.service';
import { UserDepartmentNotificationMapper, NotificationContactsWithTemplateModel } from '../notifypeople';
import { ActionableModel, DemandModel } from '../shared.components';
import { UtilityService, ResponseModel, BaseModel, GlobalStateService, KeyValue, AuthModel, GlobalConstants } from '../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { ReportPath } from './components/emergency.closure.model';
import { EmergencyClosureService } from './components/emergency.closure.service';
import { UserPermissionService } from '../masterdata/userpermission/components/userpermission.service';
import { UserPermissionModel } from '../masterdata/userpermission';
import { AuthenticationService } from '../login/components/authentication.service';
import { Router } from '@angular/router';

@Component({
	selector: 'emergency-closure',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './views/emergency.closure.view.html',
	styleUrls: ['./styles/emergency.closure.style.scss']
})
export class EmergencyClosureComponent implements OnInit {
	@ViewChild('childModal') public childModal: ModalDirective;

	public currentIncident: number;
	public currentDepartmentId: number;
	public incident: IncidentModel = new IncidentModel();
	public departmnetsToNotify: DepartmentModel[] = [];
	public departmentClosures: DepartmentClosureModel[] = [];
	public closuresToShow: DepartmentClosureModel[] = [];
	public actionable: ActionableModel[] = [];
	public demands: DemandModel[] = [];
	public initialNotificationSend: number[] = [];
	public notificationSeperatelySend: number[] = [];
	public report: string = "";
	public remarks: string = "";
	public credential: AuthModel;
	public reportPath: ReportPath;
	public UserDepartmentNotificationMappers: NotificationContactsWithTemplateModel[];
	public isShowPage: boolean = true;
	public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	/**
	 * Creates an instance of EmergencyClosureComponent.
	 * @param {DepartmentClosureService} departmentClosureService 
	 * @param {IncidentService} incidentService 
	 * @param {DepartmentService} departmentService 
	 * @param {EmergencyTypeDepartmentService} emergencyTypeDepartmentService 
	 * @param {NotifyPeopleService} notifyService 
	 * @param {ActionableService} actionableService 
	 * @param {DemandService} demandService 
	 * @param {GlobalStateService} globalState 
	 * @param {ToastrService} toastrService 
	 * @param {ToastrConfig} toastrConfig 
	 * @param {EmergencyClosureService} emergencyClosureService 
	 * @param {UserPermissionService} userPermissionService 
	 * @param {AuthenticationService} authService 
	 * @param {Router} router 
	 * @memberof EmergencyClosureComponent
	 */
	constructor(private departmentClosureService: DepartmentClosureService,
		private incidentService: IncidentService,
		private departmentService: DepartmentService,
		private emergencyTypeDepartmentService: EmergencyTypeDepartmentService,
		private notifyService: NotifyPeopleService,
		private actionableService: ActionableService,
		private demandService: DemandService,
		private globalState: GlobalStateService,
		private toastrService: ToastrService,
		private toastrConfig: ToastrConfig,
		private emergencyClosureService: EmergencyClosureService,
		private userPermissionService: UserPermissionService,
		private authService: AuthenticationService,
		private router: Router) {
		this.incident.deleteAttributes();
	}

	ngOnInit(): void {
		this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
		this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");

		if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'CloseEmergency'))
			this.GetIncident(this.currentIncident);

		this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
			(model: KeyValue) => this.incidentChangeHandler(model));

		this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
			(model: KeyValue) => this.departmentChangeHandler(model));
		this.credential = UtilityService.getCredentialDetails();
	}

	incidentChangeHandler(incident: KeyValue): void {
		this.currentIncident = incident.Value;
		this.closuresToShow = [];
		this.departmnetsToNotify = [];
		this.departmentClosures = [];
		this.actionable = [];
		this.demands = [];
		this.initialNotificationSend = [];
		this.notificationSeperatelySend = [];
		this.GetIncident(this.currentIncident);
	}

	ngOnDestroy(): void {
		// this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
		// this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChange);
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	GetIncident(incidentId: number): void {
		this.incidentService.GetIncidentById(incidentId)
			.takeUntil(this.ngUnsubscribe)
			.subscribe((response: IncidentModel) => {
				this.incident = response;
				this.getAllDepartmentsToNotify();
			}, (error: any) => {
				console.log(`Error: ${error.message}`);
			});
	}

	getAllDepartmentsToNotify(): void {
		let allActiveDepartments: Observable<DepartmentModel[]> = this.departmentService
			.GetDepartmentNameIds().map(x => x.Records);

		let emergencyDepartments: Observable<EmergencyDepartmentModel[]> = this.emergencyTypeDepartmentService
			.GetFilterByEmergencyTypeDepartmentId(this.incident.EmergencyTypeId).map(x => x.Records);

		let notifyDeptUsers: Observable<UserDepartmentNotificationMapper[]> = this.notifyService
			.GetAllByIncident(this.currentIncident).map(x => x.Records);

		let departmentClosures: Observable<DepartmentClosureModel[]> = this.departmentClosureService
			.GetAllByIncident(this.currentIncident).map(x => x.Records);

		Observable.merge(allActiveDepartments, emergencyDepartments, notifyDeptUsers, departmentClosures)
			.flatMap((x: BaseModel[]) => x)
			.takeUntil(this.ngUnsubscribe)
			.subscribe((response: any) => {
				if (Object.keys(response).some((x) => x === 'Department')) {
					this.departmnetsToNotify.push(<DepartmentModel>response["Department"]);

					if (Object.keys(response).some((x) => x === 'EmergencyTypeDepartmentId')) {
						let y = <EmergencyDepartmentModel>response;
						this.initialNotificationSend.push(y.Department.DepartmentId);
					}
					if (Object.keys(response).some((x) => x === 'UserDepartmentNotificationMapperId')) {
						let y = <UserDepartmentNotificationMapper>response;
						this.notificationSeperatelySend.push(y.Department.DepartmentId);
					}
				}
				else if (Object.keys(response).some((x) => x === 'DepartmentId')) {
					this.departmnetsToNotify.push(<DepartmentModel>response);
				}
				else if (Object.keys(response).some((x) => x === 'DepartmentClosureId')) {
					this.departmentClosures.push(<DepartmentClosureModel>response);
				}
			}, (error) => { console.log(`Error: ${error.message}`); }, () => {
				let unique: DepartmentModel[] = [];
				let departmentIds: number[] = [];

				Observable.from(this.departmnetsToNotify).distinct(function (x) { return x.DepartmentId; })
					.subscribe((x) => {
						unique.push(x);
						departmentIds.push(x.DepartmentId);
					});

				let allActionables: Observable<ActionableModel[]> = this.actionableService
					.BatchGet(this.currentIncident, departmentIds).map(x => x.Records);

				let allDemands: Observable<DemandModel[]> = this.demandService
					.BatchGet(this.currentIncident, departmentIds).map(x => x.Records);

				Observable.merge(allActionables, allDemands)
					.flatMap((x: any) => x.reduce((a, b) => a.concat(b)))
					.subscribe((response1: any) => {
						if (Object.keys(response1).some(x => x === 'ActionId')) {
							this.actionable.push(<ActionableModel>response1);
						}
						else if (Object.keys(response1).some(x => x === 'DemandId')) {
							this.demands.push(<DemandModel>response1);
						}
					}, (error) => { console.log(`Error: ${error.message}`); }, () => {
						if (unique.length > 0) {
							unique = unique.sort((a: DepartmentModel, b: DepartmentModel) => {
								return (a.DepartmentName.toUpperCase() > b.DepartmentName.toUpperCase()) ?
									1 : ((b.DepartmentName.toUpperCase() > a.DepartmentName.toUpperCase()) ? -1 : 0);
							});
							this.closuresToShow = unique.map((x: DepartmentModel) => {
								let item: DepartmentClosureModel = new DepartmentClosureModel();
								let closureItem = this.departmentClosures.find(y => {
									return y.DepartmentId === x.DepartmentId;
								});
								if (closureItem) {
									this.GetChecklistDemandCount(closureItem, x.DepartmentId);
									closureItem.Department = x;
									return closureItem;
								} else {
									this.GetChecklistDemandCount(item, x.DepartmentId);
									item.Department = x;
									return item;
								}
							});
						}
						if (this.closuresToShow.length > 0) {
							this.closuresToShow = this.closuresToShow.sort((a: DepartmentClosureModel, b: DepartmentClosureModel) => {
								return (a.Department.DepartmentName.toUpperCase() > b.Department.DepartmentName.toUpperCase()) ?
									1 : ((b.Department.DepartmentName.toUpperCase() > a.Department.DepartmentName.toUpperCase()) ? -1 : 0);
							});
							this.closuresToShow.forEach(x => {
								x.InitialNotify = false;
								x.SeperateNotify = false;
								x.InitialNotify = this.initialNotificationSend.some(z => x.Department.DepartmentId == z);
								x.SeperateNotify = this.notificationSeperatelySend.some(z => x.Department.DepartmentId == z);
							});
							this.closuresToShow.sort((a: DepartmentClosureModel, b: DepartmentClosureModel) => {
								if (a.Department.DepartmentName < b.Department.DepartmentName) return -1;
								if (a.Department.DepartmentName > b.Department.DepartmentName) return 1;
								return 0;
							});
							this.getIsSubmittedFlagValue(this.closuresToShow);
							this.closuresToShow.sort((a, b) => {
								if (a.Department.DepartmentName < b.Department.DepartmentName) return -1;
								if (a.Department.DepartmentName > b.Department.DepartmentName) return 1;

								return 0;
							});
						}
					});
			});
	}

	getIsSubmittedFlagValue(departmentClosureModels: DepartmentClosureModel[]): void {
		this.departmentClosureService.GetAllByIncident(this.currentIncident)
			.takeUntil(this.ngUnsubscribe)
			.subscribe((departmentClosures: ResponseModel<DepartmentClosureModel>) => {
				departmentClosureModels.forEach((item: DepartmentClosureModel) => {
					const filtered: DepartmentClosureModel[] = departmentClosures.Records
						.filter((dc: DepartmentClosureModel) => {
							return dc.DepartmentId == item.Department.DepartmentId;
						});
					if (filtered.length > 0) {
						item.IsSubmitted = filtered[0].IsSubmitted;
						item.SubmittedOn = new Date(filtered[0].SubmittedOn);
					}
				});
			}, (error: any) => {
				console.log(`Error: ${error.message}`);
			});
	}

	openCurrentDepartmentClosureReadonlyDetail(departmentId): void {
		this.departmentClosureService.getAllbyIncidentandDepartment(this.currentIncident, departmentId)
			.takeUntil(this.ngUnsubscribe)
			.subscribe((response: ResponseModel<DepartmentClosureModel>) => {
				this.report = '';
				this.remarks = '';
				if (response.Records.length > 0) {
					this.report = response.Records[0].ClosureReport;
					this.remarks = response.Records[0].ClosureRemark;
				}
				this.childModal.show();
			}, (error: any) => {
				console.log(`Error: ${error.message}`);
			});
	}

	cancel(): void {
		this.childModal.hide();
	}

	saveIncidentClosure(): void {
		if (this.incident.ClosureNote == null || this.incident.ClosureNote.toString().trim() == "") {
			this.toastrService.error('Closure Note is mandatory.', 'Error', this.toastrConfig);
		}
		else {
			this.incident.IsSaved = true;
			this.incident.SavedBy = +this.credential.UserId;
			this.incident.SavedOn = new Date();

			this.incidentService.Update(this.incident, this.incident.IncidentId)
				.subscribe(() => {
					this.toastrService.info('Closure Report Saved Successfully.', 'Success', this.toastrConfig);
				}, (error: any) => {
					console.log(`Error: ${error.message}`);
					this.toastrService.info('Some error occured.', 'Error', this.toastrConfig);
				});
		}
	}

	submitIncidentClosure(): void {
		if (this.incident.ClosureNote == null || this.incident.ClosureNote.toString().trim() == "") {
			this.toastrService.error('Closure Note is mandatory.', 'Error', this.toastrConfig);
		}
		else {
			this.incident.IsSubmitted = true;
			this.incident.SubmittedBy = +this.credential.UserId;
			this.incident.SubmittedOn = new Date();
			this.incident.ClosedBy = +this.credential.UserId;
			this.incident.ClosedOn = new Date();
			this.incident.ActiveFlag = 'InActive';

			this.incidentService.Update(this.incident, this.incident.IncidentId)
				.subscribe((resultIncident: IncidentModel) => {
					this.toastrService.success('Closure Report Saved Successfully.You will be logged out.', 'Success', this.toastrConfig);
					this.emergencyClosureService.GetEmergencyClosureDocumentPDFPath(this.incident.IncidentId)
						.map((reportPath: ReportPath) => {
							this.reportPath = new ReportPath();
							this.reportPath = reportPath;
						})
						.flatMap((_) => this.userPermissionService.GetActiveHODUsersOfCrisisTypeSpecificDepartments(this.incident.EmergencyTypeId))
						.map((response: UserPermissionModel[]) => {
							this.UserDepartmentNotificationMappers = [];
							this.UserDepartmentNotificationMappers = response.map((x) => {
								let y: NotificationContactsWithTemplateModel = new NotificationContactsWithTemplateModel();
								y.UserId = x.UserId;
								y.IsActive = ((typeof x.User.ActiveFlag == 'number' && x.User.ActiveFlag == 1) || (typeof x.User.ActiveFlag == 'string' && x.User.ActiveFlag == 'active'));
								y.IncidentId = this.currentIncident;
								y.DepartmentId = x.DepartmentId;
								y.CreatedBy = x.CreatedBy;
								y.UserName = x.User.Name;
								y.SituationId = 'EmergencyClosureToDepartmentHOD';
								y.ContactNumber = '';
								y.AlternetContactNumber = '';
								y.AttachmentSingle = this.reportPath.path;
								y.EmailId = x.User.Email;
								return y;
							});
						})
						.flatMap(() => this.emergencyClosureService.sendNotificationToDepartmentHOD(this.UserDepartmentNotificationMappers))
						.map(() => { })
						.takeUntil(this.ngUnsubscribe)
						.subscribe(() => {
							this.toastrService.success('Notification has been sent to the users.', 'Success', this.toastrConfig);
							this.authService.Logout();
							this.router.navigate(['login']);
						}, (error: any) => {
							console.log(`Error: ${error.message}`);
						});
				}, (error: any) => {
					console.log(error);
				});
		};

	}

	private GetChecklistDemandCount(item: DepartmentClosureModel, id: number): void {
		item.Checklistnumber = this.actionable.filter((z) => {
			return z.DepartmentId == id;
		}).length;
		item.ChecklistClosednumber = this.actionable.filter((z) => {
			return z.DepartmentId == id && z.CompletionStatusChangedBy != null;
		}).length;
		item.demandnumber = this.demands
			.filter((z) => z.TargetDepartmentId == id && !z.IsRejected).length;
		item.demandClosednumber = this.demands
			.filter((z) => z.TargetDepartmentId == id && z.IsCompleted != false && !z.IsRejected).length;
	}

	private departmentChangeHandler(department: KeyValue): void {
		this.currentDepartmentId = department.Value;
		if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'CloseEmergency'))
			this.GetIncident(this.currentIncident);
	}
}