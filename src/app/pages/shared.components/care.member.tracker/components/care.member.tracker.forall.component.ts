import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { AffectedPeopleService, AffectedPeopleModel } from '../../affected.people';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CareMemberTrackerModel } from './care.member.tracker.model';
import { AuthModel, UtilityService, ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';
import { Subject } from 'rxjs';
import { CareMemberTrackerService } from './care.member.tracker.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'care-member-for-all',
    encapsulation: ViewEncapsulation.None,
    // providers: [AffectedPeopleService],
    template: `
    <form [formGroup]="careMemberForAllForm" (ngSubmit)="onSubmitCareMemberForAll(careMemberForAllForm.value)">
        <div class="row">
            <div class="col-sm-12 form-group">
                <div class="input-group">
                    <input type="text" formControlName="CareMemberName" class="form-control">
                    <div class="input-group-append">
                        <button type="submit" class="btn btn-primary">
                            <i class="fa fa-user-plus" aria-hidden="true"></i>&nbsp; Add Member
                        </button>
                    </div>
                </div>
                <small *ngIf="careMemberForAllForm.controls.CareMemberName.invalid" 
                    [hidden]="careMemberForAllForm.controls.CareMemberName.valid || 
                        (careMemberForAllForm.controls.CareMemberName.pristine && !submitted)" class="text-danger">
                    Invalid enrty, Please try again
                </small>
            </div>
        </div>
    </form>`
})
export class CareMemberTrackerForAllComponent implements OnInit, OnDestroy {
    @Input('currentIncidentId') public currentIncidentId: number = 0;
    @Input('currentDepartmentId') public currentDepartmentId: number = 0;

    public careMemberForAllForm: FormGroup;
    public submitted: boolean;
    private credential: AuthModel;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private affectedPeopleService: AffectedPeopleService,
        private careMemberTrackerService: CareMemberTrackerService, 
        private toastrService: ToastrService,
        private dataExchangeCareMemberCreationForAllPDA: DataExchangeService<string>) {
    }

    public ngOnInit(): void {
        this.credential = UtilityService.getCredentialDetails();
        this.submitted = false;
        this.initializeInputForm();
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public onSubmitCareMemberForAll(data: any) {
        this.submitted = true;

        if (this.careMemberForAllForm.valid) {
            const careMemberName: string = this.careMemberForAllForm.controls['CareMemberName'].value;

            this.affectedPeopleService.GetAllAffectedPeopleIdsByIncidentId(this.currentIncidentId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((selectedAffectedPeople: ResponseModel<AffectedPeopleModel>) => {

                    if (selectedAffectedPeople.Records.length > 0) {
                        const selectedAffectedPeopleIds: number[] = selectedAffectedPeople
                            .Records.map((affectedPerson: AffectedPeopleModel) => affectedPerson.AffectedPersonId);

                        const careMembersForAllToInsert = this.initiateCareMemberModels
                            (this.currentIncidentId, this.currentDepartmentId, careMemberName, selectedAffectedPeopleIds);


                        this.careMemberTrackerService.CreateBulk(careMembersForAllToInsert)
                            .subscribe((createdCareMembers: CareMemberTrackerModel[]) => {
                                this.initializeInputForm();
                                this.toastrService.success('Care member has been successfully applied for all affected people.', 'Success');

                                this.dataExchangeCareMemberCreationForAllPDA.Publish
                                    (GlobalConstants.DataExchangeConstant.CareMemberForAllPDACreated, careMemberName);
                            }, (error: any) => {
                                console.log(`Error: ${error.message}`);
                            });
                    }
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
    }

    private initializeInputForm(): void {
        this.careMemberForAllForm = new FormGroup({
            CareEngagementTrackId: new FormControl(0),
            CareMemberName: new FormControl('', [Validators.required, Validators.maxLength(500)])
        });

        this.submitted = false;
    }

    private initiateCareMemberModels(incidentId: number, departmentId: number,
        careMemberName: string, affectedPersonIds: number[])
        : CareMemberTrackerModel[] {

        let result: CareMemberTrackerModel[] = affectedPersonIds.map((affectedPersonId: number) => {
            let careMemberEntity: CareMemberTrackerModel = new CareMemberTrackerModel();
            careMemberEntity.CareMemberName = careMemberName;
            careMemberEntity.ActiveFlag = 'Active';
            careMemberEntity.CreatedBy = +this.credential.UserId;
            careMemberEntity.CreatedOn = new Date();
            careMemberEntity.EffectedFrom = new Date();
            careMemberEntity.IncidentId = incidentId;
            careMemberEntity.DepartmentId = departmentId;
            careMemberEntity.AffectedPersonId = affectedPersonId;
            careMemberEntity.UserProfileId = +this.credential.UserId;
            return careMemberEntity;
        });

        return result
    }
}