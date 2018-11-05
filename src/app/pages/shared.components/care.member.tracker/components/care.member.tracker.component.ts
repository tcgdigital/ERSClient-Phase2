import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { CareMemberTrackerService } from './care.member.tracker.service';
import { CareMemberTrackerModel } from './care.member.tracker.model';
import { Subject, Observable } from 'rxjs';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, AuthModel, UtilityService, NameValue
} from '../../../../shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService, ToastConfig } from 'ngx-toastr';
import { AffectedPeopleService, AffectedPeopleModel } from '../../affected.people';

@Component({
    selector: 'care-member-tracker',
    encapsulation: ViewEncapsulation.None,
    // providers: [AffectedPeopleService],
    template: `
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header">
                        <form [formGroup]="careMemberForm" (ngSubmit)="onSubmitCareMember(careMemberForm.value)">
                            <div class="row">
                                <div class="col-sm-12 form-group">
                                    <label for="CareMemberName">CARE Member Name:</label>
                                    <div class="input-group">
                                        <input type="text" id="CareMemberName" formControlName="CareMemberName" class="form-control">
                                        <div class="input-group-append">
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fa fa-user-plus" aria-hidden="true"></i>&nbsp; Add Member
                                            </button>
                                        </div>
                                    </div>
                                    <small *ngIf="!careMemberForm.controls.CareMemberName.valid" 
                                        [hidden]="careMemberForm.controls.CareMemberName.valid || 
                                            (careMemberForm.controls.CareMemberName.pristine && !submitted)" class="text-danger">
                                        Invalid entry, Please try again
                                    </small>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-12">
                                <responsive-table>
                                    <table responsive-table-body>
                                        <thead>
                                            <th>CARE Member Name</th>
                                            <th>Assigned On</th>
                                            <th>Assigned By</th>
                                            <th>Department</th>
                                        </thead>
                                        <tbody>
                                            <tr [hidden]="careMembers.length != 0">
                                                <td colspan="4">No Care Members are available.</td>
                                            </tr>
                                            <tr *ngFor="let careMember of careMembers">
                                                <td data-title="CARE Member Name">{{careMember.CareMemberName}}&nbsp;</td>
                                                <td data-title="Assigned On">{{careMember.EffectedFrom | date: 'dd-MMM-yyyy HH:mm'}}&nbsp;</td>
                                                <td data-title="Assigned By">{{careMember.UserProfile.Name}}&nbsp;</td>
                                                <td data-title="Department">{{careMember.Department.DepartmentName}}&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </responsive-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CareMemberTrackerComponent implements OnInit, OnDestroy {
    public careMembers: CareMemberTrackerModel[] = [];
    @Input('currentIncidentId') public currentIncidentId: number = 0;
    @Input('currentDepartmentId') public currentDepartmentId: number = 0;
    public affectedPersonId: number = 0;

    public careMemberForm: FormGroup;
    public submitted: boolean;
    public careMemberEntity: CareMemberTrackerModel = null;

    private credential: AuthModel;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of CareMemberTrackerComponent.
     * @param {CareMemberTrackerService} careMemberTrackerService
     * @memberof CareMemberTrackerComponent
     */
    constructor(private careMemberTrackerService: CareMemberTrackerService,
        private dataExchange: DataExchangeService<number>,
        private toastrService: ToastrService,
        private affectedPeopleService: AffectedPeopleService,
        private dataExchangeCareMemberCreation: DataExchangeService<CareMemberTrackerModel>) { }

    ngOnInit(): void {
        this.credential = UtilityService.getCredentialDetails();
        this.submitted = false;
        this.initializeInputForm();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.AffectedPersonSelected,
            (affectedPersonId: number) => {
                this.affectedPersonId = affectedPersonId;

                this.careMemberTrackerService.GetCareMembersByAffectedPersonId
                    (this.currentIncidentId, affectedPersonId)
                    // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((response: ResponseModel<CareMemberTrackerModel>) => {
                        this.careMembers = response.Records;
                    });
            });
    }

    ngOnDestroy(): void {
        this.dataExchangeCareMemberCreation.Unsubscribe
            (GlobalConstants.DataExchangeConstant.CareMemberCreated);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onSubmitCareMember(formValue: any): void {
        this.submitted = true;

        if (this.careMemberForm.valid) {
            this.initiateCareMemberModel(this.currentIncidentId, this.currentDepartmentId, this.affectedPersonId);
            this.careMemberEntity.CareMemberName = this.careMemberForm.controls['CareMemberName'].value;

            this.careMemberTrackerService.Create(this.careMemberEntity)
                .subscribe((createdCareresponse: CareMemberTrackerModel) => {

                    this.initializeInputForm();
                    this.toastrService.success('Care member has been successfully added to the selected affected person.', 'Success');

                    this.affectedPeopleService.GetCurrentCareMember
                        (createdCareresponse.AffectedPersonId, createdCareresponse.CareEngagementTrackId)
                        // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe((affectedPersonResponse: ResponseModel<AffectedPeopleModel>) => {


                            if (affectedPersonResponse.Records.length > 0
                                && affectedPersonResponse.Records[0].CareMembers.length > 0) {
                                this.careMembers.unshift(...affectedPersonResponse.Records[0].CareMembers);

                                const affectedPerson: AffectedPeopleModel = affectedPersonResponse.Records[0];
                                const currentDepartmentName: string = affectedPerson.CareMembers[0].Department.DepartmentName;
                                delete affectedPerson.CareMembers;
                                affectedPerson.CurrentCareMemberName = createdCareresponse.CareMemberName;

                                this.affectedPeopleService
                                    .UpdateWithHeader(affectedPerson, new NameValue<string>('CurrentDepartmentName', currentDepartmentName))
                                    .subscribe((response: AffectedPeopleModel) => {

                                        this.dataExchangeCareMemberCreation.Publish
                                            (GlobalConstants.DataExchangeConstant.CareMemberCreated, createdCareresponse);
                                    }, (error: any) => {
                                        console.log(`Error: ${error.message}`);
                                    });

                            }
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });

                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
    }

    private initializeInputForm(): void {
        this.careMemberForm = new FormGroup({
            CareEngagementTrackId: new FormControl(0),
            CareMemberName: new FormControl('', [Validators.required, Validators.maxLength(500)])
        });

        this.submitted = false;
    }

    private initiateCareMemberModel(incidentId: number, departmentId: number, affectedPersonId: number): void {
        this.careMemberEntity = new CareMemberTrackerModel();
        this.careMemberEntity.ActiveFlag = 'Active';
        this.careMemberEntity.CreatedBy = +this.credential.UserId;
        this.careMemberEntity.CreatedOn = new Date();
        this.careMemberEntity.EffectedFrom = new Date();
        this.careMemberEntity.IncidentId = incidentId;
        this.careMemberEntity.DepartmentId = departmentId;
        this.careMemberEntity.AffectedPersonId = affectedPersonId;
        this.careMemberEntity.UserProfileId = +this.credential.UserId;
    }
}