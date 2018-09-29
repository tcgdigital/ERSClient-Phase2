import {
    Component, ViewEncapsulation, OnInit, AfterViewChecked,
    ElementRef, ViewChild, OnDestroy
} from '@angular/core';
import {
    MemberEngagementTrackModel, MemberCurrentEngagementModel,
    MemberCurrentEngagementModelToView
} from './components/member.track.model';
import { MemberTrackService } from './components/member.track.service';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import {
    ResponseModel, KeyValue, GlobalStateService,
    UtilityService, AuthModel, GlobalConstants
} from '../../shared';

import { UserProfileService, UserProfileModel } from '../masterdata/userprofile/components';
import { UserPermissionService, UserPermissionModel } from '../masterdata/userpermission/components';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'member-track-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/member.track.views.html',
    styleUrls: ['./styles/member.track.styles.scss']
})
export class MemberTrackComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('childModalHistory')
    public childModalHistory: ModalDirective;

    public currentUserId: number;
    public currentIncidentId: number;
    public currentDepartmentId: number;
    public memberTracks: MemberCurrentEngagementModel[] = [];
    public memberEngagementsToView: MemberCurrentEngagementModelToView[] = [];
    public userpermissions: UserPermissionModel[] = [];
    public isSubmited: boolean;
    public isRemarksSubmitted: boolean = false;
    public isChecked: boolean = false;
    public memberHistory: MemberEngagementTrackModel[] = [];
    public createdBy: number;
    public credential: AuthModel;
    public availblecount: number;
    public freecount: number;
    public downloadPath: string;
    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public isShowHistory: boolean = true;
    public isShowAllocationDeallocation: boolean = true;
    public isSelectedDept: boolean;
    public isMemberTrackingReportLink: boolean = true;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private globalState: GlobalStateService,
        private userProfileService: UserProfileService,
        private userpermissionService: UserPermissionService,
        private membertrackService: MemberTrackService,
        private elementRef: ElementRef,
        private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.pageInitialCall(this.currentDepartmentId, this.currentIncidentId);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    pageInitialCall(departmentId: number, incidentId: number): void {
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MemberTracking'))
            this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);

        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/MemberEngagementReport/' + this.currentIncidentId;
    }

    ngAfterViewChecked() {
        if (!this.isChecked && this.memberEngagementsToView.length > 0) {
            this.isChecked = true;
            this.GenerateToggle();
        }
    }

    public GenerateToggle(): void {
        const self = this;
        const $selfElement = jQuery(this.elementRef.nativeElement);
        const $inputs = $selfElement.find('input[data-userid]');

        jQuery.each($inputs, (index, element) => {
            jQuery(element).bootstrapToggle({
                on: 'Busy',
                off: 'Available'
            }, 'disable');
            jQuery(element).change(($event) => {
                self.datachanged($event);
            });
        });
    }

    public datachanged($event: any): void {
        const $element: JQuery = jQuery($event.currentTarget);
        const userId = $element.data('userid');
        const obj: MemberCurrentEngagementModelToView = this.memberEngagementsToView
            .find((x) => x.UserId.toString() == userId);

        if ($element.prop('checked')) {
            obj.isRemarksSubmitted = true;

            if (obj && obj.Remarks.length > 0) {
                const memberTrackModel: MemberEngagementTrackModel = new MemberEngagementTrackModel();
                memberTrackModel.DepartmentId = this.currentDepartmentId;
                memberTrackModel.IncidentId = this.currentIncidentId;
                memberTrackModel.UserId = userId;
                memberTrackModel.DeployedOn = new Date();
                memberTrackModel.Deploy = true;
                memberTrackModel.Remarks = obj.Remarks;
                memberTrackModel.UnDeploy = false;
                memberTrackModel.CreatedBy = this.createdBy;

                if (obj.MemberEngagementTrackId == null || obj.MemberEngagementTrackId == 0 || obj.MemberEngagementTrackId == undefined) {
                    const memberCurrentEngagementToSave: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
                    memberCurrentEngagementToSave.DepartmentId = this.currentDepartmentId;
                    memberCurrentEngagementToSave.IncidentId = this.currentIncidentId;
                    memberCurrentEngagementToSave.IsBusy = true;
                    memberCurrentEngagementToSave.UserId = userId;
                    memberCurrentEngagementToSave.MemberEngagementTrack = memberTrackModel;

                    this.membertrackService.Create(memberCurrentEngagementToSave)
                        .subscribe((response: MemberCurrentEngagementModel) => {
                            this.toastrService.success('Member is engaged now.');
                            this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });
                }
                else {
                    this.membertrackService.CreateMemberTrack(memberTrackModel)
                        .subscribe((response: MemberEngagementTrackModel) => {
                            const memberCurrentEngagementToedit: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
                            memberCurrentEngagementToedit.DepartmentId = this.currentDepartmentId;
                            memberCurrentEngagementToedit.IsBusy = true;
                            memberCurrentEngagementToedit.MemberEngagementTrackId = response.MemberEngagementTrackId;
                            memberCurrentEngagementToedit.deleteAttributes();

                            this.membertrackService.Update(memberCurrentEngagementToedit, obj.MemberCurrentEngagementId)
                                .subscribe((response1: MemberCurrentEngagementModel) => {
                                    this.toastrService.success('Member is engaged now.');
                                    this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
                                }, (error: any) => {
                                    console.log(`Error: ${error.message}`);
                                });
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });
                }
            }
            if (obj.Remarks.length == 0) {
                this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
                this.toastrService.error('Please Enter Work Details');
            }
            this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
        }
        else {
            if (obj.DepartmentId == this.currentDepartmentId) {
                const memberTrackModel: MemberEngagementTrackModel = new MemberEngagementTrackModel();
                memberTrackModel.deleteAttributes();
                memberTrackModel.MemberEngagementTrackId = obj.MemberEngagementTrackId;
                memberTrackModel.UnDeploy = true;
                memberTrackModel.UnDeployedOn = new Date();
                const memberCurrentEngagementToEdit: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
                memberCurrentEngagementToEdit.deleteAttributes();
                memberCurrentEngagementToEdit.MemberCurrentEngagementId = obj.MemberCurrentEngagementId;
                memberCurrentEngagementToEdit.IsBusy = false;

                this.membertrackService.Update(memberCurrentEngagementToEdit, memberCurrentEngagementToEdit.MemberCurrentEngagementId)
                    .flatMap(() => this.membertrackService.UpdateMemberTrack(memberTrackModel, memberTrackModel.MemberEngagementTrackId))
                    .subscribe(() => {
                        this.toastrService.success('Member is available now.');
                        this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
            else {
                this.toastrService.error('The department who has make this busy only that department can make it available.');
            }

        }
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.pageInitialCall(this.currentDepartmentId, this.currentIncidentId);
    }


    departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MemberTracking'))
            this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
    }

    incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/MemberEngagementReport/' + this.currentIncidentId;
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'MemberTracking'))
            this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
    }

    getMembarCurrentEngagementList(departmentId, incidentId): void {
        this.userpermissionService.GetAllDepartmentUsersWithUsers(departmentId)
            .map((response: ResponseModel<UserPermissionModel>) => {
                this.userpermissions = response.Records;
            })
            .flatMap((_) => this.membertrackService.GetAllByIncidentDepartment(departmentId, incidentId))
            .map((response1: ResponseModel<MemberCurrentEngagementModel>) => { this.memberTracks = response1.Records; })
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                this.isChecked = false;
                this.memberEngagementsToView = this.userpermissions.map((x) => {
                    const member: MemberCurrentEngagementModelToView = new MemberCurrentEngagementModelToView();
                    member.UserId = x.UserId;
                    member.MemberName = x.User.Name;
                    member.MemberContactNumber = x.User.MainContact;
                    member.IsNotyfied = (x.User.Notifications.length > 0) ? true : false;
                    member.IsAcknowledged = (x.User.Notifications.length > 0) ?
                        (x.User.Notifications.some((y) => y.AckStatus === 'Accepted')) : false;
                    member.IsBusy = false;
                    member.isVolunteered = x.User.isVolunteered;
                    member.Remarks = '';
                    if (this.memberTracks.length > 0 && this.memberTracks.find((y) => y.UserId === x.UserId) != null) {
                        let obj: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
                        obj = this.memberTracks.find((y) => y.UserId === x.UserId);

                        member.IsBusy = obj.MemberEngagementTrack.Deploy && !obj.MemberEngagementTrack.UnDeploy;
                        member.Remarks = member.IsBusy ? obj.MemberEngagementTrack.Remarks : '';
                        member.MemberCurrentEngagementId = obj.MemberCurrentEngagementId;
                        member.MemberEngagementTrackId = obj.MemberEngagementTrackId;
                        let gr: MemberCurrentEngagementModel = this.memberTracks.find((y) => y.MemberEngagementTrackId === member.MemberEngagementTrackId);
                        member.DepartmentId = gr.DepartmentId;
                    }
                    return member;
                });
                this.availblecount = this.memberEngagementsToView.filter((x) => x.IsBusy === false).length;
                this.freecount = this.memberEngagementsToView.filter((x) => x.IsBusy === true).length;
                this.GenerateToggle();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    open(id) {
        this.membertrackService.GetAllHistory(id, this.currentDepartmentId, this.currentIncidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<MemberEngagementTrackModel>) => {
                this.memberHistory = response.Records;

                this.memberHistory.forEach((x) => {
                    this.userProfileService.Get(x.CreatedBy)
                        .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe((response1: UserProfileModel) => {
                            x['createdby'] = response1.Name;
                        });
                });

                this.childModalHistory.show();
            });
    }

    cancelHistory() {
        this.childModalHistory.hide();
    }
}