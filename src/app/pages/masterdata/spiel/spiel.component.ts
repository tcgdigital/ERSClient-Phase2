import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import {
    FormGroup, FormControl, Validators
} from '@angular/forms';
import { KeyValueService, KeyValueModel, ResponseModel } from '../../../shared';
import { DepartmentService, DepartmentModel } from '../department';
import { Subject } from 'rxjs';

@Component({
    selector: 'dept-main',
    encapsulation: ViewEncapsulation.None,
    providers: [KeyValueService, DepartmentService],
    templateUrl: './views/spiel.entry.view.html',
    styleUrls: ['./styles/spiel.style.scss']
})
export class SpileComponent implements OnInit, OnDestroy {
    public data: any;
    public generalform: FormGroup;
    public submitted: boolean = false;
    public activeKeyValues: KeyValueModel[] = [];
    public activeDepartments: DepartmentModel[] = [];
    public isTextbox: boolean = false;
    public isTextArea: boolean = false;
    public isDropdown: boolean = false;
    private updatedKeyValue: KeyValueModel;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private keyValueService: KeyValueService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private departmentService: DepartmentService) { }

    public ngOnInit() {
        this.isTextbox = false;
        this.isTextArea = false;
        this.isDropdown = false;
        this.updatedKeyValue = new KeyValueModel();
        this.getAllActiveKeyValues();
        this.getAllActiveDepartments();
        this.initializeForm();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getAllActiveDepartments(): void {
        this.departmentService.GetAllActiveDepartments()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((departments: ResponseModel<DepartmentModel>) => {
                if (departments.Count > 0) {
                    this.activeDepartments = departments.Records;
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllActiveKeyValues(): void {
        this.keyValueService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<KeyValueModel>) => {
                this.activeKeyValues = response.Records;
                this.generalform.controls["SpielText"].setValue('');
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    initializeForm(): void {
        this.generalform = new FormGroup({
            SpielType: new FormControl('', [Validators.required]),
            SpielText: new FormControl('', [Validators.required])
        });
        this.isTextbox = false;
        this.isTextArea = false;
        this.isDropdown = false;
    }

    keyvalueChange(target: any, Key: string, activeKeyValues: KeyValueModel[]): void {
        if (Key != '') {
            let controlType: string = target.selectedOptions[0].getAttribute('ControlType');
            if (controlType.toLowerCase() == 'textbox') {
                this.isTextbox = true;
                this.isDropdown = false;
                this.isTextArea = false;
            }
            else if (controlType.toLowerCase() == 'textarea') {
                this.isTextbox = false;
                this.isDropdown = false;
                this.isTextArea = true;
            }
            else if (controlType.toLowerCase() == 'dropdown') {
                this.isTextbox = false;
                this.isDropdown = true;
                this.isTextArea = false;
            }
            const activeOrganization: KeyValueModel = activeKeyValues
                .find((x: KeyValueModel) => x.Key === Key);
            if (activeOrganization.ControlType.toLowerCase() == 'dropdown') {
                let departments: DepartmentModel[] = this.activeDepartments.filter((x: DepartmentModel) => {
                    return x.DepartmentId == +activeOrganization.Value;
                });
                if (departments.length == 0) {
                    this.generalform.controls["SpielText"].setValue('');
                }
                else {
                    this.generalform.controls["SpielText"].setValue(activeOrganization.Value);
                }
            }
            else {
                this.generalform.controls["SpielText"].setValue(activeOrganization.Value);
            }
        }
        else {
            this.generalform.controls["SpielText"].setValue('');
            this.isTextbox = false;
            this.isDropdown = false;
            this.isTextArea = false;
        }
    }

    public spielSave(): void {
        if (this.generalform.valid) {
            let KeyVal: KeyValueModel = null;

            const activeOrganization: KeyValueModel = this.activeKeyValues
                .find((x: KeyValueModel) => x.Key === this.generalform.controls["SpielType"].value);

            this.updatedKeyValue.Value = this.generalform.controls["SpielText"].value;
            KeyVal = this.updatedKeyValue;
            KeyVal.KeyValueId = activeOrganization.KeyValueId;
            if (KeyVal != null) {
                delete KeyVal.ActiveFlag;
                delete KeyVal.CreatedBy;
                delete KeyVal.CreatedOn;
                delete KeyVal.Description;
                delete KeyVal.Key;
                delete KeyVal.ControlType;
                this.keyValueService.Update(KeyVal, KeyVal.KeyValueId).subscribe(() => {
                    this.initializeForm();
                    this.getAllActiveKeyValues();
                    this.toastrService.success('Spiel Text Saved successfully.', 'Success', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                }
                );
            }
        }
        else {
            this.submitted = true;
        }
    }
}